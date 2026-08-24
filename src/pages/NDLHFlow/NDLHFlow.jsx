// src/pages/NDLHFlow/NDLHFlow.jsx
import Sidebar        from '../../components/sidebar/Sidebar';
import NavbarFlow     from '../../components/flows/navbar/NavbarFlow';
import NDLHFlowChart  from '../../components/NDLHFlowChart/NDLHFlowChart';
import AuditLog       from '../../components/Auditlog/AuditLog';
import './NDLHFlow.scss';

const NDLHFlow = () => {
  return (
    <div className="flow-home">
      <Sidebar />
      <div className="flow-homeContainer">
        <NavbarFlow />
        <NDLHFlowChart />
        <AuditLog />
      </div>
    </div>
  );
};

export default NDLHFlow;
