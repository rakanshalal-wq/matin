'use client';
import React from 'react';

type BadgeVariant = 'green' | 'red' | 'blue' | 'gold' | 'purple';

const variantClass: Record<BadgeVariant, string> = {
  green: 'bg',
  red: 'br',
  blue: 'bb',
  gold: 'bgo',
  purple: 'bp',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({ children, variant = 'gold' }: BadgeProps) {
  return <span className={`badge ${variantClass[variant]}`}>{children}</span>;
}
