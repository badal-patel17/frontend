// src/data/ordersData.js
// Centralized order data — replace with API calls in production

export const ORDER_STATUS = {
  FALLOUT: 'Fallout',
  SUBMITTED: 'Submitted',
  IN_PROGRESS: 'In Progress',
};

export const ordersData = [
  { id: 1,  productOrder: '400000000013880287', somId: 'C6E8A2A2381944759A212D42E9E6879F',customer: '102001426527', startDate: '2025-08-01T11:31:52.008Z', status: ORDER_STATUS.FALLOUT },
  { id: 2,  productOrder: '400000000013996071', somId: 'F3A9D4C82B5E4A1F9D6C7B2A0E4F8139', customer: '102001489701', startDate: '2025-08-04T03:14:18.590Z', status: ORDER_STATUS.SUBMITTED },
  { id: 3,  productOrder: '400000000013383631', somId: '9B2E7A4D6F3C1E8A0B54D92F7C1A6E38', customer: '102001457568', startDate: '2025-07-31T15:13:18.590Z', status: ORDER_STATUS.IN_PROGRESS },
  { id: 4,  productOrder: '400000000013200515', somId: 'A7C9F3D1B8E5426A90E4B27D6F5C81A9', customer: '102001497170', startDate: '2025-08-04T15:15:18.590Z', status: ORDER_STATUS.SUBMITTED },
  { id: 5,  productOrder: '400000000013511591', somId: '5E1D8C9A7F4B3A026D9EBCF12486A7D5', customer: '102001492208', startDate: '2025-08-02T15:16:18.590Z', status: ORDER_STATUS.IN_PROGRESS },
  { id: 6,  productOrder: '400000000013460344', somId: 'C18EF7A0D94B63A52F9E6D872A4CB135', customer: '102001490563', startDate: '2025-07-31T11:18:18.590Z', status: ORDER_STATUS.FALLOUT },
  { id: 7,  productOrder: '400000000013605215', somId: '0D6A92F8C1B47E3FA59D2C8E71B64A30', customer: '102001445013', startDate: '2025-08-02T22:03:18.590Z', status: ORDER_STATUS.FALLOUT },
  { id: 8,  productOrder: '400000000013658377', somId: '7F9C3E60B1A5D4828F6A7E9D24C15B03', customer: '102001460258', startDate: '2025-08-03T19:13:18.590Z', status: ORDER_STATUS.IN_PROGRESS },
  { id: 9,  productOrder: '400000000013110568', somId: '7F9C3E60B1A5D4828F6A7E9D24C15B03', customer: '102001444600', startDate: '2025-07-30T03:17:18.590Z', status: ORDER_STATUS.SUBMITTED },
  { id: 10, productOrder: '400000000013974465', somId: 'E1F78B5DC9A2E3046F8A1C7B954D0263', customer: '102001425690', startDate: '2025-08-03T14:46:18.590Z', status: ORDER_STATUS.SUBMITTED },
  { id: 11, productOrder: '400000000013601181', customer: '102001471883', startDate: '2025-08-03T13:27:18.590Z', status: ORDER_STATUS.IN_PROGRESS },
  { id: 12, productOrder: '400000000013344548', customer: '102001425769', startDate: '2025-08-03T16:52:18.590Z', status: ORDER_STATUS.FALLOUT },
  { id: 13, productOrder: '400000000013815718', customer: '102001484771', startDate: '2025-07-31T22:31:18.590Z', status: ORDER_STATUS.SUBMITTED },
  { id: 14, productOrder: '400000000013317262', customer: '102001434684', startDate: '2025-07-29T18:37:18.590Z', status: ORDER_STATUS.FALLOUT },
  { id: 15, productOrder: '400000000013473900', customer: '102001485307', startDate: '2025-08-05T08:29:18.590Z', status: ORDER_STATUS.FALLOUT },
  { id: 16, productOrder: '400000000013396299', customer: '102001494979', startDate: '2025-07-31T19:17:18.590Z', status: ORDER_STATUS.IN_PROGRESS },
  { id: 17, productOrder: '400000000013691195', customer: '102001470819', startDate: '2025-08-01T06:19:18.590Z', status: ORDER_STATUS.SUBMITTED },
  { id: 18, productOrder: '400000000013347185', customer: '102001410274', startDate: '2025-07-31T01:51:18.590Z', status: ORDER_STATUS.SUBMITTED },
  { id: 19, productOrder: '400000000013303257', customer: '102001468340', startDate: '2025-08-04T23:12:18.590Z', status: ORDER_STATUS.IN_PROGRESS },
  { id: 20, productOrder: '400000000013587450', customer: '102001472709', startDate: '2025-08-01T16:03:18.590Z', status: ORDER_STATUS.FALLOUT },
];

export const getStatusCounts = (data = ordersData) => ({
  submitted: data.filter(o => o.status === ORDER_STATUS.SUBMITTED).length,
  fallout:   data.filter(o => o.status === ORDER_STATUS.FALLOUT).length,
  inProgress: data.filter(o => o.status === ORDER_STATUS.IN_PROGRESS).length,
  total: data.length,
});
