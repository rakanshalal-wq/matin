'use client';
import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleIcon?: React.ReactNode;
  large?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({ open, onClose, title, titleIcon, large, children, footer }: ModalProps) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box${large ? ' modal-box-lg' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{titleIcon}{title}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
