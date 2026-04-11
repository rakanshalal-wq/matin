import React from 'react';

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  color?: string;
  striped?: boolean;
  hoverable?: boolean;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  color = '#D4A843',
  striped = true,
  hoverable = true,
}) => {
  const tableStyles: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '580px',
  };

  const headerStyles: React.CSSProperties = {
    background: `${color}08`,
    padding: '11px 16px',
    textAlign: 'right',
    color: color,
    fontWeight: 700,
    fontSize: '11.5px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    whiteSpace: 'nowrap',
  };

  const cellStyles: React.CSSProperties = {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    fontSize: '13px',
    color: '#EEEEF5',
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyles}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ ...headerStyles, width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                background:
                  striped && rowIndex % 2 === 0
                    ? 'rgba(255,255,255,0.01)'
                    : 'transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                if (hoverable) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.015)';
                }
              }}
              onMouseLeave={(e) => {
                if (hoverable) {
                  e.currentTarget.style.background =
                    striped && rowIndex % 2 === 0
                      ? 'rgba(255,255,255,0.01)'
                      : 'transparent';
                }
              }}
            >
              {columns.map((col) => (
                <td key={col.key} style={cellStyles}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: 'rgba(238,238,245,0.3)',
          }}
        >
          لا توجد بيانات لعرضها
        </div>
      )}
    </div>
  );
};

export default Table;
