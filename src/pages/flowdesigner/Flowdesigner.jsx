import "./Flowdesigner.scss";
import Flowdesignerflowchart from "../../components/Flowdesignerflowchart/Flowdesignerflowchart";
import AuditLog from "../../components/Auditlog/AuditLog";
import NavbarFlow from "../../components/flows/navbar/NavbarFlow";
import SidebarFlow from "../../components/flows/sidebar/SidebarFlow";
 
const Flowdesigner = () => {
  return (
    <div className="flow-home">
      <SidebarFlow />
      <div className="flow-homeContainer">
        <NavbarFlow />
        <Flowdesignerflowchart className="flow-chart" />
        <AuditLog />
        {/* <SignIn /> */}
      </div>
    </div>
  );
};
 
export default Flowdesigner;
 