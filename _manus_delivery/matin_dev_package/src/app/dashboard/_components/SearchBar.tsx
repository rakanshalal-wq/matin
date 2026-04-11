'use client';
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxWidth?: number;
}

export default function SearchBar({ value, onChange, placeholder = 'بحث...', maxWidth = 400 }: SearchBarProps) {
  return (
    <div className="search-wrap" style={{ maxWidth }}>
      <Search size={14} color="rgba(238,238,245,0.3)" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
