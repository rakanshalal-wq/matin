import { pool } from '@/lib/auth';

// ══════════════════════════════════════════════════════════════════
// جلب تكامل معين مع إعداداته
// ══════════════════════════════════════════════════════════════════
export async function getIntegration(name: string) {
  try {
    const result = await pool.query(
      'SELECT * FROM integrations WHERE name = $1 AND is_active = true',
      [name]
    );
    return result.rows[0] || null;
  } catch { return null; }
}

export async function getIntegrationConfig(name: string): Promise<Record<string, any> | null> {
  const intg = await getIntegration(name);
  if (!intg) return null;
  return intg.extra_config || {};
}

// ══════════════════════════════════════════════════════════════════
// MOYASAR - الدفع
// ══════════════════════════════════════════════════════════════════
export async function createMoyasarPayment(params: {
  amount: number; // بالهللات (1 ريال = 100 هللة)
  currency?: string;
  description: string;
  callback_url: string;
  source: { type: 'creditcard' | 'applepay' | 'stcpay'; name?: string; number?: string; cvc?: string; month?: string; year?: string; };
  metadata?: Record<string, any>;
}) {
  const config = await getIntegrationConfig('moyasar');
  if (!config?.secret_key) return { success: false, error: 'Moyasar غير مفعّل' };
  
  try {
    const res = await fetch('https://api.moyasar.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(config.secret_key + ':').toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency || 'SAR',
        description: params.description,
        callback_url: params.callback_url,
        source: params.source,
        metadata: params.metadata || {}
      })
    });
    const data = await res.json();
    return { success: res.ok, data, payment_url: data.source?.transaction_url };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function getMoyasarPayment(paymentId: string) {
  const config = await getIntegrationConfig('moyasar');
  if (!config?.secret_key) return null;
  try {
    const res = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': 'Basic ' + Buffer.from(config.secret_key + ':').toString('base64') }
    });
    return await res.json();
  } catch { return null; }
}

// ══════════════════════════════════════════════════════════════════
// TABBY - الدفع بالتقسيط
// ══════════════════════════════════════════════════════════════════
export async function createTabbySession(params: {
  amount: number;
  currency?: string;
  description: string;
  buyer: { name: string; email: string; phone: string; };
  order_id: string;
  success_url: string;
  cancel_url: string;
  failure_url: string;
  items?: Array<{ title: string; quantity: number; unit_price: number; }>;
}) {
  const config = await getIntegrationConfig('tabby');
  if (!config?.public_key) return { success: false, error: 'Tabby غير مفعّل' };
  
  const isTest = config.test_mode;
  const baseUrl = isTest ? 'https://api.tabby.ai' : 'https://api.tabby.ai';
  
  try {
    const res = await fetch(`${baseUrl}/api/v2/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + config.secret_key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        payment: {
          amount: String(params.amount),
          currency: params.currency || 'SAR',
          description: params.description,
          buyer: params.buyer,
          order: {
            reference_id: params.order_id,
            items: params.items || [{ title: params.description, quantity: 1, unit_price: String(params.amount) }]
          },
          buyer_history: { registered_since: new Date().toISOString(), loyalty_level: 0 },
          order_history: []
        },
        lang: 'ar',
        merchant_code: config.merchant_code,
        merchant_urls: {
          success: params.success_url,
          cancel: params.cancel_url,
          failure: params.failure_url
        }
      })
    });
    const data = await res.json();
    return { success: res.ok, data, checkout_url: data.configuration?.available_products?.installments?.[0]?.web_url };
  } catch (e: any) { return { success: false, error: e.message }; }
}

// ══════════════════════════════════════════════════════════════════
// TAMARA - الدفع بالتقسيط
// ══════════════════════════════════════════════════════════════════
export async function createTamaraOrder(params: {
  amount: number;
  currency?: string;
  description: string;
  customer: { first_name: string; last_name: string; email: string; phone_number: string; };
  order_reference_id: string;
  success_url: string;
  cancel_url: string;
  failure_url: string;
  items?: Array<{ name: string; quantity: number; unit_price: { amount: number; currency: string; }; }>;
}) {
  const config = await getIntegrationConfig('tamara');
  if (!config?.api_token) return { success: false, error: 'Tamara غير مفعّل' };
  
  const isTest = config.test_mode;
  const baseUrl = isTest ? 'https://api-sandbox.tamara.co' : 'https://api.tamara.co';
  
  try {
    const res = await fetch(`${baseUrl}/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + config.api_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_reference_id: params.order_reference_id,
        total_amount: { amount: String(params.amount), currency: params.currency || 'SAR' },
        description: params.description,
        country_code: 'SA',
        payment_type: 'PAY_BY_INSTALMENTS',
        instalments: 3,
        customer: params.customer,
        items: params.items || [{ name: params.description, quantity: 1, unit_price: { amount: String(params.amount), currency: params.currency || 'SAR' }, total_amount: { amount: String(params.amount), currency: params.currency || 'SAR' }, type: 'Digital' }],
        merchant_url: { success: params.success_url, failure: params.failure_url, cancel: params.cancel_url, notification: config.merchant_url + '/api/tamara/webhook' }
      })
    });
    const data = await res.json();
    return { success: res.ok, data, checkout_url: data.checkout_url };
  } catch (e: any) { return { success: false, error: e.message }; }
}

