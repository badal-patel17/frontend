// src/pages/SOMFlow/SOMFlow.jsx
import Sidebar       from '../../components/sidebar/Sidebar';
import NavbarFlow    from '../../components/flows/navbar/NavbarFlow';
import SOMFlowChart  from '../../components/SOMFlowChart/SOMFlowChart';
import AuditLog      from '../../components/Auditlog/AuditLog';
import './SOMFlow.scss';

const SOMFlow = () => {
  return (
    <div className="flow-home">
      <Sidebar />
      <div className="flow-homeContainer">
        <NavbarFlow />
        <SOMFlowChart />
        <AuditLog />
      </div>
    </div>
  );
};

export default SOMFlow;
