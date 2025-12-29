/**
 * EXAMPLE: Cách sử dụng permissionUtils để quản lý tab permissions
 * 
 * File này chỉ là ví dụ - bạn có thể reference hoặc copy logic vào các pages
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createTabPermissionHelper, debugTabPermissions } from "../utils/permissionUtils";

/**
 * Example Component: Admin Page with Tab Permissions
 * 
 * Pattern này có thể áp dụng cho bất kỳ page nào có multiple tabs
 */
const AdminWithPermissionHelper = () => {
  const { checkFeature } = useAuth();
  const [activeTab, setActiveTab] = useState(null);

  // ✅ Định nghĩa tabs configuration
  const tabsConfig = [
    {
      id: "users",
      label: "👥 Quản lý người dùng",
      features: ["user-list", "user-create", "user-edit", "user-delete"],
    },
    {
      id: "groups",
      label: "📦 Quản lý nhóm",
      features: ["user-group-manage"],
    },
    {
      id: "permissions",
      label: "🔐 Phân quyền",
      features: ["permission-assign"],
    },
    {
      id: "settings",
      label: "⚙️ Tham số hệ thống",
      features: ["argument-manage"],
    },
  ];

  // ✅ Sử dụng helper function
  const { visibleTabs, getValidActiveTab } = createTabPermissionHelper(
    tabsConfig,
    checkFeature
  );

  // ✅ Set activeTab dựa trên quyền
  useEffect(() => {
    // Nếu activeTab chưa được set hoặc không còn quyền, set thành tab đầu tiên
    if (!activeTab) {
      const firstVisibleId = visibleTabs.length > 0 ? visibleTabs[0].id : null;
      setActiveTab(firstVisibleId);
    } else {
      // Validate activeTab
      const validTab = getValidActiveTab(activeTab);
      if (validTab !== activeTab) {
        setActiveTab(validTab);
      }
    }

    // ✅ Debug: Xem tab permissions (chỉ trong dev mode)
    if (process.env.NODE_ENV === 'development') {
      debugTabPermissions('Admin Page', tabsConfig, visibleTabs, []);
    }
  }, [visibleTabs]);

  return (
    <div className="admin-container">
      <h1>🛠️ Quản trị hệ thống</h1>

      {/* ✅ Hiển thị tabs chỉ cho những tab mà user có quyền */}
      {visibleTabs.length > 0 ? (
        <>
          <div className="admin-tabs">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="admin-content">
            {activeTab === "users" && <p>User Management Content</p>}
            {activeTab === "groups" && <p>Group Management Content</p>}
            {activeTab === "permissions" && <p>Permission Management Content</p>}
            {activeTab === "settings" && <p>Settings Content</p>}
          </div>
        </>
      ) : (
        <div className="no-permission">
          <h2>⛔ Bạn không có quyền</h2>
          <p>Bạn không có quyền truy cập bất kỳ tính năng nào trong trang quản trị.</p>
        </div>
      )}
    </div>
  );
};

export default AdminWithPermissionHelper;
