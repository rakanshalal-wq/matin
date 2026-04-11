'use client';
import React from 'react';
import Link from 'next/link';

interface StatCardProps {
  value: string | number;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  href?: string;
}

export default function StatCard({ value, label, subtitle, icon, color = '#D4A843', href }: StatCardProps) {
  const grad = `linear-gradient(135deg, ${color}0d 0%, transparent 60%)`;
  const content = (
    <div className="stat-card" style={{ ['--grad' as any]: grad }}>
      {icon && (
        <div className="stat-icon" style={{ background: `${color}1a`, border: `1px solid ${color}33` }}>
          {icon}
        </div>
      )}
      <div className="stat-val" style={{ color }}>{value}</div>
      <div className="stat-lbl">{label}</div>
      {subtitle && <div className="stat-sub" style={{ color: `${color}99` }}>{subtitle}</div>}
    </div>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link>;
  }
  return content;
}
