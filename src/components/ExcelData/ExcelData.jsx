// src/components/ExcelData/ExcelData.jsx
import React from 'react';
import './ExcelData.scss';
import OrdersTable from '../OrdersTable/OrdersTable';
import { ordersData } from '../../data/ordersData';

const ExcelData = ({ maxRows = 8 }) => {
  return (
    <div className="excel-data-wrapper">
      <OrdersTable data={ordersData} title="Recent Orders" maxRows={maxRows} />
    </div>
  );
};

export default ExcelData;
