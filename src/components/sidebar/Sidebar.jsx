import React from "react";
import "./Sidebar.css";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <SidebarItem icon="🏠" label="Trang chủ" path="/" className ="home"/>
      <SidebarItem icon="🩺" label="Khám bệnh" path="/examine" className="examine"/>
      <SidebarItem icon="💊" label="Quản lí thuốc" path="/medicines" className="medicines"/>
      <SidebarItem icon="📊" label="Báo cáo" path="/statistics" className="statistics"/>
      <SidebarItem icon="⚙️" label="Cài đặt" path="/settings" className="settings"/>
    </div>
  );
};

export default Sidebar;
