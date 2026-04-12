'use client';
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, icon, actions, action }: PageHeaderProps) {
  return (
    <div className="page-hdr">
      <div>
        <div className="page-title">
          {icon}
          {title}
        </div>
        {subtitle && <div className="page-sub">{subtitle}</div>}
      </div>
      {(actions || action) && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}{action}</div>}
    </div>
  );
}
