// src/pages/Auditlogs/Auditlogs.jsx
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./audit-logs.scss";
import { GetApp } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { fetchAuditLogs } from "../../api/mockApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

// -- HARDCODED FALLBACK --
// const AUDIT_LOGS = [
//   { id: 1, timestamp: '2025-12-10T11:07:11.039Z', user: 'sachin-singh', flowName: 'DE-OH_BPMNLIB-19362643', type: 'data', message: '...' },
//   { id: 2, timestamp: '2025-12-10T11:08:13.019Z', ... },
//   ...
// ];

const ENVIRONMENTS = ["", "Test-Done", "Pref-Done", "Prod-Done"];
const PODS         = ["", "fallout-event-ms", "productorder-po-ms", "catalogue-order-ms"];
const FLOWS        = ["", "DE_OH_SHPMNT-103829", "DE_SOM_FULFIL-84728", "BPMN_PAY_CAT-472847"];

const Auditlogs = () => {
  const [env,     setEnv]     = useState("");
  const [pod,     setPod]     = useState("");
  const [flow,    setFlow]    = useState("");
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAuditLogs({ env, pod, flow });
      setLogs(res.data);
    } catch (err) {
      setError(err.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filters change
  useEffect(() => { loadLogs(); }, [env, pod, flow]); // eslint-disable-line

  const handleDownload = () => {
    const content = logs
      .map(l => `[${l.timestamp}] user:'${l.user}' flow:'${l.flowName}' ${l.type}: ${l.message}`)
      .join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `audit-logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flow-home-audit">
      <Sidebar />
      <div className="audit-container">
        <Navbar />
        <div className="audit-controls">
          <select className="audit-select" value={env}  onChange={e => setEnv(e.target.value)}  aria-label="Select environment">
            <option value="">Environment</option>
            {ENVIRONMENTS.filter(Boolean).map(e => <option key={e} value={e}>{e}</option>)}
          </select>

          <select className="audit-select" value={pod}  onChange={e => setPod(e.target.value)}  aria-label="Select pod">
            <option value="">Pods</option>
            {PODS.filter(Boolean).map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <select className="audit-select" value={flow} onChange={e => setFlow(e.target.value)} aria-label="Select flow">
            <option value="">Flows</option>
            {FLOWS.filter(Boolean).map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          <button className="download-btn" onClick={handleDownload} disabled={loading || logs.length === 0} aria-label="Download audit logs">
            <GetApp sx={{ fontSize: "20px" }} />
            Export
          </button>
        </div>

        <div className="cmd-screen" role="log" aria-label="Audit log output" aria-live="polite">
          <div className="cmd-header">
            <div>
              <h3>Audit Timeline</h3>
              <p>Live enterprise audit stream from VFORT operations.</p>
            </div>
            <span className="cmd-tag">Live</span>
          </div>

          {loading && <LoadingSpinner message="Fetching logs..." />}
          {error   && <ErrorMessage  message={error} onRetry={loadLogs} />}

          {!loading && !error && logs.length === 0 && (
            <p style={{ color: "#8b949e", marginTop: 16 }}>No logs found for the selected filters.</p>
          )}

          {!loading && !error && logs.map((log) => (
            <div className="log-entry" key={log.id}>
              <div className="log-entry__meta">
                <span className="time-stamp">{log.timestamp}</span>
                <span className="user-high">{log.user}</span>
                <span className="flow-name">{log.flowName}</span>
                <span className="audit-type">{log.type}</span>
              </div>
              <p>{log.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Auditlogs;
