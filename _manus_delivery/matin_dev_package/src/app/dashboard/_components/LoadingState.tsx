'use client';
import React from 'react';

export default function LoadingState({ message = 'جاري التحميل...' }: { message?: string }) {
  return (
    <div className="loading-state">
      <div className="loading-state-inner">
        <div className="loading-state-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <p className="loading-state-text">{message}</p>
      </div>
    </div>
  );
}
