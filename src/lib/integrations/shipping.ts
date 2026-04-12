/**
 * src/lib/integrations/shipping.ts
 * تكامل شركات الشحن: Aramex، SMSA، DHL، FedEx
 * المتغيرات المطلوبة: ARAMEX_API_KEY, ARAMEX_ACCOUNT_NUMBER, SMSA_API_KEY
 */

export { createDhlShipment, trackDhlShipment, createFedExShipment, trackFedExShipment } from '@/lib/integrations-advanced';

// ═══════════════════════════════════════════════════════════
// Aramex — الشحن المحلي السعودي
// ═══════════════════════════════════════════════════════════

export async function createAramexShipment(params: {
  orderReference: string;
  recipient: {
    name: string;
    phone: string;
    city: string;
    address: string;
    country?: string;
  };
  weight?: number;
  description?: string;
  codAmount?: number; // الدفع عند الاستلام
}) {
  const apiKey         = process.env.ARAMEX_API_KEY || '';
  const accountNumber  = process.env.ARAMEX_ACCOUNT_NUMBER || '';
  const accountPin     = process.env.ARAMEX_ACCOUNT_PIN || '';
  const accountEntity  = process.env.ARAMEX_ACCOUNT_ENTITY || 'AMM';
  const accountCountry = process.env.ARAMEX_ACCOUNT_COUNTRY || 'SA';

  if (!apiKey || !accountNumber) {
    return { error: 'Aramex غير مهيأ — أضف ARAMEX_API_KEY و ARAMEX_ACCOUNT_NUMBER في .env' };
  }

  try {
    const payload = {
      ClientInfo: {
        UserName: apiKey,
        Password: accountPin,
        Version: 'v1',
        AccountNumber: accountNumber,
        AccountPin: accountPin,
        AccountEntity: accountEntity,
        AccountCountryCode: accountCountry,
      },
      Shipments: [{
        Reference1: params.orderReference,
        Shipper: {
          Reference1: params.orderReference,
          AccountNumber: accountNumber,
          PartyAddress: { CountryCode: accountCountry, City: 'Riyadh', Line1: 'شركة متين' },
          Contact: { Department: 'Logistics', PersonName: 'متين', Title: 'Mr.', CompanyName: 'Matin' },
        },
        Consignee: {
          Reference1: params.orderReference,
          PartyAddress: {
            CountryCode: params.recipient.country || 'SA',
            City: params.recipient.city,
            Line1: params.recipient.address,
          },
          Contact: { PersonName: params.recipient.name, PhoneNumber1: params.recipient.phone },
        },
        Details: {
          Dimensions: { Length: 30, Width: 20, Height: 10, Unit: 'CM' },
          ActualWeight: { Value: params.weight || 1, Unit: 'KG' },
          ProductType: 'PPX',
          PaymentType: params.codAmount ? 'PPTT' : 'PP',
          Services: params.codAmount ? 'COD' : '',
          NumberOfPieces: 1,
          DescriptionOfGoods: params.description || 'منتج',
          CashOnDeliveryAmount: params.codAmount ? { Amount: params.codAmount, CurrencyCode: 'SAR' } : undefined,
        },
      }],
    };

    const res = await fetch('https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const shipment = data.Shipments?.[0];
    if (!shipment?.ID) return { error: 'فشل إنشاء شحنة Aramex', details: data };

    return {
      tracking_number: shipment.ID,
      label_url: shipment.ShipmentLabel?.LabelURL,
    };
  } catch {
    return { error: 'خطأ في الاتصال بـ Aramex' };
  }
}

export async function trackAramexShipment(trackingNumber: string) {
  const apiKey        = process.env.ARAMEX_API_KEY || '';
  const accountNumber = process.env.ARAMEX_ACCOUNT_NUMBER || '';
  const accountPin    = process.env.ARAMEX_ACCOUNT_PIN || '';

  if (!apiKey) return null;

  try {
    const res = await fetch('https://ws.aramex.net/ShippingAPI.V2/Tracking/Service_1_0.svc/json/TrackShipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ClientInfo: { UserName: apiKey, Password: accountPin, Version: 'v1', AccountNumber: accountNumber },
        Shipments: [trackingNumber],
      }),
    });
    const data = await res.json();
    return data.TrackingResults?.[0] || null;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
// SMSA Express — الشحن المحلي السعودي
// ═══════════════════════════════════════════════════════════

export async function createSMSAShipment(params: {
  orderReference: string;
  recipient: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
  weight?: number;
  codAmount?: number;
}) {
  const apiKey    = process.env.SMSA_API_KEY || '';
  const passKey   = process.env.SMSA_PASS_KEY || '';

  if (!apiKey) {
    return { error: 'SMSA غير مهيأ — أضف SMSA_API_KEY في .env' };
  }

  try {
    const res = await fetch('https://track.smsaexpress.com/RESTAPI/api/addshipments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${apiKey}:${passKey}`).toString('base64')}`,
      },
      body: JSON.stringify({
        passkey: passKey,
        RefNum: params.orderReference,
        Receiver: params.recipient.name,
        ReceiverAdd: params.recipient.address,
        ReceiverCity: params.recipient.city,
        ReceiverPhone: params.recipient.phone,
        ItemDesc: 'منتج',
        Weight: params.weight || 1,
        Quantity: 1,
        CODAmount: params.codAmount || 0,
        CurrencyCode: 'SAR',
      }),
    });

    const data = await res.json();
    if (!data.AWBNo) return { error: 'فشل إنشاء شحنة SMSA', details: data };

    return { tracking_number: data.AWBNo };
  } catch {
    return { error: 'خطأ في الاتصال بـ SMSA' };
  }
}

export async function trackSMSAShipment(trackingNumber: string) {
  const passKey = process.env.SMSA_PASS_KEY || '';
  try {
    const res = await fetch(`https://track.smsaexpress.com/RESTAPI/api/gettracking?passkey=${passKey}&awbno=${trackingNumber}`);
    const data = await res.json();
    return data || null;
  } catch {
    return null;
  }
}
