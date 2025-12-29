import React, { useState, useEffect } from "react";
import "./Admin.css";
import { useAuth } from "../../contexts/AuthContext";
import PermissionGuard from "../../components/PermissionGuard";
import UserManagementTab from "./UserManagementTab";
import GroupManagementTab from "./GroupManagementTab";
import PermissionManagementTab from "./PermissionManagementTab";
import SystemSettingsTab from "./SystemSettingsTab";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const { user, checkFeature } = useAuth();

  // Định nghĩa các tab với features tương ứng
  const tabs = [
    { 
      id: "users", 
      label: "Quản lý người dùng", 
      icon: "👥",
      features: ["user-list", "user-create", "user-edit", "user-delete"], // Cần ít nhất 1
    },
    { 
      id: "groups", 
      label: "Quản lý nhóm", 
      icon: "📦",
      features: ["user-group-manage"], // Cần ít nhất 1
    },
    { 
      id: "permissions", 
      label: "Phân quyền", 
      icon: "🔐",
      features: ["permission-assign"], // Cần ít nhất 1
    },
    { 
      id: "settings", 
      label: "Tham số hệ thống", 
      icon: "⚙️",
      features: ["argument-manage"], // Cần ít nhất 1
    },
  ];

  // Kiểm tra quyền xem từng tab
  const canViewTab = (tabFeatures) => {
    return tabFeatures.some(feature => checkFeature(feature));
  };

  // Lọc tabs mà user có quyền xem
  const visibleTabs = tabs.filter(tab => canViewTab(tab.features));

  // Nếu không có tab nào, set activeTab = ""
  // Nếu tab hiện tại không còn visible, chuyển sang tab đầu tiên có quyền
  useEffect(() => {
    if (visibleTabs.length === 0) {
      setActiveTab("");
    } else if (!visibleTabs.find(t => t.id === activeTab)) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

  const adminContent = (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🛠️ Quản trị hệ thống</h1>
        <p>Chào mừng, <strong>{user?.TenDangNhap}</strong> - Administrator</p>
      </div>

      {/* Render tab buttons chỉ cho những tab mà user có quyền */}
      {visibleTabs.length > 0 ? (
        <>
          <div className="admin-tabs">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                data-feature={tab.features.join(",")}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="admin-content">
            {activeTab === "users" && <UserManagementTab />}
            {activeTab === "groups" && <GroupManagementTab />}
            {activeTab === "permissions" && <PermissionManagementTab />}
            {activeTab === "settings" && <SystemSettingsTab />}
          </div>
        </>
      ) : (
        <div className="admin-unauthorized">
          <h2>⛔ Bạn không có quyền</h2>
          <p>Bạn không có quyền truy cập bất kỳ tính năng nào trong trang quản trị.</p>
          <p>Vui lòng liên hệ quản trị viên để được cấp quyền.</p>
        </div>
      )}
    </div>
  );

  return <>{adminContent}</>;
};

export default Admin;
