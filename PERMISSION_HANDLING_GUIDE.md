# 📋 Hướng Dẫn Xử Lý Phân Quyền Ở Frontend (Chi Tiết)

## 🎯 Nguyên Tắc Chính

**Khi user chỉ có quyền truy cập một vài elements trong tab → Tab đó PHẢI hiển thị, nhưng các elements cấm truy cập sẽ bị ẩn.**

Vì dụ:
- User có `patient-list` nhưng không có `patient-edit` → **Tab "Bệnh nhân" vẫn hiển thị**, nhưng nút "Sửa" bị ẩn
- User không có bất kỳ feature nào trong `/admin` tab → **Không hiển thị tab đó**

---

## ✅ Cách Làm ĐÚNG

### 1️⃣ **Kiểm tra từng tab riêng biệt**

```jsx
const { checkFeature } = useAuth();

// Kiểm tra từng tab
const canViewPatients = checkFeature("patient-list");
const canViewExamForms = checkFeature("exam-form-list");
const canViewDiseases = checkFeature("disease-list");
```

### 2️⃣ **Chỉ render tab nếu user có ít nhất 1 quyền**

```jsx
<div className="tabs-navigation">
  {canViewPatients && (
    <button onClick={() => setActiveTab("patients")}>
      Bệnh nhân
    </button>
  )}
  {canViewExamForms && (
    <button onClick={() => setActiveTab("examForms")}>
      Phiếu khám bệnh
    </button>
  )}
</div>
```

### 3️⃣ **Dùng `PermissionGuard` để kiểm soát elements trong tab**

```jsx
case "patients":
  return (
    <>
      {/* Chỉ hiển thị nút "Thêm" nếu có quyền */}
      <PermissionGuard feature="patient-create" hide>
        <button onClick={handleOpenPatient}>
          + Thêm bệnh nhân
        </button>
      </PermissionGuard>
      
      {/* Luôn hiển thị danh sách, nhưng elements bên trong được kiểm soát */}
      <PatientsList />
    </>
  );
```

---

## ❌ Cách Làm SAI

### ❌ SAI #1: Wrap toàn bộ content bên ngoài `PermissionGuard`

```jsx
// ❌ KHÔNG NÊN LÀM CÁI NÀY
<PermissionGuard 
  feature={['user-list', 'user-edit', 'permission-assign']}
  mode="any"
>
  {/* Nếu user chỉ có 1 feature, tất cả tabs vẫn hiển thị */}
  {tabs.map(tab => <button>{tab.label}</button>)}
  {activeTab === 'users' && <UserManagementTab />}
  {activeTab === 'permissions' && <PermissionTab />}
</PermissionGuard>
```

**Vấn đề:** User sẽ thấy tất cả tabs, nhưng click vào tab "Phân quyền" sẽ không có gì hoặc bị ẩn.

### ❌ SAI #2: Chỉ check quyền ở tab buttons mà không kiểm soát nội dung

```jsx
// ❌ KHÔNG NÊN LÀM CÁI NÀY
{canViewPatients && (
  <button>Bệnh nhân</button> // Đúng
)}

// Nhưng nội dung bên trong không được kiểm soát
{activeTab === 'patients' && (
  <>
    <button>+ Sửa</button> {/* Vẫn hiển thị dù không có quyền */}
    <PatientsList />
  </>
)}
```

---

## 📝 Ví Dụ: Cấu Trúc Hoàn Chỉnh (Examine.jsx)

```jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PermissionGuard from "../../components/PermissionGuard";

const Examine = () => {
  const [activeTab, setActiveTab] = useState("patients");
  const { checkFeature } = useAuth();

  // ✅ BƯỚC 1: Kiểm tra từng tab
  const canViewPatients = checkFeature("patient-list");
  const canViewExamForms = checkFeature("exam-form-list");
  const canViewDiseases = checkFeature("disease-list");

  const renderTabContent = () => {
    switch (activeTab) {
      case "patients":
        return (
          <>
            {/* ✅ BƯỚC 2: Kiểm soát nút hành động */}
            <PermissionGuard feature="patient-create" hide>
              <button onClick={handleOpenPatient}>
                + Thêm bệnh nhân
              </button>
            </PermissionGuard>
            
            {/* ✅ BƯỚC 3: Render component, để component tự kiểm soát chi tiết */}
            <PatientsList />
          </>
        );
      case "examForms":
        return (
          <>
            <PermissionGuard feature="exam-form-create" hide>
              <button onClick={handleOpenExamine}>
                + Thêm phiếu khám
              </button>
            </PermissionGuard>
            <ExamFormsList />
          </>
        );
      // ... các cases khác
      default:
        return null;
    }
  };

  return (
    <div className="examine-container">
      <h2>Khám bệnh</h2>

      {/* ✅ BƯỚC 1: Chỉ render tab buttons nếu user có quyền */}
      <div className="tabs-navigation">
        {canViewPatients && (
          <button
            className={`tab-button ${activeTab === "patients" ? "active" : ""}`}
            onClick={() => setActiveTab("patients")}
          >
            Bệnh nhân
          </button>
        )}
        {canViewExamForms && (
          <button
            className={`tab-button ${activeTab === "examForms" ? "active" : ""}`}
            onClick={() => setActiveTab("examForms")}
          >
            Phiếu khám bệnh
          </button>
        )}
        {canViewDiseases && (
          <button
            className={`tab-button ${activeTab === "diseases" ? "active" : ""}`}
            onClick={() => setActiveTab("diseases")}
          >
            Bệnh
          </button>
        )}
      </div>

      {/* ✅ BƯỚC 3: Render nội dung tab */}
      <div className="tab-body">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Examine;
```

