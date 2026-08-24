// src/components/sidebar/Sidebar.jsx
import './sidebar.scss';
import PersonOutlineIcon      from '@mui/icons-material/PersonOutline';
import StoreIcon              from '@mui/icons-material/Store';
import CreditCardIcon         from '@mui/icons-material/CreditCard';
import ExitToAppIcon          from '@mui/icons-material/ExitToApp';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { InfoOutlined, ArticleOutlined }       from '@mui/icons-material';
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
const Sidebar = () => {
  const navigate     = useNavigate();
  const location     = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('vfort_token');
    navigate('/login');
  };

  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="top">
        <Link to="/" style={{ textDecoration: 'none' }} aria-label="Go to dashboard">
          <span className="logo">
            <img className="logo-img" src='/images/logo.png' alt="VFORT logo" />
          </span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>

          <p className="title">HOME</p>

          <Link to="/" style={{ textDecoration: 'none' }}>
            <li
                style={
                  isActive('/')
                      ? { background: 'rgba(255,255,255,0.25)' }
                      : {}
                }
            >
              <HomeOutlinedIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className="title">ORDERS</p>
          <Link to="/orders" style={{ textDecoration: 'none' }}>
            <li style={isActive('/orders') ? { background: 'rgba(255,255,255,0.25)' } : {}}>
              <ArticleOutlined className="icon" /><span>Orders Overview</span>
            </li>
          </Link>
          <Link to="/detect-fallout" style={{ textDecoration: 'none' }}>
            <li
                style={
                  isActive('/detect-fallout')
                      ? { background: 'rgba(255,255,255,0.25)' }
                      : {}
                }
            >
              <PersonOutlineIcon className="icon" />
              <span>Detect Fallout</span>
            </li>
          </Link>
          <Link to="/fix-flow" style={{ textDecoration: 'none' }}>
            <li style={isActive('/fix-flow') ? { background: 'rgba(255,255,255,0.25)' } : {}}>
              <StoreIcon className="icon" /><span>Fix Fallout</span>
            </li>
          </Link>
          <Link to="/automation-analytics" style={{ textDecoration: 'none' }}>
            <li style={isActive('/automation-analytics') ? { background: 'rgba(255,255,255,0.25)' } : {}}>
              <AutoGraphOutlinedIcon className="icon" /><span>Automation Analytics</span>
            </li>
          </Link>
          <Link to="/flow" style={{ textDecoration: 'none' }}>
            <li style={isActive('/flow') ? { background: 'rgba(255,255,255,0.25)' } : {}}>
              <CreditCardIcon className="icon" /><span>Flow Designer</span>
            </li>
          </Link>
          <li
            onClick={() => navigate('/audit')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/audit')}
            style={isActive('/audit') ? { background: 'rgba(255,255,255,0.25)' } : {}}
          >
            <InfoOutlined className="icon" /><span>Audit Log</span>
          </li>

          <p className="title">USER</p>
          <Link to="/admin/users" style={{ textDecoration: 'none' }}>
            <li style={isActive('/admin/users') ? { background: 'rgba(255,255,255,0.25)' } : {}}>
              <AccountCircleOutlinedIcon className="icon" /><span>Admin</span>
            </li>
          </Link>
          <li
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleLogout()}
            aria-label="Logout"
          >
            <ExitToAppIcon className="icon" /><span>Logout</span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
