/**
 * lib/integrations-advanced.ts — التكاملات المتقدمة
 *
 * يحتوي على تكاملات: Zoom، Stripe، Telr، DHL، FedEx
 * يُستدعى من API Routes المتعلقة بالمحاضرات والدفع والشحن
 */

// ══════════════════════════════════════════════════════════════════
// 🎥 Zoom — المحاضرات المباشرة
// ══════════════════════════════════════════════════════════════════

export async function createZoomMeeting(params: {
  title: string;
  startTime: Date;
  duration?: number; // بالدقائق
  timezone?: string;
}) {
  const apiKey    = process.env.ZOOM_API_KEY    || '';
  const apiSecret = process.env.ZOOM_API_SECRET || '';
  const accountId = process.env.ZOOM_ACCOUNT_ID || '';

  if (!apiKey || !accountId) {
    return { error: 'Zoom غير مهيأ — أضف ZOOM_API_KEY و ZOOM_ACCOUNT_ID في .env' };
  }

  try {
    // الحصول على Access Token عبر OAuth (Server-to-Server)
    const tokenRes = await fetch('https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + accountId, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return { error: 'فشل الحصول على Zoom Token' };

    // إنشاء الاجتماع
    const meetingRes = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: params.title,
        type: 2, // Scheduled meeting
        start_time: params.startTime.toISOString(),
        duration: params.duration || 60,
        timezone: params.timezone || 'Asia/Riyadh',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          waiting_room: true,
          recording: { local_recording: true },
        },
      }),
    });

    const meeting = await meetingRes.json();
    return {
      meeting_id: meeting.id?.toString(),
      join_url: meeting.join_url,
      start_url: meeting.start_url,
      password: meeting.password,
    };
  } catch (err) {
    return { error: 'خطأ في الاتصال بـ Zoom' };
  }
}

export async function getZoomMeeting(meetingId: string) {
  const apiKey    = process.env.ZOOM_API_KEY    || '';
  const apiSecret = process.env.ZOOM_API_SECRET || '';
  const accountId = process.env.ZOOM_ACCOUNT_ID || '';

  if (!apiKey) return null;

  try {
    const tokenRes = await fetch('https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + accountId, {
      method: 'POST',
      headers: { 'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64') },
    });
    const { access_token } = await tokenRes.json();
    if (!access_token) return null;

    const res = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      headers: { 'Authorization': `Bearer ${access_token}` },
    });
    return await res.json();
  } catch {
    return null;
  }
}

// ══════════════════════════════════════════════════════════════════
// 💳 Stripe — الدفع الدولي
// ══════════════════════════════════════════════════════════════════

export async function createStripePaymentIntent(params: {
  amount: number;       // بالوحدة الصغرى للعملة (cents/halalas)
  currency?: string;
  description?: string;
  metadata?: Record<string, string>;
}) {
  const secretKey = process.env.STRIPE_SECRET_KEY || '';

  if (!secretKey) {
    return { error: 'Stripe غير مهيأ — أضف STRIPE_SECRET_KEY في .env' };
  }

  try {
    const res = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: params.amount.toString(),
        currency: params.currency || 'sar',
        description: params.description || 'Matin Payment',
        ...Object.fromEntries(
          Object.entries(params.metadata || {}).map(([k, v]) => [`metadata[${k}]`, v])
        ),
      }),
    });

    const intent = await res.json();
    if (intent.error) return { error: intent.error.message };

    return {
      id: intent.id,
      client_secret: intent.client_secret,
      status: intent.status,
    };
  } catch {
    return { error: 'خطأ في الاتصال بـ Stripe' };
  }
}

export async function getStripePaymentIntent(intentId: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY || '';
  if (!secretKey) return null;

  try {
    const res = await fetch(`https://api.stripe.com/v1/payment_intents/${intentId}`, {
      headers: { 'Authorization': `Bearer ${secretKey}` },
    });
    return await res.json();
  } catch {
    return null;
  }
}

// ══════════════════════════════════════════════════════════════════
// 💳 Telr — بوابة دفع محلية (الإمارات/السعودية)
// ══════════════════════════════════════════════════════════════════

export async function createTelrOrder(params: {
  amount: number;
  currency?: string;
  description: string;
  orderId: string;
  returnUrl: string;
  cancelUrl: string;
  customer: { name: string; email: string; phone?: string; };
}) {
  const storeId  = process.env.TELR_STORE_ID   || '';
  const authKey  = process.env.TELR_AUTH_KEY    || '';
  const testMode = process.env.NODE_ENV !== 'production';

  if (!storeId || !authKey) {
    return { error: 'Telr غير مهيأ — أضف TELR_STORE_ID و TELR_AUTH_KEY في .env' };
  }

  try {
    const res = await fetch('https://secure.telr.com/gateway/order.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ivp_method: 'create',
        ivp_store: storeId,
        ivp_authkey: authKey,
        ivp_cart: params.orderId,
        ivp_test: testMode ? 1 : 0,
        ivp_amount: params.amount.toFixed(2),
        ivp_currency: params.currency || 'SAR',
        ivp_desc: params.description,
        return_auth: params.returnUrl,
        return_can: params.cancelUrl,
        return_decl: params.cancelUrl,
        bill_fname: params.customer.name.split(' ')[0],
        bill_sname: params.customer.name.split(' ').slice(1).join(' ') || '-',
        bill_email: params.customer.email,
        bill_tel: params.customer.phone || '',
      }),
    });

    const data = await res.json();
    if (data.error) return { error: data.error.message };

    return {
      order_ref: data.order?.ref,
      payment_url: `https://secure.telr.com/gateway/process.html?o=${data.order?.ref}`,
    };
  } catch {
    return { error: 'خطأ في الاتصال بـ Telr' };
  }
}

