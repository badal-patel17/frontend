// src/pages/OrdersPage/OrdersPage.jsx

import { useState, useEffect } from 'react';

import Sidebar from '../../components/sidebar/Sidebar';
import NavbarFlow from '../../components/navbar/Navbar';
import OrdersTable from '../../components/OrdersTable/OrdersTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Widget from '../../components/widget/Widget';

import './orders-page.scss';

const API_BASE = '/vfort/api';

const INVENTORY_COLUMNS = [
  { header: 'Customer ID', accessor: 'customerId', sortable: true },
  { header: 'Customer Type', accessor: 'customerType', sortable: true },
  { header: 'Sub Type', accessor: 'subType', sortable: true },
  { header: 'AP ID', accessor: 'apId', sortable: true },
  { header: 'Order ID', accessor: 'orderId', sortable: true },
  { header: 'Order Unit ID', accessor: 'orderUnitId', sortable: true },
  { header: 'Created Datetime', accessor: 'createdAt', sortable: true },
  { header: 'Updated Datetime', accessor: 'updatedAt', sortable: true },
  { header: 'Status', accessor: 'status', sortable: true },
  { header: 'Action Type', accessor: 'actionType', sortable: true },
  { header: 'Sales Channel', accessor: 'salesChannel', sortable: true },
  { header: 'Reason ID', accessor: 'reasonId', sortable: true },
  { header: 'Cancel Allowed', accessor: 'cancelAllowed', sortable: true },
  { header: 'Amend Allowed Ind', accessor: 'amendAllowedInd', sortable: true },
  { header: 'Form ID', accessor: 'formId', sortable: true },
  { header: 'State', accessor: 'state', sortable: true },
  { header: 'Execution Date', accessor: 'executionDate', sortable: true },
  { header: 'Completion Date', accessor: 'completionDate', sortable: true },
  { header: 'Step Instance ID', accessor: 'stepInstanceId', sortable: true },
  { header: 'Is Exception', accessor: 'isException', sortable: true },
  { header: 'Message Text', accessor: 'messageText', sortable: false }
];

const OrdersPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isCompletedOrder = (status) => {
    const normalized = String(status || '').toUpperCase();
    return normalized === 'DO' || normalized === 'COMPLETED' || normalized === 'SUCCESS';
  };

  const auth = {
    username: 'admin',
    password: 'admin'
  };

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
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

        const ordersResponse = await fetch(
            `${API_BASE}/orders`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${loginData.token}`,
                'Content-Type': 'application/json'
              }
            }
        );

        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }

        const ordersData = await ordersResponse.json();

        setProducts(
            Array.isArray(ordersData)
                ? ordersData
                : ordersData.data || []
        );

      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, []);

  const totalOrders = products.length;
  const completedOrders = products.filter((item) => isCompletedOrder(item.status)).length;
  const inProgressOrders = products.filter((item) => !isCompletedOrder(item.status)).length;
  const fallouts = products.filter(
      (item) => item.isException === true || String(item.status || '').toUpperCase().includes('FAIL')
  ).length;
  const successRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  const uniqueOptions = field =>
      [...new Set(products.map(item => item[field]))]
          .filter(Boolean)
          .map(value => ({
            value,
            label: value
          }));

  const ORDER_FILTERS = [
    {
      field: 'status',
      label: 'Status',
      placeholder: 'All Status',
      options: uniqueOptions('status')
    },
    {
      field: 'state',
      label: 'State',
      placeholder: 'All States',
      options: uniqueOptions('state')
    },
    {
      field: 'customerType',
      label: 'Customer Type',
      placeholder: 'All Customer Types',
      options: uniqueOptions('customerType')
    },
    {
      field: 'salesChannel',
      label: 'Sales Channel',
      placeholder: 'All Channels',
      options: uniqueOptions('salesChannel')
    },
    {
      field: 'executionDate',
      label: 'Execution Date',
      placeholder: 'All Dates',
      options: uniqueOptions('executionDate')
    }

  ];
  return (
      <div className="flow-home">
        <Sidebar />

        <div className="flow-homeContainer">
          <NavbarFlow />

          <div className="orders-page-heading">
            <h2>Orders Overview</h2>
            <p>Live Order Tracking &amp; Management</p>
          </div>

          <div className="widgets">
            <Widget type="order" value={totalOrders} subtitle="Orders" />
            <Widget type="compOrders" value={completedOrders} subtitle="Completed Orders" />
            <Widget type="inprogOrders" value={inProgressOrders} subtitle="In Progress Orders" />
            <Widget type="fallouts" value={fallouts} subtitle="Fallouts" />
          </div>

          <div className="excel-data">
            {loading ? (
                <LoadingSpinner message="Loading orders..." />
            ) : (
                <OrdersTable
                    title="Mobile Orders"
                    data={products}
                    columns={INVENTORY_COLUMNS}
                    filters={ORDER_FILTERS}
                />
            )}
          </div>
        </div>
      </div>
  );
};

export default OrdersPage;
