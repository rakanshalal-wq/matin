import Link from "next/link";

export default function TopBar() {
  return (
    <>
      <style jsx>{`
        .topbar {
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          height: 60px;
          background: #0D1B2A;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-mark {
          width: 36px;
          height: 36px;
          background: #C9A227;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: #0D1B2A;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
        }

        .org-name {
          color: #94A3B8;
          font-size: 13px;
          padding-right: 16px;
          border-right: 1px solid #243B53;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(34, 119, 74, 0.2);
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          color: #4ADE80;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: #4ADE80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .topbar-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: #94A3B8;
          cursor: pointer;
          position: relative;
          transition: all 0.15s;
        }

        .topbar-btn:hover {
          background: #1B263B;
          color: #fff;
        }

        .notif-count {
          position: absolute;
          top: 6px;
          left: 6px;
          min-width: 16px;
          height: 16px;
          background: #B91C1C;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 600;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1B263B;
          padding: 4px 12px 4px 4px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .user-menu:hover {
          background: #243B53;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: #C9A227;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #0D1B2A;
        }

        .user-info {
          text-align: right;
        }

        .user-name {
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          margin: 0;
        }

        .user-role {
          font-size: 11px;
          color: #94A3B8;
          margin: 0;
        }
      `}</style>

      <div className="topbar">
        <div className="topbar-right">
          <Link href="/dashboard" className="logo">
            <div className="logo-mark">م</div>
            <span className="logo-text">متين</span>
          </Link>
          <div className="org-name">نظام إدارة المدارس</div>
          <div className="status-badge">
            <span className="status-dot"></span>
            النظام يعمل
          </div>
        </div>

        <div className="topbar-left">
          <button className="topbar-btn" title="البحث">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <button className="topbar-btn" title="الإشعارات">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="notif-count">7</span>
          </button>

          <button className="topbar-btn" title="الرسائل">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="notif-count">3</span>
          </button>

          <div className="user-menu">
            <div className="user-info">
              <p className="user-name">راكان شلال</p>
              <p className="user-role">المالك الأصلي</p>
            </div>
            <div className="user-avatar">ر</div>
          </div>
        </div>
      </div>
    </>
  );
}
