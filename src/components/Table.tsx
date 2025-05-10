import React from 'react';

export interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any, index?: number) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: {
    icon?: React.ReactNode;
    primaryText: string;
    secondaryText: string;
  };
  loading?: boolean;
}

export default function Table({ columns, data, emptyMessage, loading }: TableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data.length && emptyMessage) {
    return (
      <div className="text-center py-12">
        {emptyMessage.icon}
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage.primaryText}</h3>
        <p className="mt-1 text-sm text-gray-500">{emptyMessage.secondaryText}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {column.render
                    ? column.render(row[column.accessor], row, rowIndex)
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 