// src/data/usersData.js
// Centralized user/admin data — replace with API calls in production

export const USER_STATUS = {
  ADMIN: 'Admin',
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  DISABLED: 'Disabled',
};

export const USER_ACCESS = {
  ALL: 'All Access',
  EXPLORE: 'Explore',
  BUY: 'BUY',
  BUY_EXPLORE: 'BUY/Explore',
  NONE: 'None',
};

export const usersData = [
  {
    id: 1,
    username: 'Rohit Matwaani',
    email: 'rohit.matwaani1@vodafone.com',
    access: USER_ACCESS.ALL,
    status: USER_STATUS.ADMIN,
    lastActivity: '2025-09-09T12:09:11',
    permissions: { read: true, write: true, execute: true },
  },
  {
    id: 2,
    username: 'Sachin Singh',
    email: 'sachin.singh@vodafone.com',
    access: USER_ACCESS.EXPLORE,
    status: USER_STATUS.ACTIVE,
    lastActivity: '2025-09-08T15:19:39',
    permissions: { read: true, write: true, execute: true },
  },
  {
    id: 3,
    username: 'Harsh Joshi',
    email: 'harsh.joshi@vodafone.com',
    access: USER_ACCESS.BUY,
    status: USER_STATUS.ACTIVE,
    lastActivity: '2025-09-08T18:23:12',
    permissions: { read: true, write: false, execute: false },
  },
  {
    id: 4,
    username: 'Anurag Singh',
    email: 'anurag.singh2@vodafone.com',
    access: USER_ACCESS.EXPLORE,
    status: USER_STATUS.EXPIRED,
    lastActivity: '2025-08-01T21:30:41',
    permissions: { read: true, write: true, execute: true },
  },
  {
    id: 5,
    username: 'Badal Patel',
    email: 'badal.patel1@vodafone.com',
    access: USER_ACCESS.NONE,
    status: USER_STATUS.DISABLED,
    lastActivity: '2025-06-01T20:20:29',
    permissions: { read: false, write: false, execute: false },
  },
  {
    id: 6,
    username: 'Sanket Baheti',
    email: 'sanket.baheti1@vodafone.com',
    access: USER_ACCESS.BUY_EXPLORE,
    status: USER_STATUS.ACTIVE,
    lastActivity: '2025-09-11T19:03:31',
    permissions: { read: true, write: false, execute: false },
  },
];
