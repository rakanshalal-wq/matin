'use client';
import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  message?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, message = 'لا توجد بيانات', action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <div className="empty-state-text">{message}</div>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