---

## 🔧 Cấu Trúc Tab với Quản Lý Tốt Hơn (Admin.jsx)

Khi bạn có **nhiều tabs với quản lý quyền phức tạp**, hãy dùng pattern này:

```jsx
const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const { checkFeature } = useAuth();

  // ✅ Định nghĩa tabs với features tương ứng
  const tabs = [
    { 
      id: "users", 
      label: "Quản lý người dùng", 
      icon: "👥",
      features: ["user-list", "user-create", "user-edit", "user-delete"],
    },
    { 
      id: "groups", 
      label: "Quản lý nhóm", 
      icon: "📦",
      features: ["user-group-manage"],
    },
    { 
      id: "permissions", 
      label: "Phân quyền", 
      icon: "🔐",
      features: ["permission-assign"],
    },
  ];

  // ✅ Helper function: Kiểm tra user có quyền xem tab không
  const canViewTab = (tabFeatures) => {
    return tabFeatures.some(feature => checkFeature(feature));
  };

  // ✅ Lọc tabs mà user có quyền
  const visibleTabs = tabs.filter(tab => canViewTab(tab.features));

  return (
    <div className="admin-container">
      {visibleTabs.length > 0 ? (
        <>
          {/* ✅ Chỉ render tabs mà user có quyền */}
          <div className="admin-tabs">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ✅ Render nội dung tab */}
          <div className="admin-content">
            {activeTab === "users" && <UserManagementTab />}
            {activeTab === "groups" && <GroupManagementTab />}
            {activeTab === "permissions" && <PermissionManagementTab />}
          </div>
        </>
      ) : (
        <div className="admin-unauthorized">
          <h2>⛔ Bạn không có quyền</h2>
          <p>Liên hệ admin để được cấp quyền.</p>
        </div>
      )}
    </div>
  );
};
```

---

## 🎨 Checklist Khi Tạo Page Với Multiple Tabs

- [ ] Định nghĩa mảng `tabs` với `features` tương ứng
- [ ] Kiểm tra quyền từng tab: `const canView[TabName] = checkFeature('...')`
- [ ] Chỉ render tab button nếu `canView[TabName] === true`
- [ ] Dùng `PermissionGuard` để kiểm soát **nút hành động** (create, edit, delete)
- [ ] Để component con **tự kiểm soát** các elements chi tiết của nó
- [ ] **Không bao quanh toàn bộ content** bằng `PermissionGuard`

---

## 📌 Tóm Tắt Chiến Lược

| Level | Cách Kiểm Soát | Ví Dụ |
|-------|---------------|-------|
| **Page/Route** | `ProtectedRoute` - check ít nhất 1 feature | `/admin` |
| **Tab** | `checkFeature()` rồi render conditionally | Patients, ExamForms, Diseases |
| **Component** | `PermissionGuard` hoặc `checkFeature()` | PatientsList, UserManagementTab |
| **Button** | `PermissionGuard` với `hide` prop | Edit, Delete, Create buttons |

---

## 🚀 Best Practice

1. **Always check at tab level first** - Không render tab buttons nếu user không có quyền
2. **Then protect actions inside** - Dùng `PermissionGuard` cho nút hành động
3. **Let components handle their own details** - Không cần check quyền ở component children
4. **Provide feedback** - Hiển thị message khi user không có quyền bất kỳ

```jsx
{visibleTabs.length === 0 && (
  <div className="no-permission">
    <p>Bạn không có quyền truy cập trang này.</p>
  </div>
)}
```
