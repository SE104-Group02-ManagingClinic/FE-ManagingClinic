import React from "react";
import "./SidebarItem.css";
const SidebarItem = ({icon, label, className, onClick}) => {
    return (
        <div className={`sidebar-item ${className}`}>
            <div className="indicator"></div>
            <div className="sidebar-item-icon">{icon}</div>
            <div className="sidebar-item-label">{label}
            </div>
            <div className="sidebar-item-action" onClick={onClick}></div>
        </div>
    );
}
export default SidebarItem;