// ══════════════════════════════════════════════════════════════════
// SMSA - الشحن
// ══════════════════════════════════════════════════════════════════
export async function createSmsaShipment(params: {
  consignee_name: string;
  consignee_address: string;
  consignee_city: string;
  consignee_phone: string;
  weight: number;
  cod_amount?: number;
  description?: string;
  reference?: string;
}) {
  const config = await getIntegrationConfig('smsa');
  if (!config?.api_key) return { success: false, error: 'SMSA غير مفعّل' };
  
  const isTest = config.test_mode;
  const baseUrl = isTest ? 'https://sam.smsaexpress.com/STAGINGSetXML/api' : 'https://sam.smsaexpress.com/SetXML/api';
  
  try {
    const res = await fetch(`${baseUrl}/addShipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': config.api_key,
        'passKey': config.passkey
      },
      body: JSON.stringify({
        ConsigneeName: params.consignee_name,
        ConsigneeAddress: params.consignee_address,
        ConsigneeCity: params.consignee_city,
        ConsigneePhone: params.consignee_phone,
        Weight: params.weight,
        CODAmount: params.cod_amount || 0,
        ShipperCity: config.sender_city || 'RUH',
        Description: params.description || 'شحنة متين',
        RefNumber: params.reference || `MTN-${Date.now()}`
      })
    });
    const data = await res.json();
    return { success: res.ok, data, awb: data.AWBNo };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function trackSmsaShipment(awb: string) {
  const config = await getIntegrationConfig('smsa');
  if (!config?.api_key) return null;
  try {
    const res = await fetch(`https://sam.smsaexpress.com/SetXML/api/getTracking?awbNo=${awb}`, {
      headers: { 'apiKey': config.api_key, 'passKey': config.passkey }
    });
    return await res.json();
  } catch { return null; }
}

