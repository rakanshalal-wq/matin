import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import { getPaymentCredentials } from '@/lib/integrations';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const school_id = searchParams.get('school_id');

    // جلب المنتجات للعموم
    if (type === 'products') {
      let query = 'SELECT * FROM store_products WHERE is_active = true';
      const params: any[] = [];
      if (school_id) { params.push(school_id); query += ` AND school_id = $${params.length}`; }
      query += ' ORDER BY created_at DESC';
      const result = await pool.query(query, params);
      return NextResponse.json(result.rows);
    }

    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    if (type === 'orders') {
      const result = await pool.query(`SELECT * FROM store_orders WHERE 1=1 ${filter.sql} ORDER BY created_at DESC LIMIT 200`, filter.params);
      return NextResponse.json(result.rows);
    }

    // افتراضي: المنتجات للداشبورد
    const result = await pool.query(`SELECT * FROM store_products WHERE 1=1 ${filter.sql} ORDER BY created_at DESC LIMIT 200`, filter.params);
    return NextResponse.json(result.rows);
  } catch (error) { console.error('Error:', error); return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);
    const body = await request.json();
    const { action } = body;

    // === إضافة للسلة ===
    if (action === 'add_to_cart') {
      const { product_id, quantity } = body;
      if (!product_id) return NextResponse.json({ error: 'المنتج مطلوب' }, { status: 400 });
      const userId = user.id || user.user_id;
      const id = require('crypto').randomUUID();
      const result = await pool.query(
        `INSERT INTO cart_items (id, user_id, product_id, quantity, school_id, owner_id, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,NOW())
         ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart_items.quantity + $4, updated_at = NOW()
         RETURNING *`,
        [id, userId, product_id, quantity || 1, ids.school_id, ids.owner_id]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }

    // === عرض السلة ===
    if (action === 'get_cart') {
      const userId = user.id || user.user_id;
      const result = await pool.query(`
        SELECT ci.*, sp.name, sp.price, sp.image_url, sp.description,
               (ci.quantity * sp.price) as subtotal
        FROM cart_items ci
        LEFT JOIN store_products sp ON sp.id = ci.product_id
        WHERE ci.user_id = $1
        ORDER BY ci.created_at DESC
      `, [userId]);
      const total = result.rows.reduce((sum: number, item: any) => sum + (parseFloat(item.subtotal) || 0), 0);
      return NextResponse.json({ items: result.rows, total, count: result.rows.length });
    }

    // === حذف من السلة ===
    if (action === 'remove_from_cart') {
      const { cart_item_id, product_id } = body;
      const userId = user.id || user.user_id;
      if (cart_item_id) {
        await pool.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [cart_item_id, userId]);
      } else if (product_id) {
        await pool.query('DELETE FROM cart_items WHERE product_id = $1 AND user_id = $2', [product_id, userId]);
      }
      return NextResponse.json({ success: true });
    }

    // === تحديث كمية ===
    if (action === 'update_quantity') {
      const { cart_item_id, quantity } = body;
      if (!cart_item_id || !quantity) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
      if (quantity <= 0) {
        await pool.query('DELETE FROM cart_items WHERE id = $1', [cart_item_id]);
      } else {
        await pool.query('UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2', [quantity, cart_item_id]);
      }
      return NextResponse.json({ success: true });
    }

    // === إنشاء طلب (Checkout) ===
    if (action === 'checkout') {
      const userId = user.id || user.user_id;
      const { payment_method, shipping_address, notes } = body;
      
      // جلب عناصر السلة
      const cartItems = await pool.query(`
        SELECT ci.*, sp.price, sp.name FROM cart_items ci
        LEFT JOIN store_products sp ON sp.id = ci.product_id
        WHERE ci.user_id = $1
      `, [userId]);
      
      if (cartItems.rows.length === 0) {
        return NextResponse.json({ error: 'السلة فارغة' }, { status: 400 });
      }
      
      const total = cartItems.rows.reduce((sum: number, item: any) => sum + (item.quantity * parseFloat(item.price || 0)), 0);
      const orderId = require('crypto').randomUUID();
      
      // إنشاء الطلب
      const order = await pool.query(
        `INSERT INTO store_orders (id, user_id, items, total_amount, payment_method, payment_status, order_status, shipping_address, notes, school_id, owner_id, created_at)
         VALUES ($1,$2,$3,$4,$5,'pending','pending',$6,$7,$8,$9,NOW()) RETURNING *`,
        [orderId, userId, JSON.stringify(cartItems.rows), total, payment_method || 'online', shipping_address || null, notes || null, ids.school_id, ids.owner_id]
      );

      // تحديث مخزون المنتجات
      for (const item of cartItems.rows) {
        await pool.query('UPDATE store_products SET stock = GREATEST(stock - $1, 0) WHERE id = $2', [item.quantity, item.product_id]);
      }

      // تفريغ السلة
      await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

      // ===== بنية بوابة الدفع الجاهزة =====
      // عند التعاقد مع شركة مدفوعات، فقط أضف الكود هنا:
      // 
      // const paymentSettings = await pool.query('SELECT * FROM payment_settings WHERE school_id = $1', [ids.school_id]);
      // const settings = paymentSettings.rows[0];
      // 
      // if (settings && settings.provider === 'stripe') {
      //   const stripe = require('stripe')(settings.api_key);
      //   const session = await stripe.checkout.sessions.create({
      //     payment_method_types: ['card'],
      //     line_items: cartItems.rows.map(item => ({
      //       price_data: { currency: 'sar', product_data: { name: item.name }, unit_amount: Math.round(item.price * 100) },
      //       quantity: item.quantity
      //     })),
      //     mode: 'payment',
      //     success_url: `${process.env.NEXT_PUBLIC_URL}/store/success?order_id=${orderId}`,
      //     cancel_url: `${process.env.NEXT_PUBLIC_URL}/store/cancel`,
      //     metadata: { order_id: orderId }
      //   });
      //   return NextResponse.json({ order: order.rows[0], payment_url: session.url });
      // }
      //
      // if (settings && settings.provider === 'moyasar') {
      //   // كود Moyasar هنا
      // }
      //
      // if (settings && settings.provider === 'tap') {
      //   // كود Tap Payments هنا
      // }
      // ===== نهاية بنية بوابة الدفع =====

      return NextResponse.json({ 
        order: order.rows[0], 
        message: 'تم إنشاء الطلب بنجاح',
        payment_note: 'بوابة الدفع غير مفعلة حالياً - سيتم تفعيلها عند التعاقد مع شركة مدفوعات'
      }, { status: 201 });
    }

    // === جلب طلبات المستخدم ===
    if (action === 'my_orders') {
      const userId = user.id || user.user_id;
      const result = await pool.query(
        `SELECT * FROM store_orders WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
      );
      return NextResponse.json(result.rows);
    }

    // === تحديث حالة طلب (أدمن) ===
    if (action === 'update_order') {
      const { order_id, order_status, payment_status } = body;
      if (!order_id) return NextResponse.json({ error: 'معرف الطلب مطلوب' }, { status: 400 });
      const updates: string[] = [];
      const values: any[] = [];
      let idx = 1;
      if (order_status) { updates.push(`order_status = $${idx++}`); values.push(order_status); }
      if (payment_status) { updates.push(`payment_status = $${idx++}`); values.push(payment_status); }
      updates.push(`updated_at = NOW()`);
      values.push(order_id);
      const result = await pool.query(
        `UPDATE store_orders SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      return NextResponse.json(result.rows[0]);
    }

    // === إضافة منتج جديد (أدمن) ===
    const { name, description, price, category, image_url, stock, is_active } = body;
    if (!name || !price) return NextResponse.json({ error: 'الاسم والسعر مطلوبان' }, { status: 400 });
    const id = require('crypto').randomUUID();
    const result = await pool.query(
      `INSERT INTO store_products (id, name, description, price, category, image_url, stock, is_active, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *`,
      [id, name, description || null, price, category || 'general', image_url || null, stock || 0, is_active !== false, ids.school_id, ids.owner_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, type } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    if (type === 'order') {
      const { status, payment_status } = body;
      const result = await pool.query('UPDATE store_orders SET status=$1, payment_status=$2 WHERE id=$3 RETURNING *', [status, payment_status, id]);
      return NextResponse.json(result.rows[0]);
    }

    const { name, description, price, sale_price, image, category, stock, is_active } = body;
    const result = await pool.query(
      'UPDATE store_products SET name=$1, description=$2, price=$3, sale_price=$4, image=$5, category=$6, stock=$7, is_active=$8 WHERE id=$9 RETURNING *',
      [name, description, price, sale_price, image, category, stock, is_active, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    if (type === 'order') await pool.query('DELETE FROM store_orders WHERE id = $1', [id]);
    else await pool.query('DELETE FROM store_products WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
