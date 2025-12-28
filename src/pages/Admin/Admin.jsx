import React, { useState, useEffect } from "react";
import "./Admin.css";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import UserManagementTab from "./UserManagementTab";
import GroupManagementTab from "./GroupManagementTab";
import PermissionManagementTab from "./PermissionManagementTab";
import SystemSettingsTab from "./SystemSettingsTab";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const { user } = useAuth();
  const { showError } = useToast();

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!user || user.MaNhom !== "GR001") {
      showError("Bạn không có quyền truy cập trang này!");
    }
  }, [user, showError]);

  // Nếu không phải admin, không render gì cả
  if (!user || user.MaNhom !== "GR001") {
    return (
      <div className="admin-container">
        <div className="admin-unauthorized">
          <h2>⛔ Truy cập bị từ chối</h2>
          <p>Bạn không có quyền truy cập trang quản trị.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "users", label: "Quản lý người dùng", icon: "👥" },
    { id: "groups", label: "Quản lý nhóm", icon: "📦" },
    { id: "permissions", label: "Phân quyền", icon: "🔐" },
    { id: "settings", label: "Tham số hệ thống", icon: "⚙️" },
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🛠️ Quản trị hệ thống</h1>
        <p>Chào mừng, <strong>{user.TenDangNhap}</strong> - Administrator</p>
      </div>

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
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
    </div>
  );
};

export default Admin;
