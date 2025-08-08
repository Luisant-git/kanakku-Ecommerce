import React, { useState, useMemo } from 'react';
import './DataTable.scss';

// Utility to export data as CSV
const exportToCSV = (data, columns, filename = 'data.csv') => {
  const header = columns.map(col => col.label).join(',');
  const rows = data.map(row =>
    columns.map(col => JSON.stringify(row[col.key] ?? '')).join(',')
  );
  const csvContent = [header, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

// Utility to export data as PDF (simple, table-based)
const exportToPDF = async (data, columns, filename = 'data.pdf') => {
  // Dynamically import jsPDF and autotable
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;
  const doc = new jsPDF();
  autoTable(doc, {
    head: [columns.map(col => col.label)],
    body: data.map(row => columns.map(col => row[col.key])),
  });
  doc.save(filename);
};

const DataTable = ({ data = [], columns = [], onBulkDelete }) => {
  // Search/filter state
  const [search, setSearch] = useState('');
  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Selection state
  const [selectedRows, setSelectedRows] = useState([]);

  // Filtered data based on search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(row =>
      columns.some(col => {
        const value = row[col.key];
        return value && value.toString().toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [search, data, columns]);

  // Pagination logic
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Selection logic
  const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => selectedRows.includes(row));
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(selectedRows.filter(row => !paginatedData.includes(row)));
    } else {
      setSelectedRows([...selectedRows, ...paginatedData.filter(row => !selectedRows.includes(row))]);
    }
  };
  const toggleSelectRow = (row) => {
    setSelectedRows(selectedRows.includes(row)
      ? selectedRows.filter(r => r !== row)
      : [...selectedRows, row]
    );
  };
  const handleBulkDelete = () => {
    if (onBulkDelete) onBulkDelete(selectedRows);
    setSelectedRows([]);
  };

  // Render
  return (
    <div className="data-table">
      <div className="data-table__toolbar">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <div>
          <button onClick={() => exportToCSV(filteredData, columns)}>Export CSV</button>
          <button onClick={() => exportToPDF(filteredData, columns)}>Export PDF</button>
        </div>
      </div>
      {selectedRows.length > 0 && (
        <div className="data-table__bulk-actions">
          <span>{selectedRows.length} selected</span>
          <button onClick={handleBulkDelete}>Delete Selected</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
              />
            </th>
            {columns.map((column, index) => (
              <th key={index}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row)}
                  onChange={() => toggleSelectRow(row)}
                />
              </td>
              {columns.map((column, cellIndex) => (
                <td key={cellIndex}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="data-table__pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}>
          {[10, 20, 50, 100].map(size => (
            <option key={size} value={size}>{size} / page</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DataTable;
