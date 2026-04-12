'use client';
import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  message?: string;
  title?: string;
  action?: React.ReactNode;
  description?: React.ReactNode;
}

export default function EmptyState({ icon, message, title, action, description }: EmptyStateProps) {
  const displayText = message || title || 'لا توجد بيانات';
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <div className="empty-state-text">{displayText}</div>
      {(action || description) && <div style={{ marginTop: 16 }}>{action ?? description}</div>}
    </div>
  );
}
