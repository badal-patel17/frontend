// src/pages/home/Home.jsx

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";

import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import OrdersTable from "../../components/OrdersTable/OrdersTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

import { SearchOutlined, Today } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "/vfort/api";

const FILTER_OPTIONS = [
  { value: "", label: "Filter orders" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "Last week" },
  { value: "month", label: "Last month" },
  { value: "6months", label: "Last 6 months" }
];

const normalizeList = (data) =>
    Array.isArray(data)
        ? data
        : data?.data || [];

const getOrderId = (item) =>
    item?.orderId ||
    item?.order_id ||
    item?.id ||
    "";

const isCompletedOrder = (status) => {
  const normalized = String(status || "").toUpperCase();
  return normalized === "DO" || normalized === "COMPLETED" || normalized === "SUCCESS";
};

const Home = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [orders, setOrders] = useState([]);
  const [failedOrders, setFailedOrders] = useState([]);
  const [unmappedFaults, setUnmappedFaults] = useState([]);
  const [manualReviews, setManualReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const loginResponse = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: "admin",
            password: "admin"
          })
        });

        if (!loginResponse.ok) {
          throw new Error("Authentication failed");
        }

        const loginData = await loginResponse.json();

        const headers = {
          Authorization: `Bearer ${loginData.token}`,
          "Content-Type": "application/json"
        };

        const [
          ordersResponse,
          failedResponse,
          unmappedResponse,
          reviewResponse
        ] = await Promise.all([
          fetch(`${API_BASE}/orders`, { method: "GET", headers }),
          fetch(`${API_BASE}/failed-orders`, { method: "GET", headers }),
          fetch(`${API_BASE}/unmapped-faults`, { method: "GET", headers }),
          fetch(`${API_BASE}/manual-review`, { method: "GET", headers })
        ]);

        if (!ordersResponse.ok) {
          throw new Error("Failed to load orders");
        }

        if (!failedResponse.ok) {
          throw new Error("Failed to load failed orders");
        }

        if (!unmappedResponse.ok) {
          throw new Error("Failed to load unmapped faults");
        }

        if (!reviewResponse.ok) {
          throw new Error("Failed to load manual review");
        }

        const ordersData = await ordersResponse.json();
        const failedData = await failedResponse.json();
        const unmappedData = await unmappedResponse.json();
        const reviewData = await reviewResponse.json();

        setOrders(normalizeList(ordersData));
        setFailedOrders(normalizeList(failedData));
        setUnmappedFaults(normalizeList(unmappedData));
        setManualReviews(normalizeList(reviewData));

        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setError(err.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const dashboardMetrics = useMemo(() => {
    const distinctOrderIds = new Set();

    orders.forEach((item) => {
      const id = getOrderId(item);
      if (id) distinctOrderIds.add(String(id));
    });

    failedOrders.forEach((item) => {
      const id = getOrderId(item);
      if (id) distinctOrderIds.add(String(id));
    });

    unmappedFaults.forEach((item) => {
      const id = getOrderId(item);
      if (id) distinctOrderIds.add(String(id));
    });

    manualReviews.forEach((item) => {
      const id = getOrderId(item);
      if (id) distinctOrderIds.add(String(id));
    });

    return {
      distinctOrders: distinctOrderIds.size,
      totalOrders: orders.length,
      omsOrders: orders.length,
      completedOrders: orders.filter(item => isCompletedOrder(item.status)).length,
      inProgressOrders: orders.filter(item => !isCompletedOrder(item.status)).length,
      failedOrders: failedOrders.length,
      unmappedFaults: unmappedFaults.length,
      manualReviews: manualReviews.length,
      falloutItems:
          failedOrders.length +
          unmappedFaults.length +
          manualReviews.length,
      successRate: orders.length
          ? Math.round((orders.filter(item => isCompletedOrder(item.status)).length / orders.length) * 100)
          : 0
    };
  }, [
    orders,
    failedOrders,
    unmappedFaults,
    manualReviews
  ]);

  const filteredData = useMemo(() => {
    let data = [...orders];

    if (selectedOption) {
      const now = new Date();

      data = data.filter((order) => {
        const rawDate =
            order.createdAt ||
            order.creDateTime ||
            order.executionDate ||
            order.updatedAt;

        if (!rawDate) return true;

        const orderDate = new Date(rawDate);

        if (Number.isNaN(orderDate.getTime())) {
          return true;
        }

        const diffMs = now.getTime() - orderDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (selectedOption === "today") {
          return orderDate.toDateString() === now.toDateString();
        }

        if (selectedOption === "yesterday") {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          return orderDate.toDateString() === yesterday.toDateString();
        }

        if (selectedOption === "week") {
          return diffDays <= 7;
        }

        if (selectedOption === "month") {
          return diffDays <= 30;
        }

        if (selectedOption === "6months") {
          return diffDays <= 180;
        }

        return true;
      });
    }

    if (!searchTerm) {
      return data;
    }

    const lower = searchTerm.toLowerCase();

    return data.filter(
        (order) =>
            String(order.orderId || "").toLowerCase().includes(lower) ||
            String(order.customerId || "").toLowerCase().includes(lower) ||
            String(order.customerType || "").toLowerCase().includes(lower) ||
            String(order.status || "").toLowerCase().includes(lower) ||
            String(order.actionType || "").toLowerCase().includes(lower)
    );
  }, [orders, searchTerm, selectedOption]);

  return (
      <div className="home">
        <Sidebar />

        <div className="homeContainer">
          <Navbar />

          <div className="header-info">
            <div>
              <h1>Dashboard</h1>
              <p>Order Tracking & Fallout Management</p>
            </div>

            <div className="search-home">
              <div className="search">
              <span className="align-search-icon">
                <SearchOutlined sx={{ color: "black" }} />
              </span>

                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    aria-label="Search orders"
                />
              </div>

              <div>
                <select
                    id="date-filter"
                    value={selectedOption}
                    onChange={(event) => setSelectedOption(event.target.value)}
                    aria-label="Filter orders by date"
                >
                  {FILTER_OPTIONS.map((option) => (
                      <option
                          key={option.value}
                          value={option.value}
                      >
                        {option.label}
                      </option>
                  ))}
                </select>
              </div>

              <div>
                <Today
                    className="filter-widgets"
                    sx={{
                      fontSize: "30px",
                      color: "darkgray"
                    }}
                />
              </div>
            </div>
          </div>

          <div className="widgets">
            <Widget
                type="order"
                value={dashboardMetrics.distinctOrders}
                lastUpdated={lastUpdated}
                subtitle="Orders"
            />

            <Widget
                type="flows"
                value={1}
                lastUpdated={lastUpdated}
                subtitle="Flows"
            />

            <Widget
                type="fallouts"
                value={
                    failedOrders.length +
                    unmappedFaults.length +
                    manualReviews.length
                }
                lastUpdated={lastUpdated}
                subtitle="Fallouts"
            />

            <Widget
                type="user"
                value={manualReviews.length}
                lastUpdated={lastUpdated}
                subtitle="Manual Review"
            />

            <Widget
                type="successRate"
                value={`${dashboardMetrics.successRate}%`}
                lastUpdated={lastUpdated}
                subtitle="Success Rate"
            />

          </div>

          <div className="charts">
            <Featured
                orders={orders}
                failedOrders={failedOrders}
                unmappedFaults={unmappedFaults}
                manualReviews={manualReviews}
                metrics={dashboardMetrics}
            />
          </div>

          <div className="detail-data">
            {loading && (
                <LoadingSpinner message="Loading dashboard..." />
            )}

            {error && (
                <ErrorMessage message={error} />
            )}

            {!loading && !error && (
                <OrdersTable
                    data={filteredData}
                    title="Recent Orders"
                    maxRows={5}
                />
            )}
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="quick-actions__grid">
              <Link to="/orders" className="quick-action-card">Orders Overview</Link>
              <Link to="/detect-fallout" className="quick-action-card">Detect Fallout</Link>
              <Link to="/fix-flow" className="quick-action-card">Fix Fallout</Link>
              <Link to="/automation-analytics" className="quick-action-card">Automation Analytics</Link>
              <Link to="/flow" className="quick-action-card">Flow Designer</Link>
              <Link to="/audit" className="quick-action-card">Audit Logs</Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Home;