import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'no-reply@matin.ink';

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: `متين <${FROM}>`,
      to,
      subject: 'مرحباً بك في متين',
      html: `
        <div dir="rtl" style="font-family:'IBM Plex Sans Arabic',Arial,sans-serif;max-width:600px;margin:0 auto;background:#06060E;color:#EEEEF5;padding:40px 30px;border-radius:16px;">
          <div style="text-align:center;margin-bottom:30px;">
            <div style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#B8943A);color:#fff;width:60px;height:60px;border-radius:14px;line-height:60px;font-size:24px;font-weight:800;">م</div>
          </div>
          <h1 style="color:#C9A84C;font-size:24px;text-align:center;margin-bottom:10px;">مرحباً بك، ${name}</h1>
          <p style="color:rgba(238,238,245,0.7);text-align:center;font-size:15px;line-height:1.8;margin-bottom:30px;">تم إنشاء حسابك بنجاح في منصة متين للتعليم الذكي. حسابك قيد المراجعة وسيتم تفعيله قريباً.</p>
          <div style="text-align:center;margin-bottom:30px;">
            <a href="https://matin.ink/login" style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#B8943A);color:#fff;padding:12px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">تسجيل الدخول</a>
          </div>
          <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;text-align:center;color:rgba(238,238,245,0.3);font-size:12px;">
            <p>متين للتعليم الذكي | matin.ink</p>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error };
  }
}

export async function sendOTPEmail(to: string, otp: string) {
  try {
    await resend.emails.send({
      from: `متين <${FROM}>`,
      to,
      subject: `رمز التحقق: ${otp}`,
      html: `
        <div dir="rtl" style="font-family:'IBM Plex Sans Arabic',Arial,sans-serif;max-width:600px;margin:0 auto;background:#06060E;color:#EEEEF5;padding:40px 30px;border-radius:16px;">
          <div style="text-align:center;margin-bottom:30px;">
            <div style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#B8943A);color:#fff;width:60px;height:60px;border-radius:14px;line-height:60px;font-size:24px;font-weight:800;">م</div>
          </div>
          <h2 style="color:#C9A84C;text-align:center;margin-bottom:10px;">رمز التحقق</h2>
          <div style="text-align:center;margin:20px 0;">
            <div style="display:inline-block;background:rgba(201,168,76,0.15);border:2px solid rgba(201,168,76,0.3);padding:16px 40px;border-radius:12px;font-size:32px;font-weight:800;letter-spacing:8px;color:#C9A84C;">${otp}</div>
          </div>
          <p style="color:rgba(238,238,245,0.5);text-align:center;font-size:13px;">الرمز صالح لمدة 10 دقائق. لا تشاركه مع أحد.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('OTP email error:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  try {
    await resend.emails.send({
      from: `متين <${FROM}>`,
      to,
      subject: 'إعادة تعيين كلمة المرور',
      html: `
        <div dir="rtl" style="font-family:'IBM Plex Sans Arabic',Arial,sans-serif;max-width:600px;margin:0 auto;background:#06060E;color:#EEEEF5;padding:40px 30px;border-radius:16px;">
          <div style="text-align:center;margin-bottom:30px;">
            <div style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#B8943A);color:#fff;width:60px;height:60px;border-radius:14px;line-height:60px;font-size:24px;font-weight:800;">م</div>
          </div>
          <h2 style="color:#C9A84C;text-align:center;margin-bottom:10px;">إعادة تعيين كلمة المرور</h2>
          <p style="color:rgba(238,238,245,0.7);text-align:center;font-size:14px;line-height:1.8;margin-bottom:24px;">تلقينا طلباً لإعادة تعيين كلمة المرور. اضغط الزر أدناه:</p>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="${resetLink}" style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#B8943A);color:#fff;padding:12px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">تعيين كلمة مرور جديدة</a>
          </div>
          <p style="color:rgba(238,238,245,0.4);text-align:center;font-size:12px;">الرابط صالح لمدة ساعة واحدة. إذا لم تطلب ذلك تجاهل هذا البريد.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Password reset email error:', error);
    return { success: false, error };
  }
}

export async function sendInvoiceEmail(to: string, name: string, plan: string, amount: string) {
  try {
    await resend.emails.send({
      from: `متين <${FROM}>`,
      to,
      subject: 'فاتورة الاشتراك - متين',
      html: `
        <div dir="rtl" style="font-family:'IBM Plex Sans Arabic',Arial,sans-serif;max-width:600px;margin:0 auto;background:#06060E;color:#EEEEF5;padding:40px 30px;border-radius:16px;">
          <div style="text-align:center;margin-bottom:30px;">
            <div style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#B8943A);color:#fff;width:60px;height:60px;border-radius:14px;line-height:60px;font-size:24px;font-weight:800;">م</div>
          </div>
          <h2 style="color:#C9A84C;text-align:center;margin-bottom:20px;">فاتورة الاشتراك</h2>
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span style="color:rgba(238,238,245,0.5);">الاسم:</span><span>${name}</span></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span style="color:rgba(238,238,245,0.5);">الباقة:</span><span style="color:#C9A84C;font-weight:700;">${plan}</span></div>
            <div style="display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.1);padding-top:10px;"><span style="color:rgba(238,238,245,0.5);">المبلغ:</span><span style="font-size:18px;font-weight:800;color:#C9A84C;">${amount} ر.س</span></div>
          </div>
          <p style="color:rgba(238,238,245,0.4);text-align:center;font-size:12px;">شكراً لاختيارك متين للتعليم الذكي</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Invoice email error:', error);
    return { success: false, error };
  }
}

export async function sendPaymentNoticeEmail(to: string, studentName: string, amount: string) {
  try {
    await resend.emails.send({
      from: `متين <${FROM}>`,
      to,
      subject: 'إشعار استلام دفعة - متين',
      html: `
        <div dir="rtl" style="font-family:'IBM Plex Sans Arabic',Arial,sans-serif;max-width:600px;margin:0 auto;background:#06060E;color:#EEEEF5;padding:40px 30px;border-radius:16px;">
          <div style="text-align:center;margin-bottom:30px;">
            <div style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#B8943A);color:#fff;width:60px;height:60px;border-radius:14px;line-height:60px;font-size:24px;font-weight:800;">م</div>
          </div>
          <h2 style="color:#10B981;text-align:center;margin-bottom:20px;">إشعار استلام دفعة</h2>
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span style="color:rgba(238,238,245,0.5);">اسم الطالب:</span><span>${studentName}</span></div>
            <div style="display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.1);padding-top:10px;"><span style="color:rgba(238,238,245,0.5);">المبلغ:</span><span style="font-size:18px;font-weight:800;color:#10B981;">${amount} ر.س</span></div>
          </div>
          <p style="color:rgba(238,238,245,0.4);text-align:center;font-size:12px;">شكراً لثقتكم بمتين للتعليم الذكي</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Payment notice email error:', error);
    return { success: false, error };
  }
}
