import React, { useMemo, useState } from 'react';
import './OrdersTable.scss'; // You can rename this file to DataTable.scss later

const PAGE_SIZE_OPTIONS = [8, 20, 50];

const OrdersTable = ({ 
  data = [], 
  title = 'Data Table', 
  columns = [],        // Config for columns
  filters = [],        // Config for filters
  maxRows 
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [activeFilters, setActiveFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const resolvedColumns = useMemo(() => {
    if (columns.length > 0) {
      return columns;
    }

    const preferred = ['orderId', 'customerId', 'status', 'updatedAt', 'createdAt'];
    const sample = data[0] || {};
    const keys = preferred.filter((key) => Object.prototype.hasOwnProperty.call(sample, key));

    return keys.map((key) => ({
      header: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
      accessor: key,
      sortable: true
    }));
  }, [columns, data]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  };

  const handleFilterChange = (field, value) => {
    setActiveFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const getStatusClassName = (value) => {
    const normalized = String(value || '').toLowerCase();
    if (normalized.includes('complete') || normalized === 'do' || normalized.includes('success')) {
      return 'status-positive';
    }
    if (normalized.includes('progress') || normalized.includes('open') || normalized.includes('review')) {
      return 'status-warning';
    }
    if (normalized.includes('fail') || normalized.includes('error') || normalized.includes('critical') || normalized.includes('disabled')) {
      return 'status-danger';
    }
    return 'status-neutral';
  };

  const renderCellValue = (col, row) => {
    const raw = col.render ? col.render(row[col.accessor], row) : row[col.accessor];

    if (col.render) {
      return raw;
    }

    const accessor = String(col.accessor || '').toLowerCase();
    const shouldPill = accessor.includes('status') || accessor.includes('severity');

    if (shouldPill && raw !== undefined && raw !== null && raw !== '') {
      return <span className={`status-pill ${getStatusClassName(raw)}`}>{String(raw)}</span>;
    }

    return raw;
  };

  // Process data: Filter -> Sort
  const processed = useMemo(() => {
    let rows = [...data];

    // Apply dynamic filters
    Object.keys(activeFilters).forEach(field => {
      const filterValue = activeFilters[field];
      if (filterValue) {
        rows = rows.filter(r => String(r[field]) === String(filterValue));
      }
    });

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      rows = rows.filter((row) =>
        resolvedColumns.some((col) => String(row[col.accessor] ?? '').toLowerCase().includes(lower))
      );
    }

    // Apply sorting
    if (sortField) {
      rows.sort((a, b) => {
        const av = a[sortField] ?? '';
        const bv = b[sortField] ?? '';
        return sortDir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }
    return rows;
  }, [data, sortField, sortDir, activeFilters, searchTerm, resolvedColumns]);

  // Handle Pagination
  const effective = maxRows ? processed.slice(0, maxRows) : processed;
  const totalPages = maxRows ? 1 : Math.max(1, Math.ceil(processed.length / pageSize));
  const visible = maxRows ? effective : effective.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="sort-icon sort-none">⇅</span>;
    return <span className="sort-icon sort-active">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="orders-table-container">
      {/* Header Controls */}
      <div className="table-header">
        <h2 className="table-title">{title}</h2>
        <div className="table-controls">
          <input
            type="text"
            className="table-search"
            placeholder="Search records"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            aria-label="Search table records"
          />

          {/* Dynamically Render Custom Filters */}
          {filters.map(filter => (
            <select
              key={filter.field}
              className="status-filter"
              value={activeFilters[filter.field] || ''}
              onChange={e => handleFilterChange(filter.field, e.target.value)}
              aria-label={`Filter by ${filter.label}`}
            >
              <option value="">{filter.placeholder || `All ${filter.label}`}</option>
              {filter.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ))}

          {!maxRows && (
            <select
              className="status-filter"
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              aria-label="Rows per page"
            >
              {PAGE_SIZE_OPTIONS.map(n => (
                <option key={n} value={n}>{n} / page</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div className="table-scroll">
        <table className="orders-table">
          <thead>
            <tr>
              {resolvedColumns.map(col => (
                <th
                  key={col.accessor} 
                  onClick={() => col.sortable && handleSort(col.accessor)} 
                  className={col.sortable ? "sortable" : ""}
                >
                  {col.header} {col.sortable && <SortIcon field={col.accessor} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={resolvedColumns.length} className="empty-row">
                  <div className="empty-state">
                    <span className="empty-state__icon">📋</span>
                    <span>No records found.</span>
                  </div>
                </td>
              </tr>
            ) : (
              visible.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {resolvedColumns.map(col => (
                    <td key={col.accessor} className={col.className || "col-mono"}>
                      {renderCellValue(col, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!maxRows && totalPages > 1 && (
        <div className="table-pagination" role="navigation" aria-label="Table pagination">
          <span className="pagination-info">
            {processed.length === 0 ? '0' : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, processed.length)}`} of {processed.length}
          </span>
          <div className="pagination-controls">
            <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
            <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;