// ══════════════════════════════════════════════════════════════════
// 📦 DHL — شحن دولي
// ══════════════════════════════════════════════════════════════════

export async function createDhlShipment(params: {
  shipper: { name: string; phone: string; address: string; city: string; country: string; postal: string; };
  recipient: { name: string; phone: string; address: string; city: string; country: string; postal: string; };
  weight_kg: number;
  description: string;
  value: number;
  currency?: string;
}) {
  const apiKey = process.env.DHL_API_KEY || '';
  const apiSecret = process.env.DHL_API_SECRET || '';

  if (!apiKey) {
    return { error: 'DHL غير مهيأ — أضف DHL_API_KEY في .env' };
  }

  try {
    const res = await fetch('https://express.api.dhl.com/mydhlapi/shipments', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plannedShippingDateAndTime: new Date().toISOString(),
        pickup: { isRequested: false },
        productCode: 'P',
        accounts: [{ typeCode: 'shipper', number: process.env.DHL_ACCOUNT_NUMBER || '' }],
        shipper: {
          companyName: params.shipper.name,
          phone: params.shipper.phone,
          address: {
            addressLine1: params.shipper.address,
            cityName: params.shipper.city,
            countryCode: params.shipper.country,
            postalCode: params.shipper.postal,
          },
        },
        consignee: {
          companyName: params.recipient.name,
          phone: params.recipient.phone,
          address: {
            addressLine1: params.recipient.address,
            cityName: params.recipient.city,
            countryCode: params.recipient.country,
            postalCode: params.recipient.postal,
          },
        },
        packages: [{
          weight: params.weight_kg,
          dimensions: { length: 20, width: 15, height: 10 },
        }],
        content: {
          unitOfMeasurement: 'metric',
          incoterm: 'DAP',
          description: params.description,
          declaredValue: params.value,
          declaredValueCurrency: params.currency || 'SAR',
        },
      }),
    });

    const data = await res.json();
    if (data.detail) return { error: data.detail };

    return {
      tracking_number: data.shipmentTrackingNumber,
      label_url: data.documents?.[0]?.url,
    };
  } catch {
    return { error: 'خطأ في الاتصال بـ DHL' };
  }
}

export async function trackDhlShipment(trackingNumber: string) {
  const apiKey = process.env.DHL_API_KEY || '';
  const apiSecret = process.env.DHL_API_SECRET || '';
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://express.api.dhl.com/mydhlapi/shipments/${trackingNumber}/tracking`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
        },
      }
    );
    return await res.json();
  } catch {
    return null;
  }
}

// ══════════════════════════════════════════════════════════════════
// 📦 FedEx — شحن دولي
// ══════════════════════════════════════════════════════════════════

export async function getFedExAuthToken(): Promise<string | null> {
  const clientId     = process.env.FEDEX_CLIENT_ID     || '';
  const clientSecret = process.env.FEDEX_CLIENT_SECRET || '';
  if (!clientId) return null;

  try {
    const res = await fetch('https://apis.fedex.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    const data = await res.json();
    return data.access_token || null;
  } catch {
    return null;
  }
}

export async function createFedExShipment(params: {
  shipper: { name: string; phone: string; address: string; city: string; country: string; postal: string; };
  recipient: { name: string; phone: string; address: string; city: string; country: string; postal: string; };
  weight_kg: number;
  description: string;
}) {
  const token = await getFedExAuthToken();
  const accountNumber = process.env.FEDEX_ACCOUNT_NUMBER || '';

  if (!token) {
    return { error: 'FedEx غير مهيأ — أضف FEDEX_CLIENT_ID و FEDEX_CLIENT_SECRET في .env' };
  }

  try {
    const res = await fetch('https://apis.fedex.com/ship/v1/shipments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        labelResponseOptions: 'URL_ONLY',
        requestedShipment: {
          shipper: {
            contact: { personName: params.shipper.name, phoneNumber: params.shipper.phone },
            address: {
              streetLines: [params.shipper.address],
              city: params.shipper.city,
              countryCode: params.shipper.country,
              postalCode: params.shipper.postal,
            },
          },
          recipients: [{
            contact: { personName: params.recipient.name, phoneNumber: params.recipient.phone },
            address: {
              streetLines: [params.recipient.address],
              city: params.recipient.city,
              countryCode: params.recipient.country,
              postalCode: params.recipient.postal,
            },
          }],
          pickupType: 'DROP_BOX',
          serviceType: 'INTERNATIONAL_ECONOMY',
          packagingType: 'YOUR_PACKAGING',
          requestedPackageLineItems: [{
            weight: { units: 'KG', value: params.weight_kg },
          }],
        },
        accountNumber: { value: accountNumber },
      }),
    });

    const data = await res.json();
    if (data.errors) return { error: data.errors[0]?.message };

    const output = data.output?.transactionShipments?.[0];
    return {
      tracking_number: output?.masterTrackingNumber,
      label_url: output?.pieceResponses?.[0]?.packageDocuments?.[0]?.url,
    };
  } catch {
    return { error: 'خطأ في الاتصال بـ FedEx' };
  }
}

export async function trackFedExShipment(trackingNumber: string) {
  const token = await getFedExAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('https://apis.fedex.com/track/v1/trackingnumbers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        includeDetailedScans: true,
        trackingInfo: [{ trackingNumberInfo: { trackingNumber } }],
      }),
    });
    return await res.json();
  } catch {
    return null;
  }
}
