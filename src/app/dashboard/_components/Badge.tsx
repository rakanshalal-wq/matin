'use client';
import React from 'react';

type BadgeVariant = 'green' | 'red' | 'blue' | 'gold' | 'purple' | 'orange' | 'gray';

const variantClass: Record<BadgeVariant, string> = {
  green: 'badge-green',
  red: 'badge-red',
  blue: 'badge-blue',
  gold: 'badge-gold',
  purple: 'badge-purple',
  orange: 'badge-orange',
  gray: 'badge-gray',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({ children, variant = 'gold' }: BadgeProps) {
  return <span className={`badge ${variantClass[variant]}`}>{children}</span>;
}
