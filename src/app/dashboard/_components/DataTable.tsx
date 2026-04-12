'use client';
import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (...args: any[]) => React.ReactNode;
  align?: 'right' | 'center' | 'left';
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  loading?: boolean;
}

export default function DataTable({ columns, data, emptyMessage = 'لا توجد بيانات', emptyIcon, loading }: DataTableProps) {
  if (loading) {
    return <div className="loading-state">جاري التحميل...</div>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: col.align || 'right' }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="empty-state">
                  {emptyIcon && <div className="empty-icon">{emptyIcon}</div>}
                  <div className="empty-title">{emptyMessage}</div>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id || i}>
                {columns.map((col) => (
                  <td key={col.key} style={{ textAlign: col.align || 'right' }}>
                    {col.render ? col.render(row[col.key], row, i) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
