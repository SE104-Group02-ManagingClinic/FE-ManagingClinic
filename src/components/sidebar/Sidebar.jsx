import React from "react";
import "./Sidebar.css";
import SidebarItem from "./SidebarItem";
const Sidebar = () => { 
    return (
        <div className="sidebar">
            <SidebarItem className="home"
                icon="🏠"
                label="Trang chủ"
            />
            <SidebarItem className="appointments"
                icon="📅"
                label="Lịch hẹn"
            />
            <SidebarItem className="patients"
                icon="🧑‍⚕️"
                label="Default"
            />
            <SidebarItem className="medicines"
                icon="💊"
                label="Default"
            />
            <SidebarItem className="statistics"
                icon="📊"
                label="Default"
            />
        </div>
    );
}   
export default Sidebar;