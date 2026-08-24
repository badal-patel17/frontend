// src/components/flows/navbar/NavbarFlow.jsx
import './navbar-flow.scss';
import SearchOutlinedIcon    from '@mui/icons-material/SearchOutlined';
import DarkModeOutlinedIcon  from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircle         from '@mui/icons-material/AccountCircle';
import { Square }            from '@mui/icons-material';
import { DarkModeContext }   from '../../../context/darkModeContext';
import { useContext, useState } from 'react';

const NavbarFlow = () => {
  const { darkMode, dispatch } = useContext(DarkModeContext);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="navbar-flow" role="banner">
      <div className="navbar-flow__inner">
        {/* Brand */}
        <div className="navbar-flow__brand">
          <Square sx={{ color: '#e00000', fontSize: 18 }} />
          <div>
            <span className="navbar-flow__title">VFORT</span>
            <span className="navbar-flow__env">Vodafone Germany - Sandbox</span>
          </div>
        </div>

        {/* Search */}
        <div className="navbar-flow__search">
          <label htmlFor="flow-search" className="visually-hidden">Search flows</label>
          <SearchOutlinedIcon className="navbar-flow__search-icon" aria-hidden="true" />
          <input
            id="flow-search"
            type="text"
            placeholder="Search flows..."
            aria-label="Search flows"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="navbar-flow__search-input"
          />
        </div>

        {/* Actions */}
        <div className="navbar-flow__actions">
          <button className="navbar-flow__icon-btn" aria-label="Notifications" title="Notifications">
            <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
          </button>
          <button
            className="navbar-flow__icon-btn"
            onClick={() => dispatch({ type: 'TOGGLE' })}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode
              ? <LightModeOutlinedIcon sx={{ fontSize: 20 }} />
              : <DarkModeOutlinedIcon  sx={{ fontSize: 20 }} />}
          </button>
          <AccountCircle sx={{ fontSize: 30, color: '#3E424B', cursor: 'pointer' }} aria-label="User profile" />
        </div>
      </div>
    </header>
  );
};

export default NavbarFlow;