// ══════════════════════════════════════════════════════════════════
// ARAMEX - الشحن
// ══════════════════════════════════════════════════════════════════
export async function createAramexShipment(params: {
  consignee: { name: string; address: string; city: string; country: string; phone: string; email?: string; };
  weight: number;
  description?: string;
  cod_amount?: number;
  reference?: string;
}) {
  const config = await getIntegrationConfig('aramex');
  if (!config?.username) return { success: false, error: 'Aramex غير مفعّل' };
  
  const isTest = config.test_mode;
  const baseUrl = isTest ? 'https://ws.dev.aramex.net' : 'https://ws.aramex.net';
  
  try {
    const res = await fetch(`${baseUrl}/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ClientInfo: {
          UserName: config.username,
          Password: config.password,
          Version: 'v1.0',
          AccountNumber: config.account_number,
          AccountPin: config.account_pin,
          AccountEntity: config.account_entity || 'RUH',
          AccountCountryCode: config.account_country_code || 'SA',
          Source: 24
        },
        Shipments: [{
          Shipper: {
            AccountNumber: config.account_number,
            PartyAddress: { CountryCode: 'SA', City: config.account_entity || 'Riyadh' },
            Contact: { PersonName: 'متين', PhoneNumber1: '0500000000' }
          },
          Consignee: {
            PartyAddress: { CountryCode: params.consignee.country || 'SA', City: params.consignee.city, Line1: params.consignee.address },
            Contact: { PersonName: params.consignee.name, PhoneNumber1: params.consignee.phone, EmailAddress: params.consignee.email || '' }
          },
          ShippingDateTime: '/Date(' + Date.now() + ')/',
          DueDate: '/Date(' + (Date.now() + 86400000) + ')/',
          Comments: params.description || 'شحنة متين',
          PickupLocation: 'Front Desk',
          OperationsInstructions: '',
          AccountingInstrcutions: '',
          ServiceType: 'PPX',
          ForeignHAWB: params.reference || `MTN-${Date.now()}`,
          Details: {
            Dimensions: { Length: 10, Width: 10, Height: 10 },
            ActualWeight: { Unit: 'KG', Value: params.weight },
            ChargeableWeight: { Unit: 'KG', Value: params.weight },
            DescriptionOfGoods: params.description || 'بضاعة',
            GoodsOriginCountry: 'SA',
            NumberOfPieces: 1,
            ProductGroup: 'DOM',
            ProductType: 'PPX',
            PaymentType: 'P',
            PaymentOptions: '',
            CustomsValueAmount: { CurrencyCode: 'SAR', Value: params.cod_amount || 0 },
            CashOnDeliveryAmount: { CurrencyCode: 'SAR', Value: params.cod_amount || 0 }
          }
        }],
        LabelInfo: { ReportID: 9201, ReportType: 'URL' }
      })
    });
    const data = await res.json();
    const shipment = data.Shipments?.[0];
    return { 
      success: !data.HasErrors, 
      data, 
      awb: shipment?.ID,
      label_url: shipment?.ShipmentLabel?.LabelURL
    };
  } catch (e: any) { return { success: false, error: e.message }; }
}

// ══════════════════════════════════════════════════════════════════
// WHATSAPP - الرسائل
// ══════════════════════════════════════════════════════════════════
export async function sendWhatsApp(phone: string, message: string) {
  const config = await getIntegrationConfig('whatsapp');
  if (!config?.access_token || !config?.phone_number_id) return { success: false, error: 'واتساب غير مفعّل' };
  
  try {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('966') ? cleanPhone : cleanPhone.startsWith('0') ? '966' + cleanPhone.slice(1) : '966' + cleanPhone;
    
    const res = await fetch(`https://graph.facebook.com/v18.0/${config.phone_number_id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + config.access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: { body: message }
      })
    });
    const data = await res.json();
    return { success: res.ok, data, message_id: data.messages?.[0]?.id };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function sendWhatsAppTemplate(phone: string, template_name: string, language: string, components?: any[]) {
  const config = await getIntegrationConfig('whatsapp');
  if (!config?.access_token) return { success: false, error: 'واتساب غير مفعّل' };
  
  try {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('966') ? cleanPhone : '966' + (cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone);
    
    const res = await fetch(`https://graph.facebook.com/v18.0/${config.phone_number_id}/messages`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + config.access_token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: { name: template_name, language: { code: language || 'ar' }, components: components || [] }
      })
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (e: any) { return { success: false, error: e.message }; }
}

// ══════════════════════════════════════════════════════════════════
// SMS - تقنيات
// ══════════════════════════════════════════════════════════════════
export async function sendSMS(phone: string, message: string) {
  const config = await getIntegrationConfig('taqnyat');
  if (!config?.api_key) {
    // جرب unifonic كبديل
    return sendSMSUnifonic(phone, message);
  }
  
  try {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('966') ? cleanPhone : cleanPhone.startsWith('0') ? '966' + cleanPhone.slice(1) : '966' + cleanPhone;
    
    const res = await fetch('https://api.taqnyat.sa/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + config.api_key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipients: [formattedPhone],
        body: message,
        sender: config.sender || 'Matin'
      })
    });
    const data = await res.json();
    return { success: res.ok, data, provider: 'taqnyat' };
  } catch (e: any) { return { success: false, error: e.message }; }
}

