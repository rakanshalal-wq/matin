import toast from 'react-hot-toast';

/**
 * عرض رسالة نجاح احترافية
 */
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#fff',
      fontSize: '14px',
      borderRadius: '8px',
      padding: '16px',
    },
  });
};

/**
 * عرض رسالة خطأ احترافية
 */
export const showError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#fff',
      fontSize: '14px',
      borderRadius: '8px',
      padding: '16px',
    },
  });
};

/**
 * عرض رسالة تحذير احترافية
 */
export const showWarning = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#F59E0B',
      color: '#fff',
      fontSize: '14px',
      borderRadius: '8px',
      padding: '16px',
    },
    icon: '⚠️',
  });
};

/**
 * عرض رسالة معلومات احترافية
 */
export const showInfo = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontSize: '14px',
      borderRadius: '8px',
      padding: '16px',
    },
    icon: 'ℹ️',
  });
};

/**
 * عرض رسالة تحميل
 */
export const showLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#6B7280',
      color: '#fff',
      fontSize: '14px',
      borderRadius: '8px',
      padding: '16px',
    },
  });
};

/**
 * تحديث رسالة تحميل
 */
export const updateToast = (toastId: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
  toast.remove(toastId);
  if (type === 'success') showSuccess(message);
  else if (type === 'error') showError(message);
  else showInfo(message);
};
