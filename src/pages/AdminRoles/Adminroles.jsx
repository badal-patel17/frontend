// src/pages/AdminRoles/Adminroles.jsx
import Sidebar      from '../../components/sidebar/Sidebar';
import NavbarFlow   from '../../components/flows/navbar/NavbarFlow';
import './admin-roles.scss';
import {
  CheckBox, CheckBoxOutlineBlank, IndeterminateCheckBoxRounded, MoreVert,
} from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';
import useApi         from '../../hooks/useApi';
import { fetchUsers } from '../../api/mockApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage   from '../../components/common/ErrorMessage';

const PermissionIcon = ({ value }) => {
  if (value === true)  return <CheckBox                      sx={{ fontSize: '22px', color: '#0B6623' }} />;
  if (value === false) return <IndeterminateCheckBoxRounded  sx={{ fontSize: '22px', color: '#c7202e' }} />;
  return <CheckBoxOutlineBlank sx={{ fontSize: '22px' }} />;
};

const StatusBadge = ({ status }) => {
  const classMap = { Admin: 'badge-admin', Active: 'badge-active', Expired: 'badge-expired', Disabled: 'badge-disabled' };
  return <span className={`user-status-badge ${classMap[status] || ''}`}>{status}</span>;
};

const formatDateTime = (iso) => {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
};

// MoreMenu — dropdown triggered by ⋮ button
const MoreMenu = ({ userId, onClose }) => {
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div className="more-menu" ref={ref} role="menu" aria-label="User options">
      <button className="more-menu-item" role="menuitem" onClick={() => { alert(`Edit user ${userId}`); onClose(); }}>Edit</button>
      <button className="more-menu-item" role="menuitem" onClick={() => { alert(`Reset password for user ${userId}`); onClose(); }}>Reset Password</button>
      <button className="more-menu-item danger" role="menuitem" onClick={() => { alert(`Disable user ${userId}`); onClose(); }}>Disable</button>
    </div>
  );
};

const Adminroles = () => {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const { data: users, loading, error, refetch } = useApi(fetchUsers);

  return (
    <div className="flow-home">
      <Sidebar />
      <div className="flow-homeContainer">
        <NavbarFlow />
        <div className="excel-data">
          <div className="admin-header">
            <h2>Admin Access Control</h2>
            <p>Manage user permissions, lifecycle state, and enterprise access roles.</p>
          </div>
          <div className="table-header">
            <h2 className="table-title">Users</h2>
          </div>

          {loading && <LoadingSpinner message="Loading users..." />}
          {error   && <ErrorMessage  message={error} onRetry={refetch} />}

          {!loading && !error && (
            <div className="table-scroll">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Access Role</th>
                    <th>Last Activity (UTC)</th>
                    <th>Status</th>
                    <th>R&nbsp;&nbsp;W&nbsp;&nbsp;X</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(users ?? []).map((user) => (
                    <tr key={user.id}>
                      <td className="col-id">{user.id}</td>
                      <td>{user.username}</td>
                      <td className="col-email">{user.email}</td>
                      <td><span className="access-badge">{user.access}</span></td>
                      <td>{formatDateTime(user.lastActivity)}</td>
                      <td><StatusBadge status={user.status} /></td>
                      <td>
                        <div className="permission-icons">
                          <PermissionIcon value={user.permissions.read} />
                          <PermissionIcon value={user.permissions.write} />
                          <PermissionIcon value={user.permissions.execute} />
                        </div>
                      </td>
                      <td style={{ position: 'relative' }}>
                        <button
                          className="more-btn"
                          aria-label={`More options for ${user.username}`}
                          aria-haspopup="menu"
                          aria-expanded={menuOpenId === user.id}
                          onClick={() => setMenuOpenId(menuOpenId === user.id ? null : user.id)}
                        >
                          <MoreVert />
                        </button>
                        {menuOpenId === user.id && (
                          <MoreMenu userId={user.id} onClose={() => setMenuOpenId(null)} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Adminroles;
