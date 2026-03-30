'use client';
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'بحث...' }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ maxWidth: 400 }}
      />
    </div>
  );
}
