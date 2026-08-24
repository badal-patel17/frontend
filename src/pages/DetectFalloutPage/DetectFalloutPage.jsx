import { useEffect, useMemo, useState } from 'react';

import Sidebar from '../../components/sidebar/Sidebar';
import NavbarFlow from '../../components/navbar/Navbar';
import OrdersTable from '../../components/OrdersTable/OrdersTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

import './detect-fallout-page.scss';

const API_BASE = '/vfort/api';

const auth = {
    username: 'admin',
    password: 'admin'
};

const VIEW_CONFIG = {
    unmappedFaults: {
        label: 'Unmapped Faults',
        endpoint: '/unmapped-faults',
        title: 'Unmapped Faults',
        summaryTitle: 'UNMAPPED',
        description: 'Orders impacted by unknown or unmapped fallout patterns.',
        action:
            'Requires analysis and mapping before automated recovery can be configured.',
        columns: [
            { header: 'ID', accessor: 'id', sortable: true },
            { header: 'Order ID', accessor: 'orderId', sortable: true },
            { header: 'Form ID', accessor: 'formId', sortable: true },
            { header: 'Is Exception', accessor: 'isException', sortable: true },
            { header: 'Error Message', accessor: 'errorMessage', sortable: false },
            { header: 'First Seen At', accessor: 'firstSeenAt', sortable: true },
            { header: 'Last Seen At', accessor: 'lastSeenAt', sortable: true },
            { header: 'Occurrence Count', accessor: 'occurrenceCount', sortable: true },
            { header: 'Status', accessor: 'status', sortable: true },
            { header: 'Mapped Process Key', accessor: 'mappedProcessKey', sortable: true }
        ]
    },

    failedOrders: {
        label: 'Failed Orders',
        endpoint: '/failed-orders',
        title: 'Failed Orders',
        summaryTitle: 'FAILED',
        description: 'Orders that failed during processing.',
        action:
            'Requires retry, investigation or automated recovery.',
        columns: [
            { header: 'ID', accessor: 'id', sortable: true },
            { header: 'Order ID', accessor: 'orderId', sortable: true },
            { header: 'Status', accessor: 'status', sortable: true },
            { header: 'Process Instance ID', accessor: 'processInstanceId', sortable: true },
            { header: 'Error Code', accessor: 'errorCode', sortable: true },
            { header: 'Error Message', accessor: 'errorMessage', sortable: false },
            { header: 'Error Classification', accessor: 'errorClassification', sortable: true },
            { header: 'Failed Step', accessor: 'failedStep', sortable: true },
            { header: 'Retry Count', accessor: 'retryCount', sortable: true },
            { header: 'Queue Name', accessor: 'queueName', sortable: true },
            { header: 'Created At', accessor: 'createdAt', sortable: true },
            { header: 'Resolved At', accessor: 'resolvedAt', sortable: true },
            { header: 'Step Instance ID', accessor: 'stepInstanceId', sortable: true },
            { header: 'Correlation ID', accessor: 'correlationId', sortable: true },
            { header: 'Severity', accessor: 'severity', sortable: true }
        ]
    },

    manualReview: {
        label: 'Manual Review',
        endpoint: '/manual-review',
        title: 'Manual Review Queue',
        summaryTitle: 'REVIEW',
        description: 'Orders requiring manual intervention.',
        action:
            'Requires operational review before successful completion.',
        columns: [
            { header: 'Review ID', accessor: 'reviewId', sortable: true },
            { header: 'Order ID', accessor: 'orderId', sortable: true },
            { header: 'Step Instance ID', accessor: 'stepInstanceId', sortable: true },
            { header: 'Fallout Type', accessor: 'falloutType', sortable: true },
            { header: 'Attempt Count', accessor: 'attemptCount', sortable: true },
            { header: 'Last Error', accessor: 'lastError', sortable: false },
            { header: 'First Failed At', accessor: 'firstFailedAt', sortable: true },
            { header: 'Last Failed At', accessor: 'lastFailedAt', sortable: true },
            { header: 'Status', accessor: 'status', sortable: true },
            { header: 'Resolved By', accessor: 'resolvedBy', sortable: true },
            { header: 'Resolved At', accessor: 'resolvedAt', sortable: true },
            { header: 'Error Classification', accessor: 'errorClassification', sortable: true },
            { header: 'Correlation ID', accessor: 'correlationId', sortable: true }
        ]
    }
};

const getRootCauseCategory = (item) => {
    const candidates = [
        item?.errorMessage,
        item?.reasonCode,
        item?.errorCode,
        item?.exceptionType,
        item?.errorClassification,
        item?.failedStep,
        item?.mappedProcessKey,
        item?.processInstanceId,
        item?.queueName,
        item?.status
    ].filter(Boolean);

    if (candidates.length === 0) {
        return 'Unclassified';
    }

    return String(candidates[0]).slice(0, 34);
};

