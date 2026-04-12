/**
 * src/lib/integrations/firebase.ts
 * تكامل Firebase للإشعارات الفورية (Push Notifications)
 * المتغيرات المطلوبة: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL
 * أو: FIREBASE_SERVER_KEY (للإشعارات عبر Legacy API)
 */

// إرسال إشعار فوري لمستخدم واحد عبر FCM Token
export async function sendPushNotification(params: {
  fcmToken: string;
  title: string;
  message: string;
  data?: Record<string, string>;
}): Promise<{ success: boolean; error?: string }> {
  const serverKey = process.env.FIREBASE_SERVER_KEY || '';

  if (!serverKey) {
    return { success: false, error: 'Firebase غير مهيأ — أضف FIREBASE_SERVER_KEY في .env' };
  }

  try {
    const res = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: params.fcmToken,
        notification: {
          title: params.title,
          body: params.message,
          sound: 'default',
        },
        data: params.data || {},
        priority: 'high',
      }),
    });

    const result = await res.json();
    if (result.failure > 0) {
      return { success: false, error: result.results?.[0]?.error || 'فشل الإرسال' };
    }
    return { success: true };
  } catch {
    return { success: false, error: 'خطأ في الاتصال بـ Firebase' };
  }
}

// إرسال إشعار لمجموعة (Multicast) — حتى 500 token في المرة
export async function sendMulticastNotification(params: {
  fcmTokens: string[];
  title: string;
  message: string;
  data?: Record<string, string>;
}): Promise<{ success: boolean; successCount: number; failureCount: number; error?: string }> {
  const serverKey = process.env.FIREBASE_SERVER_KEY || '';

  if (!serverKey) {
    return { success: false, successCount: 0, failureCount: params.fcmTokens.length, error: 'Firebase غير مهيأ' };
  }

  if (!params.fcmTokens.length) {
    return { success: true, successCount: 0, failureCount: 0 };
  }

  try {
    const res = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registration_ids: params.fcmTokens.slice(0, 500),
        notification: {
          title: params.title,
          body: params.message,
          sound: 'default',
        },
        data: params.data || {},
        priority: 'high',
      }),
    });

    const result = await res.json();
    return {
      success: result.failure === 0,
      successCount: result.success || 0,
      failureCount: result.failure || 0,
    };
  } catch {
    return { success: false, successCount: 0, failureCount: params.fcmTokens.length, error: 'خطأ في الاتصال بـ Firebase' };
  }
}

// إرسال إشعار لموضوع (Topic) — لجميع المشتركين في موضوع معين
export async function sendTopicNotification(params: {
  topic: string;
  title: string;
  message: string;
  data?: Record<string, string>;
}): Promise<{ success: boolean; error?: string }> {
  const serverKey = process.env.FIREBASE_SERVER_KEY || '';

  if (!serverKey) {
    return { success: false, error: 'Firebase غير مهيأ' };
  }

  try {
    const res = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: `/topics/${params.topic}`,
        notification: {
          title: params.title,
          body: params.message,
        },
        data: params.data || {},
      }),
    });

    const result = await res.json();
    return result.message_id ? { success: true } : { success: false, error: 'فشل الإرسال' };
  } catch {
    return { success: false, error: 'خطأ في الاتصال بـ Firebase' };
  }
}