async function sendSMSUnifonic(phone: string, message: string) {
  const config = await getIntegrationConfig('unifonic');
  if (!config?.app_id) return { success: false, error: 'SMS غير مفعّل' };
  
  try {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('966') ? cleanPhone : cleanPhone.startsWith('0') ? '966' + cleanPhone.slice(1) : '966' + cleanPhone;
    
    const res = await fetch('https://el.cloud.unifonic.com/rest/SMS/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        AppSid: config.app_id,
        SenderID: config.sender_id || 'Matin',
        Body: message,
        Recipient: formattedPhone
      })
    });
    const data = await res.json();
    return { success: res.ok, data, provider: 'unifonic' };
  } catch (e: any) { return { success: false, error: e.message }; }
}

// ══════════════════════════════════════════════════════════════════
// EMAIL - Resend
// ══════════════════════════════════════════════════════════════════
export async function sendEmail(to: string | string[], subject: string, html: string, text?: string) {
  const config = await getIntegrationConfig('resend');
  const apiKey = config?.api_key || process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: 'Resend غير مفعّل — أضف API key من لوحة التكاملات' };
  const from = config?.from_email || 'no-reply@matin.ink';
  const fromName = config?.from_name || 'منصة متين';
  
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${fromName} <${from}>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text: text || ''
      })
    });
    const data = await res.json();
    return { success: res.ok, data, id: data.id };
  } catch (e: any) { return { success: false, error: e.message }; }
}

// ══════════════════════════════════════════════════════════════════
// NAFATH - التحقق الوطني
// ══════════════════════════════════════════════════════════════════
export async function initiateNafathVerification(national_id: string, service_id?: string) {
  const config = await getIntegrationConfig('nafath');
  if (!config?.client_id) return { success: false, error: 'نفاذ غير مفعّل' };
  
  const isProduction = config.environment === 'production';
  const baseUrl = isProduction 
    ? 'https://nafath.api.elm.sa' 
    : 'https://nafath.api.elm.sa'; // نفس الـ URL، يتغير بالـ credentials
  
  try {
    // الخطوة 1: طلب رمز التحقق
    const res = await fetch(`${baseUrl}/api/v1/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app-id': config.client_id,
        'app-key': config.client_secret
      },
      body: JSON.stringify({
        nin: national_id,
        service: service_id || config.service_id,
        lang: 'ar'
      })
    });
    const data = await res.json();
    return { 
      success: res.ok, 
      data,
      session_id: data.sessionId,
      random: data.random, // الرقم العشوائي الذي يظهر للمستخدم في تطبيق نفاذ
      expires_in: data.expiresIn
    };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function checkNafathVerification(session_id: string, national_id: string) {
  const config = await getIntegrationConfig('nafath');
  if (!config?.client_id) return { success: false, error: 'نفاذ غير مفعّل' };
  
  try {
    const res = await fetch(`https://nafath.api.elm.sa/api/v1/session/${session_id}/status`, {
      headers: {
        'app-id': config.client_id,
        'app-key': config.client_secret
      }
    });
    const data = await res.json();
    return { 
      success: res.ok,
      status: data.status, // PENDING | COMPLETED | EXPIRED | REJECTED
      verified: data.status === 'COMPLETED',
      data
    };
  } catch (e: any) { return { success: false, error: e.message }; }
}

// ══════════════════════════════════════════════════════════════════
// FIREBASE FCM - الإشعارات
// ══════════════════════════════════════════════════════════════════
export async function sendFirebaseNotification(params: {
  token?: string;
  topic?: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  image?: string;
}) {
  const config = await getIntegrationConfig('firebase');
  if (!config?.project_id) return { success: false, error: 'Firebase غير مفعّل' };
  
  try {
    // استخدام Legacy API إذا كان server_key موجوداً
    if (config.server_key) {
      const res = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Authorization': 'key=' + config.server_key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...(params.token ? { to: params.token } : { to: '/topics/' + (params.topic || 'all') }),
          notification: {
            title: params.title,
            body: params.body,
            image: params.image
          },
          data: params.data || {}
        })
      });
      const data = await res.json();
      return { success: res.ok && data.success > 0, data };
    }
    
    // استخدام HTTP v1 API
    return { success: false, error: 'يرجى إضافة Server Key لتفعيل الإشعارات' };
  } catch (e: any) { return { success: false, error: e.message }; }
}