const getStatusBand = (status) => {
    const normalized = String(status || '').toLowerCase();

    if (!normalized) {
        return 'Unknown';
    }

    if (normalized.includes('close') || normalized.includes('resolved') || normalized.includes('complete')) {
        return 'Closed';
    }

    if (normalized.includes('review') || normalized.includes('manual')) {
        return 'In Review';
    }

    if (normalized.includes('open') || normalized.includes('fail') || normalized.includes('error') || normalized.includes('pending')) {
        return 'Open';
    }

    return 'Unknown';
};

const DetectFalloutPage = () => {
    const [selectedView, setSelectedView] = useState('unmappedFaults');

    const [records, setRecords] = useState([]);

    const [unmappedFaults, setUnmappedFaults] = useState([]);
    const [failedOrders, setFailedOrders] = useState([]);
    const [manualReviews, setManualReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const activeConfig = VIEW_CONFIG[selectedView];

    const loginAndGetHeaders = async () => {
        const loginResponse = await fetch(
            `${API_BASE}/auth/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(auth)
            }
        );

        if (!loginResponse.ok) {
            throw new Error('Authentication failed');
        }

        const loginData = await loginResponse.json();

        return {
            Authorization: `Bearer ${loginData.token}`,
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        const fetchAllSummaryData = async () => {
            try {
                const headers = await loginAndGetHeaders();

                const [
                    unmappedResponse,
                    failedResponse,
                    reviewResponse
                ] = await Promise.all([
                    fetch(`${API_BASE}/unmapped-faults`, {
                        method: 'GET',
                        headers
                    }),
                    fetch(`${API_BASE}/failed-orders`, {
                        method: 'GET',
                        headers
                    }),
                    fetch(`${API_BASE}/manual-review`, {
                        method: 'GET',
                        headers
                    })
                ]);

                if (!unmappedResponse.ok) {
                    throw new Error('Failed to fetch unmapped faults');
                }

                if (!failedResponse.ok) {
                    throw new Error('Failed to fetch failed orders');
                }

                if (!reviewResponse.ok) {
                    throw new Error('Failed to fetch manual review');
                }

                const unmappedData = await unmappedResponse.json();
                const failedData = await failedResponse.json();
                const reviewData = await reviewResponse.json();

                const unmappedList = Array.isArray(unmappedData)
                    ? unmappedData
                    : unmappedData.data || [];

                const failedList = Array.isArray(failedData)
                    ? failedData
                    : failedData.data || [];

                const reviewList = Array.isArray(reviewData)
                    ? reviewData
                    : reviewData.data || [];

                setUnmappedFaults(unmappedList);
                setFailedOrders(failedList);
                setManualReviews(reviewList);

                if (selectedView === 'unmappedFaults') {
                    setRecords(unmappedList);
                }

                if (selectedView === 'failedOrders') {
                    setRecords(failedList);
                }

                if (selectedView === 'manualReview') {
                    setRecords(reviewList);
                }
            } catch (error) {
                console.error('Error loading summary data:', error);
                setErrorMessage(error.message || 'Unable to load data');
                setRecords([]);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        setErrorMessage('');
        fetchAllSummaryData();
    }, [selectedView]);

    const uniqueOptions = field =>
        [...new Set(records.map(item => item[field]))]
            .filter(value => value !== null && value !== undefined && value !== '')
            .map(value => ({
                value,
                label: String(value)
            }));

    const tableFilters = useMemo(() => {
        if (selectedView === 'unmappedFaults') {
            return [
                {
                    field: 'status',
                    label: 'Status',
                    placeholder: 'All Status',
                    options: uniqueOptions('status')
                },
                {
                    field: 'isException',
                    label: 'Exception',
                    placeholder: 'All Exceptions',
                    options: uniqueOptions('isException')
                },
                {
                    field: 'mappedProcessKey',
                    label: 'Mapped Process',
                    placeholder: 'All Processes',
                    options: uniqueOptions('mappedProcessKey')
                }
            ];
        }

        if (selectedView === 'failedOrders') {
            return [
                {
                    field: 'status',
                    label: 'Status',
                    placeholder: 'All Status',
                    options: uniqueOptions('status')
                },
                {
                    field: 'severity',
                    label: 'Severity',
                    placeholder: 'All Severity',
                    options: uniqueOptions('severity')
                },
                {
                    field: 'errorClassification',
                    label: 'Classification',
                    placeholder: 'All Classifications',
                    options: uniqueOptions('errorClassification')
                }
            ];
        }

        return [
            {
                field: 'status',
                label: 'Status',
                placeholder: 'All Status',
                options: uniqueOptions('status')
            },
            {
                field: 'falloutType',
                label: 'Fallout Type',
                placeholder: 'All Fallout Types',
                options: uniqueOptions('falloutType')
            },
            {
                field: 'errorClassification',
                label: 'Classification',
                placeholder: 'All Classifications',
                options: uniqueOptions('errorClassification')
            }
        ];
    }, [records, selectedView]);

    const sourceBreakdown = useMemo(() => {
        const map = {};
        records.forEach((item) => {
            const key = getRootCauseCategory(item);
            map[key] = (map[key] || 0) + 1;
        });

        return Object.entries(map)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
    }, [records]);

    const statusDistribution = useMemo(() => {
        const counters = {
            Open: 0,
            Closed: 0,
            'In Review': 0,
            Unknown: 0
        };

        records.forEach((item) => {
            const key = getStatusBand(item?.status);
            counters[key] += 1;
        });

        return Object.entries(counters).map(([label, value]) => ({
            label,
            value
        }));
    }, [records]);

    const totalFallouts =
        failedOrders.length +
        unmappedFaults.length +
        manualReviews.length;

    return (
        <div className="flow-home">
            <Sidebar />

            <div className="flow-homeContainer">
                <NavbarFlow />

                <div className="detect-fallout-page">

                    <div className="detect-header-card">
                        <div className="detect-header-left">
                            <h2>Detect Fallout</h2>
                        </div>

                        <div className="detect-header-right">
                            <label htmlFor="falloutView">
                                Fallout View
                            </label>

                            <select
                                id="falloutView"
                                value={selectedView}
                                onChange={event => setSelectedView(event.target.value)}
                            >
                                <option value="unmappedFaults">
                                    Unmapped Faults
                                </option>

                                <option value="failedOrders">
                                    Failed Orders
                                </option>

                                <option value="manualReview">
                                    Manual Review
                                </option>
                            </select>

                        </div>
                    </div>

                    <div className="summaryCards">
                        <div
                            className={`summaryCard unmapped ${
                                selectedView === 'unmappedFaults' ? 'active' : ''
                            }`}
                            onClick={() => setSelectedView('unmappedFaults')}
                        >
                            <span>Unmapped Faults</span>
                            <h1>{unmappedFaults.length}</h1>
                            <p>Mapped Process Gaps</p>
                        </div>

                        <div
                            className={`summaryCard failed ${
                                selectedView === 'failedOrders' ? 'active' : ''
                            }`}
                            onClick={() => setSelectedView('failedOrders')}
                        >
                            <span>Failed Orders</span>
                            <h1>{failedOrders.length}</h1>
                            <p>Execution Failures</p>
                        </div>

                        <div
                            className={`summaryCard review ${
                                selectedView === 'manualReview' ? 'active' : ''
                            }`}
                            onClick={() => setSelectedView('manualReview')}
                        >
                            <span>Manual Reviews</span>
                            <h1>{manualReviews.length}</h1>
                            <p>Operator Actions</p>
                        </div>

                        <div className="summaryCard total" role="status" aria-label="Total fallout count">
                            <span>Total Fallouts</span>
                            <h1>{totalFallouts}</h1>
                            <p>All Active Queues</p>
                        </div>
                    </div>

                    <div className="analytics-grid">
                        <div className="source-breakdown-card">
                            <div className="source-breakdown-card__header">
                                <h3>Root Cause Breakdown</h3>
                                <span>Category Distribution</span>
                            </div>

                            <div className="source-breakdown-grid">
                                {sourceBreakdown.length === 0 ? (
                                    <p className="source-empty">No category breakdown available.</p>
                                ) : (
                                    sourceBreakdown.map((item) => (
                                        <div className="source-pill" key={item.name}>
                                            <span>{item.name}</span>
                                            <strong>{item.count}</strong>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="source-bars">
                                {sourceBreakdown.map((item) => {
                                    const max = Math.max(...sourceBreakdown.map((x) => x.count), 1);
                                    const width = `${Math.max((item.count / max) * 100, 10)}%`;

                                    return (
                                        <div className="source-bar-row" key={`${item.name}-bar`}>
                                            <span>{item.name}</span>
                                            <div className="source-bar-track">
                                                <div className="source-bar-fill" style={{ width }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="exception-card">
                            <div className="source-breakdown-card__header">
                                <h3>Exception Distribution</h3>
                                <span>Status Split</span>
                            </div>

                            <div className="exception-list">
                                {statusDistribution.map((item) => (
                                    <div className="exception-item" key={item.label}>
                                        <span>{item.label}</span>
                                        <strong>{item.value}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="queue-section-head">
                        <h3>Current Fallout Queue</h3>
                    </div>

                    <div className="excel-data">
                        {loading ? (
                            <LoadingSpinner message={`Loading ${activeConfig.label}...`} />
                        ) : errorMessage ? (
                            <div className="detect-error">
                                {errorMessage}
                            </div>
                        ) : (
                            <OrdersTable
                                title={activeConfig.title}
                                data={records}
                                columns={activeConfig.columns}
                                filters={tableFilters}
                            />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DetectFalloutPage;