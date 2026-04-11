/**
 * Toast notifications — بدون مكتبات خارجية
 * تُعرض رسالة إشعار مؤقتة في أسفل يمين الشاشة
 */
export function toast(msg: string, type: 'success' | 'error' | 'info' = 'info') {
  if (typeof document === 'undefined') return;
  const colors = {
    success: '#10B981',
    error: '#EF4444',
    info: '#C9A84C',
  };
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: colors[type],
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '10px',
    fontWeight: '700',
    zIndex: '99999',
    fontSize: '14px',
    fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif",
    direction: 'rtl',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    maxWidth: '340px',
    lineHeight: '1.5',
    transition: 'opacity 0.3s',
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

/** اختصار للنجاح */
export const toastOk = (msg: string) => toast(msg, 'success');
/** اختصار للخطأ */
export const toastErr = (msg: string) => toast(msg, 'error');
