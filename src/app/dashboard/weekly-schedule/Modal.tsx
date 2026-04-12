'use client';
export const dynamic = 'force-dynamic';
export default function Modal({ title, onClose, children }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ background: '#1a1a2e', border: '1px solid #333' }}>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #333' }}>
          <h3 className="font-black text-lg text-white">{title}</h3>
          <button onClick={onClose} style={{ color: '#888', fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
