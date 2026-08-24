// src/pages/NBFlow/NBFlow.jsx
import Sidebar    from '../../components/sidebar/Sidebar';
import NavbarFlow from '../../components/flows/navbar/NavbarFlow';
import NBFlowChart from '../../components/NBFlow/NBFlow';
import AuditLog   from '../../components/Auditlog/AuditLog';
import './NBFlow.scss';

const NBFlow = () => {
  return (
    <div className="flow-home">
      <Sidebar />
      <div className="flow-homeContainer">
        <NavbarFlow />
        <NBFlowChart />
        <AuditLog />
      </div>
    </div>
  );
};

export default NBFlow;
