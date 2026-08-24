// src/components/featured/Featured.jsx

import React, { useMemo } from "react";
import "./featured.scss";

const getOrderId = (item) => item?.orderId || item?.order_id || item?.id || "-";

const getDateValue = (item) =>
  item?.createdAt || item?.updatedAt || item?.lastSeenAt || item?.firstSeenAt || item?.lastFailedAt || null;

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
};

const trimText = (value, max = 58) => {
  const text = String(value || "");
  return text.length > max ? `${text.slice(0, max)}...` : text;
};

const isCompletedOrder = (status) => {
  const normalized = String(status || "").toUpperCase();
  return normalized === "DO" || normalized === "COMPLETED" || normalized === "SUCCESS";
};

const buildTrendPoints = (orders) => {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayMap = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0
  };

  orders.forEach((item) => {
    const raw =
      item?.createdAt ||
      item?.createdDateTime ||
      item?.creDateTime ||
      item?.updatedAt ||
      item?.executionDate;

    if (!raw) return;

    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return;

    const jsDay = d.getDay();
    const weekIndex = jsDay === 0 ? 6 : jsDay - 1;
    const weekLabel = weekDays[weekIndex];
    dayMap[weekLabel] += 1;
  });

  return weekDays.map((label) => ({
    date: label,
    label,
    value: dayMap[label]
  }));
};

const Featured = ({ orders = [], failedOrders = [], unmappedFaults = [], manualReviews = [] }) => {
  const trend = useMemo(() => buildTrendPoints(orders), [orders]);

  const maxTrend = Math.max(...trend.map((item) => item.value), 1);
  const hasMeaningfulTrend = trend.filter((item) => item.value > 0).length > 1;
  const yTicks = [maxTrend, Math.max(Math.round(maxTrend / 2), 1), 0];
  const chartPath = trend
    .map((point, idx) => {
      const x = (idx / Math.max(trend.length - 1, 1)) * 100;
      const y = 92 - (point.value / maxTrend) * 78;
      return `${idx === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  const totals = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter((item) => isCompletedOrder(item.status)).length;
    return {
      total,
      completed,
      inProgress: total - completed
    };
  }, [orders]);

  const priorityQueue = useMemo(() => {
    const failed = failedOrders.map((item) => ({
      orderId: getOrderId(item),
      reason: item.errorMessage || item.errorCode || item.errorClassification || "Failed order",
      severity: item.severity || "High",
      type: "Failed Orders",
      ts: getDateValue(item),
      priority: 1
    }));

    const review = manualReviews.map((item) => ({
      orderId: getOrderId(item),
      reason: item.lastError || item.errorClassification || item.falloutType || "Manual review",
      severity: item.severity || "Medium",
      type: "Manual Reviews",
      ts: getDateValue(item),
      priority: 2
    }));

    const unmapped = unmappedFaults.map((item) => ({
      orderId: getOrderId(item),
      reason: item.errorMessage || item.formId || item.mappedProcessKey || "Unmapped fault",
      severity: item.severity || "Medium",
      type: "Unmapped Faults",
      ts: getDateValue(item),
      priority: 3
    }));

    return [...failed, ...review, ...unmapped]
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return new Date(b.ts || 0) - new Date(a.ts || 0);
      })
      .slice(0, 5);
  }, [failedOrders, manualReviews, unmappedFaults]);

  return (
    <div className="featured-enterprise">
      <div className="enterprise-card trend-card">
        <div className="card-head">
          <h3>Order Load Trends</h3>
          <span>Mon - Sun</span>
        </div>
        {hasMeaningfulTrend ? (
          <>
            <div className="trend-area">
              <div className="trend-y-axis">
                {yTicks.map((tick) => (
                  <span key={tick}>{tick}</span>
                ))}
              </div>
              <svg viewBox="0 0 100 100" className="trend-chart" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0,20 L100,20" className="trend-grid" />
                <path d="M0,56 L100,56" className="trend-grid" />
                <path d="M0,92 L100,92" className="trend-axis" />
                <path d={chartPath} className="trend-line" />
                {trend.map((point, idx) => {
                  const x = (idx / Math.max(trend.length - 1, 1)) * 100;
                  const y = 92 - (point.value / maxTrend) * 78;
                  return <circle key={`${point.label}-${idx}`} cx={x} cy={y} r="1.7" className="trend-point" />;
                })}
              </svg>
            </div>
            <div className="trend-labels">
              {trend.map((item) => (
                <span key={item.date}>{item.label}</span>
              ))}
            </div>
          </>
        ) : (
          <div className="trend-empty">Not enough data available for meaningful trend analysis.</div>
        )}
        <div className="trend-summary">
          <span>Total Orders: <strong>{totals.total}</strong></span>
          <span>Completed Orders: <strong>{totals.completed}</strong></span>
          <span>In Progress Orders: <strong>{totals.inProgress}</strong></span>
        </div>
      </div>

      <div className="enterprise-card queue-card">
        <div className="card-head">
          <h3>Priority Queue</h3>
          <span>Top Fallout Records</span>
        </div>
        <div className="queue-list">
          {priorityQueue.length === 0 ? (
            <p className="queue-empty">No fallout records available.</p>
          ) : (
            priorityQueue.map((item, index) => (
              <div className="queue-row" key={`${item.orderId}-${item.type}-${index}`}>
                <strong>{item.orderId}</strong>
                <span className="queue-reason">{trimText(item.reason, 42)}</span>
                <span className="queue-type">{item.type}</span>
                <span className="queue-severity">{item.severity}</span>
                <small>{formatDate(item.ts)}</small>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default Featured;