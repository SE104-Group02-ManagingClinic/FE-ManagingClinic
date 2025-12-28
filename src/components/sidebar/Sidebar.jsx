import React from "react";
import "./Sidebar.css";
import SidebarItem from "./SidebarItem";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const { getSidebarItems } = useAuth();
  
  // Lấy danh sách menu items dựa trên quyền của user
  const accessibleItems = getSidebarItems();

  return (
    <div className="sidebar">
      {accessibleItems.map((item) => (
        <SidebarItem 
          key={item.path}
          icon={item.icon} 
          label={item.label} 
          path={item.path} 
          className={item.path.replace('/', '')}
        />
      ))}
    </div>
  );
};

export default Sidebar;
