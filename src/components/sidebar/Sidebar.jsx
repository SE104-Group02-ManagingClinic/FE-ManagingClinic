import React from "react";
import "./Sidebar.css";
import SidebarItem from "./SidebarItem";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { getSidebarItems, logout, user } = useAuth();
  const navigate = useNavigate();
  
  // Lấy danh sách menu items dựa trên quyền của user
  const accessibleItems = getSidebarItems();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
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
      
      <div className="sidebar-footer">
        {user && (
          <div className="sidebar-user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <div className="user-name">{user.TenDangNhap}</div>
              <div className="user-role">{user.TenNhom || 'User'}</div>
            </div>
          </div>
        )}
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
