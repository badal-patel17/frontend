// src/api/mockApi.js
// Dummy API — simulates real HTTP responses with realistic delay.
// Replace each function body with a real fetch() call when your backend is ready.
// Hardcoded fallback values are preserved as comments below each mock.

import { ordersData }  from '../data/ordersData';
import { usersData }   from '../data/usersData';

// Simulates network latency (200–600ms)
const delay = (ms = 300) =>
  new Promise(resolve => setTimeout(resolve, ms + Math.random() * 300));

// ─── ORDERS ──────────────────────────────────────────────────────────────────

/**
 * GET /orders
 * Returns paginated list of orders.
 *
 * Real implementation:
 *   const res = await fetch(`${ENDPOINTS.ORDERS}?page=${page}&limit=${limit}`, { headers: DEFAULT_HEADERS });
 *   return res.json();
 */
export const fetchOrders = async ({ page = 1, limit = 20 } = {}) => {
  await delay();

  // -- HARDCODED FALLBACK (keep for offline/dev reference) --
  // const hardcoded = [
  //   { id: 1, productOrder: '400000000013880287', customer: '102001426527', startDate: '2025-08-01T11:31:52.008Z', status: 'Fallout' },
  //   { id: 2, productOrder: '400000000013996071', customer: '102001489701', startDate: '2025-08-04T03:14:18.590Z', status: 'Submitted' },
  //   ... (see src/data/ordersData.js for full list)
  // ];

  const start = (page - 1) * limit;
  const paginated = ordersData.slice(start, start + limit);

  return {
    data: paginated,
    total: ordersData.length,
    page,
    limit,
  };
};

/**
 * GET /orders/:id
 * Returns a single order by ID.
 *
 * Real implementation:
 *   const res = await fetch(`${ENDPOINTS.ORDERS}/${id}`, { headers: DEFAULT_HEADERS });
 *   return res.json();
 */
export const fetchOrderById = async (id) => {
  await delay(200);
  const order = ordersData.find(o => o.id === Number(id));
  if (!order) throw new Error(`Order ${id} not found`);
  return { data: order };
};

// ─── STATS / WIDGETS ─────────────────────────────────────────────────────────

/**
 * GET /stats
 * Returns dashboard summary counts.
 *
 * Real implementation:
 *   const res = await fetch(ENDPOINTS.STATS, { headers: DEFAULT_HEADERS });
 *   return res.json();
 */
export const fetchStats = async () => {
  await delay();

  // -- HARDCODED FALLBACK --
  // return {
  //   data: { orders: 49, fallouts: 25, flows: 7, successRate: 90 }
  // };

  const fallouts   = ordersData.filter(o => o.status === 'Fallout').length;
  const submitted  = ordersData.filter(o => o.status === 'Submitted').length;
  const inProgress = ordersData.filter(o => o.status === 'In Progress').length;
  const successRate = Math.round((submitted / ordersData.length) * 100);

  return {
    data: {
      orders:      ordersData.length,
      fallouts,
      flows:       7,          // static until flows API exists
      successRate,
    },
  };
};

// ─── USERS ───────────────────────────────────────────────────────────────────

/**
 * GET /users
 * Returns list of admin users.
 *
 * Real implementation:
 *   const res = await fetch(ENDPOINTS.USERS, { headers: DEFAULT_HEADERS });
 *   return res.json();
 */
export const fetchUsers = async () => {
  await delay();

  // -- HARDCODED FALLBACK --
  // const hardcoded = [
  //   { id: 1, username: 'Rohit Matwaani', email: 'rohit.matwaani1@vodafone.com', access: 'All Access', status: 'Admin', lastActivity: '2025-09-09T12:09:11', permissions: { read: true, write: true, execute: true } },
  //   ... (see src/data/usersData.js for full list)
  // ];

  return { data: usersData };
};

// ─── AUDIT LOGS ──────────────────────────────────────────────────────────────

const MOCK_AUDIT_LOGS = [
  { id: 1, timestamp: '2025-12-10T11:07:11.039Z', user: 'sachin-singh', flowName: 'DE-OH_BPMNLIB-19362643', type: 'data',  message: '{"id":"400000000013928247","state":"Submitted","orderDate":"2024-11-07T16:44:33.824Z"}' },
  { id: 2, timestamp: '2025-12-10T11:08:13.019Z', user: 'sachin-singh', flowName: 'DE-OH_BPMNLIB-19362643', type: 'trace', message: 'Started execution for Product order-400000000013928247, productOffering: GigaZuhause500Cable' },
  { id: 3, timestamp: '2025-12-10T11:09:11.021Z', user: 'sachin-singh', flowName: 'DE-OH_BPMNLIB-19362643', type: 'data',  message: '{"id":"400000000013928247","state":"Submitted","lastUpdateDate":"2024-11-07T16:44:54.596Z"}' },
  { id: 4, timestamp: '2025-12-10T12:01:29.112Z', user: 'sachin-singh', flowName: 'DE-OH_BPMNLIB-19362643', type: 'trace', message: 'Started execution for Product order-400000000013640920, productOffering: GigaZuhause500Cable' },
  { id: 5, timestamp: '2025-12-10T12:15:44.001Z', user: 'rohit-matwaani', flowName: 'DE_SOM_FULFIL-84728',   type: 'data',  message: '{"id":"400000000013996071","state":"Fallout","lastUpdateDate":"2025-08-04T03:14:18.590Z"}' },
  { id: 6, timestamp: '2025-12-10T12:16:01.882Z', user: 'rohit-matwaani', flowName: 'DE_SOM_FULFIL-84728',   type: 'trace', message: 'Fallout detected for order-400000000013996071, escalating to fix-flow' },
];

/**
 * GET /audit-logs
 * Returns audit trail entries, optionally filtered.
 *
 * Real implementation:
 *   const params = new URLSearchParams({ env, pod, flow }).toString();
 *   const res = await fetch(`${ENDPOINTS.AUDIT}?${params}`, { headers: DEFAULT_HEADERS });
 *   return res.json();
 */
export const fetchAuditLogs = async ({ env = '', pod = '', flow = '' } = {}) => {
  await delay();

  // -- HARDCODED FALLBACK --
  // return { data: MOCK_AUDIT_LOGS };

  let logs = [...MOCK_AUDIT_LOGS];
  if (flow) logs = logs.filter(l => l.flowName.includes(flow.replace('DE_', 'DE-')));

  return { data: logs };
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Authenticates a user.
 *
 * Real implementation:
 *   const res = await fetch(`${BASE_URL}/auth/login`, {
 *     method: 'POST',
 *     headers: DEFAULT_HEADERS,
 *     body: JSON.stringify({ email, password }),
 *   });
 *   const data = await res.json();
 *   if (!res.ok) throw new Error(data.message);
 *   localStorage.setItem('token', data.token);
 *   return data;
 */
export const loginUser = async ({ email, password }) => {
  await delay(500);

  // -- HARDCODED FALLBACK --
  // Always succeeds in mock mode
  if (!email || !password) throw new Error('Email and password are required.');

  // Simulate wrong credentials
  if (password === 'wrong') throw new Error('Invalid credentials.');

  return {
    data: {
      token: 'mock-jwt-token-abc123',
      user:  { email, role: 'admin', name: 'Admin User' },
    },
  };
};
