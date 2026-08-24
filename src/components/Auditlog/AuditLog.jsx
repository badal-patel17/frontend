import React from "react";
import { useState, useEffect } from "react";
import "./AuditLog.scss";

const AuditLog = () => {
  const auditData = [
    {
      user:'rohit-matwaani1',
      state: "✔",
      activity: "Process Started",
      startTime: "2026-01-09 09:48",
      endTime: "2026-01-09 09:48",
    },
    {
      state: "✔",
      activity: "Check Dependency",
      startTime: "2026-01-09 09:49",
      endTime: "2026-01-09 09:50",
    },
    {
      state: "✔",
      activity: "GET (TBASSIGNMENT, TBMESSAGE)",
      startTime: "2026-01-09 09:51",
      endTime: "2026-01-09 09:52",
    },
    {
      state: "✔",
      activity: "GET (TBORDER_ACTION, TBAP_ITEM)",
      startTime: "2026-01-09 09:57",
      endTime: "2026-01-09 09:58",
    },
    {
      state: "✔",
      activity: "UPDATE (TBAP_ITEM - item_atrs_list)",
      startTime: "2026-01-09 09:59",
      endTime: "2026-01-09 10:01",
    },
    {
      state: "✔",
      activity: "APM resend",
      startTime: "2026-01-09 10:05",
      endTime: "2026-01-09 10:07",
    },
    {
      state: "✔",
      activity: "Verify State",
      startTime: "2026-01-09 10:07",
      endTime: "2026-01-09 10:11",
    },
    {
      state: "✔",
      activity: "End",
      startTime: "2026-01-09 09:51",
      endTime: "2026-01-09 09:52",
    },
  ];





  return (
    <div className="audit-log-container">
      <h4>Flow Insights NotifyBilling JF1-000230</h4>
      <table className="audit-log-table">
        <thead>
          <tr>
            {/* <th>User</th> */}
            <th>State</th>
            <th>Activity</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {auditData.map((row, index) => (
            <tr key={index}>
              {/* <td>{row.id}</td> */}
              {/* <td>{row.user}</td> */}
              <td>{row.state}</td>
              <td>{row.activity}</td>
              <td>{row.startTime}</td>
              <td>{row.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLog;
