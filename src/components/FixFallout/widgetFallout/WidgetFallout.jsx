// src/components/FixFallout/widgetFallout/WidgetFallout.jsx
import './widget-fallout.scss';
import ArrowRightAltOutlined from '@mui/icons-material/ArrowRightAlt';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Fallout cards are currently populated from static config.
// Replace FALLOUT_CONFIG with an API call to fetchFallouts() when backend is ready.
const FALLOUT_CONFIG = {
  user: {
    title:    'NotifyBilling JF1-000230',
    subtitle: 'Validation of subscriberServicesUpdateSubscriberInputInfo failed.',
    count:    2,
    link:     'Short desc: Validation of subscriberServicesUpdateSubscriberInputInfo.',
    url:      '/flow',
  },
  order: {
    title:    'DE-OH-BPMLIB-04080002',
    subtitle: 'Stuck at initiate shipping step.',
    count:    3,
    link:     'Short desc: No response received from shipping past 7 days.',
    url:      '/ndlh-flow',
  },
  fallout: {
    title:    'CM1-000504',
    subtitle: 'Payment category mismatch detected.',
    count:    3,
    link:     'Short desc: Payment category mismatched.',
    url:      '/nb-flow',
  },
  balance: {
    title:    'CM1-000003',
    subtitle: 'Stuck due to invalid BAN.',
    count:    2,
    link:     'Short desc: Activity not allowed for Billing Arrangement Entity.',
    url:      '/som-flow',
  },
  earning: {
    title:   'Build New Flow',
    subtitle: 'Design a new remediation flow.',
    count:   null,
    link:    'Click to open Flow Designer.',
    url:     '/flow',
    isNew:   true,
  },
};

const WidgetFallout = ({ type }) => {
  const cfg = FALLOUT_CONFIG[type];
  if (!cfg) return null;

  return (
    <div className={`widget-fallout ${cfg.isNew ? 'widget-fallout--new' : ''}`}>
      <div className="widget-fallout__left">
        <span className="widget-fallout__title">{cfg.title}</span>
        <span className="widget-fallout__subtitle">{cfg.subtitle}</span>
        {cfg.count !== null && (
          <span className="widget-fallout__counter">{cfg.count}</span>
        )}
        <span className="widget-fallout__link">{cfg.link}</span>
      </div>
      <div className="widget-fallout__right">
        <Link to={cfg.url} style={{ textDecoration: 'none' }} aria-label={`Open ${cfg.title}`}>
          {cfg.isNew
            ? <Add style={{ color: 'white', fontSize: 32 }} />
            : <ArrowRightAltOutlined style={{ color: 'white', fontSize: 32 }} />}
        </Link>
      </div>
    </div>
  );
};

export default WidgetFallout;