// ══════════════════════════════════════════════════════════════════
// OTP - إرسال عبر أفضل قناة متاحة
// ══════════════════════════════════════════════════════════════════
export async function sendOTP(phone: string, email: string, name: string, code: string) {
  const message = `مرحباً ${name}، رمز التحقق الخاص بك في متين: ${code} (صالح 10 دقائق)`;
  const html = `
    <div dir="rtl" style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px;background:#0D1B2A;color:white;border-radius:12px">
      <div style="text-align:center;margin-bottom:24px">
        <div style="width:60px;height:60px;background:linear-gradient(135deg,#C9A227,#E8C547);border-radius:16px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:28px">&#9733;</div>
        <h2 style="color:#C9A227;margin:0">مرحباً ${name}</h2>
      </div>
      <p style="color:rgba(255,255,255,0.8)">رمز تسجيل الدخول الخاص بك:</p>
      <div style="background:#1B263B;border:2px solid #C9A227;border-radius:12px;padding:24px;text-align:center;margin:20px 0">
        <span style="font-size:48px;font-weight:900;letter-spacing:16px;color:#C9A227">${code}</span>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;text-align:center">صالح لمدة 10 دقائق فقط. لا تشاركه مع أحد.</p>
      <hr style="border-color:rgba(255,255,255,0.1);margin:20px 0">
      <p style="color:rgba(255,255,255,0.3);font-size:11px;text-align:center">منصة متين التعليمية - matin.ink</p>
    </div>
  `;
  
  // الأولوية: SMS → WhatsApp → Email
  if (phone) {
    const sms = await sendSMS(phone, message);
    if (sms.success) return { success: true, channel: 'sms' };
    
    const wa = await sendWhatsApp(phone, message);
    if (wa.success) return { success: true, channel: 'whatsapp' };
  }
  
  if (email) {
    const emailResult = await sendEmail(email, 'رمز تسجيل الدخول - متين', html);
    return { success: emailResult.success, channel: 'email' };
  }
  
  return { success: false, error: 'لا توجد وسيلة تواصل متاحة' };
}

// ══════════════════════════════════════════════════════════════════
// GOOGLE MAPS
// ══════════════════════════════════════════════════════════════════
export async function getGoogleMapsKey(): Promise<string> {
  const config = await getIntegrationConfig('google_maps');
  return config?.api_key || process.env.GOOGLE_MAPS_KEY || '';
}

// ══════════════════════════════════════════════════════════════════
// جلب بيانات الدفع (للتوافق مع الكود القديم)
// ══════════════════════════════════════════════════════════════════
export async function getPaymentCredentials(provider: string) {
  const config = await getIntegrationConfig(provider);
  if (!config) return null;
  return { api_key: config.api_key || config.publishable_key || config.public_key, api_secret: config.secret_key || config.api_secret, extra: config };
}

export async function getPaymentPublicKeys() {
  const [moyasar, tabby, tamara, stc] = await Promise.all([
    getIntegrationConfig('moyasar'),
    getIntegrationConfig('tabby'),
    getIntegrationConfig('tamara'),
    getIntegrationConfig('stc_pay')
  ]);
  
  return {
    moyasar: moyasar ? { publishable_key: moyasar.publishable_key, test_mode: moyasar.test_mode } : null,
    tabby: tabby ? { public_key: tabby.public_key, merchant_code: tabby.merchant_code, test_mode: tabby.test_mode } : null,
    tamara: tamara ? { enabled: true, test_mode: tamara.test_mode } : null,
    stc_pay: stc ? { merchant_id: stc.merchant_id, test_mode: stc.test_mode } : null
  };
}
