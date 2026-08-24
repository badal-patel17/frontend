import { useEffect, useMemo, useState } from 'react';

import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import OrdersTable from '../../components/OrdersTable/OrdersTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
  buildAutomationMetrics,
  formatSecondsAsDuration,
  getStatusLabel,
  normalizeMsInstances,
  safeDateTime,
  toTrendSeries
} from '../../components/automation/automationUtils';

import './automation-analytics.scss';

const API_BASE = '/vfort/api';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'IN_PROGRESS', label: 'In Progress' }
];

const getDateKey = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const getStatusClass = (status) => {
  const value = String(status || '').toUpperCase();
  if (value === 'COMPLETED') return 'status-positive';
  if (value === 'FAILED') return 'status-danger';
  if (value === 'IN_PROGRESS') return 'status-warning';
  return 'status-neutral';
};

const AutomationAnalytics = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const loadAutomationAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('vfort_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const response = await fetch(`${API_BASE}/ms-instances`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Unable to load automation analytics. (${response.status})`);
      }

      const payload = await response.json();
      const normalized = normalizeMsInstances(payload);
      setItems(normalized);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setItems([]);
      setError(err.message || 'Unable to load automation analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAutomationAnalytics();
  }, []);

  const metrics = useMemo(() => buildAutomationMetrics(items), [items]);

  const filteredItems = useMemo(() => {
    let list = [...items];

    if (statusFilter) {
      list = list.filter((item) => String(item?.status || '').toUpperCase() === statusFilter);
    }

    if (dateFilter) {
      list = list.filter((item) => getDateKey(item?.start_time) === dateFilter);
    }

    return list.sort((a, b) => new Date(b?.start_time || 0) - new Date(a?.start_time || 0));
  }, [items, statusFilter, dateFilter]);

  const uniqueDates = useMemo(() => {
    const dates = [...new Set(items.map((item) => getDateKey(item?.start_time)).filter(Boolean))];
    return dates.sort((a, b) => new Date(b) - new Date(a));
  }, [items]);

  const statusDistribution = useMemo(() => {
    const total = metrics.totalExecutions;
    const groups = [
      { label: 'Completed', raw: 'COMPLETED', count: metrics.completedExecutions, className: 'completed' },
      { label: 'Failed', raw: 'FAILED', count: metrics.failedExecutions, className: 'failed' },
      { label: 'In Progress', raw: 'IN_PROGRESS', count: metrics.runningExecutions, className: 'running' }
    ];

    return groups.map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
    }));
  }, [metrics]);

  const trend = useMemo(() => toTrendSeries(filteredItems), [filteredItems]);

  const showTrend = trend.length >= 2;
  const maxTrend = Math.max(...trend.map((point) => point.count), 1);
  const trendPath = trend
    .map((point, index) => {
      const x = (index / Math.max(trend.length - 1, 1)) * 100;
      const y = 92 - (point.count / maxTrend) * 74;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  const executionColumns = [
    { header: 'Execution ID', accessor: 'id', sortable: true },
    { header: 'Step Instance ID', accessor: 'step_instance_id', sortable: true },
    {
      header: 'Start Time',
      accessor: 'start_time',
      sortable: true,
      render: (value) => safeDateTime(value)
    },
    {
      header: 'End Time',
      accessor: 'end_time',
      sortable: true,
      render: (value) => (value ? safeDateTime(value) : '--')
    },
    { header: 'Duration', accessor: 'time_taken', sortable: true },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => <span className={`status-pill ${getStatusClass(value)}`}>{getStatusLabel(value)}</span>
    }
  ];

  const tableFilters = [
    {
      field: 'status',
      label: 'Status',
      placeholder: 'All Statuses',
      options: STATUS_FILTER_OPTIONS.filter((item) => item.value)
    }
  ];

  const fastestDuration = metrics.fastest?.durationSeconds;
  const longestDuration = metrics.longest?.durationSeconds;

  return (
    <div className="flow-home">
      <Sidebar />
      <div className="flow-homeContainer">
        <Navbar />

        <div className="automation-analytics-page">
          <div className="automation-analytics-header">
            <div>
              <h1>Automation Analytics</h1>
              <p>Execution reporting and recovery performance</p>
            </div>

            <div className="automation-analytics-controls">
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status">
                {STATUS_FILTER_OPTIONS.map((item) => (
                  <option key={item.label} value={item.value}>{item.label}</option>
                ))}
              </select>

              <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} aria-label="Filter by start date">
                <option value="">All Dates</option>
                {uniqueDates.map((date) => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>

              <button type="button" className="refresh-btn" onClick={loadAutomationAnalytics}>Refresh</button>
            </div>
          </div>

          {lastUpdated && <p className="last-updated">Last updated: {lastUpdated}</p>}

          {loading ? (
            <LoadingSpinner message="Loading automation execution data..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={loadAutomationAnalytics} />
          ) : (
            <>
              <div className="automation-kpis">
                <div className="automation-kpi total"><span>Total Executions</span><strong>{metrics.totalExecutions}</strong></div>
                <div className="automation-kpi completed"><span>Completed</span><strong>{metrics.completedExecutions}</strong></div>
                <div className="automation-kpi failed"><span>Failed</span><strong>{metrics.failedExecutions}</strong></div>
                <div className="automation-kpi running"><span>In Progress</span><strong>{metrics.runningExecutions}</strong></div>
                <div className="automation-kpi success"><span>Success Rate</span><strong>{metrics.successRate}%</strong></div>
              </div>

              <div className="automation-analytics-row">
                <div className="analytics-card">
                  <div className="analytics-card__head">
                    <h3>Execution Status Distribution</h3>
                  </div>

                  {metrics.totalExecutions === 0 ? (
                    <p className="analytics-empty">No automation execution data available</p>
                  ) : (
                    <div className="distribution-list">
                      {statusDistribution.map((item) => (
                        <div className="distribution-row" key={item.raw}>
                          <div className="distribution-row__meta">
                            <span>{item.label}</span>
                            <small>{item.count} ({item.percentage}%)</small>
                          </div>
                          <div className="distribution-row__track">
                            <div className={`distribution-row__fill ${item.className}`} style={{ width: `${Math.max(item.percentage, 6)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="analytics-card">
                  <div className="analytics-card__head">
                    <h3>Performance Summary</h3>
                  </div>

                  <div className="performance-list">
                    <div><span>Average Execution Duration</span><strong>{metrics.averageDuration}</strong></div>
                    <div>
                      <span>Fastest Completed Execution</span>
                      <strong>
                        {metrics.fastest
                          ? `${metrics.fastest.step_instance_id || '--'} (${formatSecondsAsDuration(fastestDuration)})`
                          : 'No completed duration data'}
                      </strong>
                    </div>
                    <div>
                      <span>Longest Completed Execution</span>
                      <strong>
                        {metrics.longest
                          ? `${metrics.longest.step_instance_id || '--'} (${formatSecondsAsDuration(longestDuration)})`
                          : 'No completed duration data'}
                      </strong>
                    </div>
                    <div><span>Finished Executions</span><strong>{metrics.finishedExecutions}</strong></div>
                  </div>
                </div>
              </div>

              <div className="analytics-card trend-card">
                <div className="analytics-card__head">
                  <h3>Execution Trend</h3>
                </div>

                {showTrend ? (
                  <>
                    <svg viewBox="0 0 100 100" className="trend-chart" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M0,20 L100,20" className="trend-grid" />
                      <path d="M0,56 L100,56" className="trend-grid" />
                      <path d="M0,92 L100,92" className="trend-grid" />
                      <path d={trendPath} className="trend-line" />
                      {trend.map((point, index) => {
                        const x = (index / Math.max(trend.length - 1, 1)) * 100;
                        const y = 92 - (point.count / maxTrend) * 74;
                        return <circle key={`${point.date}-${index}`} cx={x} cy={y} r="1.7" className="trend-point" />;
                      })}
                    </svg>

                    <div className="trend-labels">
                      {trend.map((point) => <span key={point.date}>{point.label}</span>)}
                    </div>
                  </>
                ) : (
                  <p className="analytics-empty">More historical execution data is required to display a trend.</p>
                )}
              </div>

              <div className="automation-table-block">
                <h3>Recent Automation Executions</h3>
                {filteredItems.length === 0 ? (
                  <p className="analytics-empty">No automation executions have been recorded.</p>
                ) : (
                  <OrdersTable
                    title="Execution Table"
                    data={filteredItems}
                    columns={executionColumns}
                    filters={tableFilters}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationAnalytics;

