'use client';
import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  align?: 'right' | 'center' | 'left';
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export default function DataTable({ columns, data, emptyMessage = 'لا توجد بيانات', emptyIcon }: DataTableProps) {
  return (
    <div className="table-wrap">
      <table className="dtable">
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
                  {emptyIcon && <div className="empty-state-icon">{emptyIcon}</div>}
                  <div className="empty-state-text">{emptyMessage}</div>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id || i}>
                {columns.map((col) => (
                  <td key={col.key} style={{ textAlign: col.align || 'right' }}>
                    {col.render ? col.render(row) : row[col.key] || '—'}
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
