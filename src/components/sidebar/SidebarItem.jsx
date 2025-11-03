import React from "react";
import "./SidebarItem.css";
import { useNavigate, useLocation } from "react-router-dom";
const SidebarItem = ({icon, label, className, path, onClick}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleClick = () => {
    if (path && location.pathname !== path) {
      navigate(path);
    }
    };
    return (
        <div className={`sidebar-item ${className}`}
        onClick={handleClick}>
            <div className="indicator"></div>
            <div className="sidebar-item-icon">{icon}</div>
            <div className="sidebar-item-label">{label}
            </div>
            <div className="sidebar-item-action" onClick={onClick}></div>
        </div>
    );
}
export default SidebarItem;