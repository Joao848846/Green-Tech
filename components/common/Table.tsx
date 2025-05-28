
import React from 'react';

interface TableColumn<T> {
  key: keyof T | string; // Allow string for custom render keys
  header: string;
  render?: (item: T) => React.ReactNode; // Custom render function for a cell
  className?: string; // Class for td/th
  headerClassName?: string; // Class for th
  cellClassName?: string; // Class for td
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T) => string | number;
  className?: string;
  onRowClick?: (item: T) => void;
}

const Table = <T extends object,>({ data, columns, keyExtractor, className = '', onRowClick }: TableProps<T>): React.ReactNode => {
  if (!data || data.length === 0) {
    return <p className="text-center text-futuristic-text-secondary py-8">No data available.</p>;
  }

  return (
    <div className={`overflow-x-auto rounded-lg shadow-md border border-futuristic-primary/20 ${className}`}>
      <table className="min-w-full divide-y divide-futuristic-primary/20 bg-futuristic-bg-secondary">
        <thead className="bg-futuristic-bg-secondary/50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-orbitron font-medium text-futuristic-accent uppercase tracking-wider ${col.headerClassName || col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-futuristic-primary/10">
          {data.map((item) => (
            <tr 
              key={keyExtractor(item)} 
              className={`hover:bg-futuristic-primary/5 transition-colors duration-150 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((col) => (
                <td
                  key={`${keyExtractor(item)}-${String(col.key)}`}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-futuristic-text ${col.cellClassName || col.className || ''}`}
                >
                  {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
