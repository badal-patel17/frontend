// src/components/navbar/Navbar.jsx
import './navbar.scss';
import DarkModeOutlinedIcon          from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon         from '@mui/icons-material/LightModeOutlined';
import AccountCircle                 from '@mui/icons-material/AccountCircle';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOutlinedIcon            from '@mui/icons-material/SearchOutlined';
import { Square }                    from '@mui/icons-material';
import { DarkModeContext }           from '../../context/darkModeContext';
import { useContext, useState }      from 'react';

const Navbar = () => {
  const { darkMode, dispatch } = useContext(DarkModeContext);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        {/* Brand */}
        <div className="navbar__brand">
          <Square sx={{ color: '#e00000', fontSize: 18 }} />
          <div className="navbar__title-group">
            <span className="navbar__title">VI-FORT</span>
            <span className="navbar__version">Vodafone Germany - Sandbox</span>
          </div>
        </div>

        <div className="navbar__search">
          <SearchOutlinedIcon className="navbar__search-icon" aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Global search"
            aria-label="Global search"
          />
        </div>

        {/* Actions */}
        <div className="navbar__actions">
          <button className="navbar__icon-btn" aria-label="Notifications" title="Notifications">
            <NotificationsNoneOutlinedIcon sx={{ fontSize: 22 }} />
          </button>
          <button
            className="navbar__icon-btn"
            onClick={() => dispatch({ type: 'TOGGLE' })}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode
              ? <LightModeOutlinedIcon sx={{ fontSize: 22 }} />
              : <DarkModeOutlinedIcon  sx={{ fontSize: 22 }} />}
          </button>
          <AccountCircle sx={{ fontSize: 32, color: '#3E424B', cursor: 'pointer' }} aria-label="User profile" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
