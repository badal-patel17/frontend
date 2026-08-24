// src/pages/FixFlow/FixFlow.jsx
import Sidebar        from '../../components/sidebar/Sidebar';
import NavbarFlow     from '../../components/flows/navbar/NavbarFlow';
import './fix-flow.scss';
import WidgetFallout  from '../../components/FixFallout/widgetFallout/WidgetFallout';

const FixFlow = () => {
  return (
    <div className="flow-home">
      <Sidebar />
      <div className="flow-homeContainer">
        <NavbarFlow />
        <div className="widgets">
          <WidgetFallout type="user" />
          <WidgetFallout type="order" />
          <WidgetFallout type="balance" />
          <WidgetFallout type="fallout" />
          <WidgetFallout type="earning" />
        </div>
      </div>
    </div>
  );
};

export default FixFlow;
