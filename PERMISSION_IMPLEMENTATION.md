# Hệ thống Phân Quyền Frontend - Hướng dẫn Sử dụng

## 📋 Tổng quan

Hệ thống phân quyền dùng **feature-based** approach: Backend trả về danh sách feature codes mà user được phép, Frontend sử dụng `PermissionGuard` component để hiển thị/ẩn UI elements.

---

## 🔧 Cách hoạt động

### 1. Backend Response Format

Backend cần trả về danh sách feature codes trong response login:

```json
{
  "TenDangNhap": "tien.nguyen",
  "MaNhom": "GR001",
  "TenNhom": "Nhóm Quản trị",
  "features": [
    "disease-list",
    "disease-edit", 
    "disease-delete",
    "medicine-list",
    "medicine-import",
    "unit-list",
    "usage-list",
    "patient-list",
    "exam-form-list"
  ]
}
```

### 2. Frontend Usage

#### Sử dụng PermissionGuard Component

```jsx
import PermissionGuard from "../../components/PermissionGuard";

// Ẩn toàn bộ component khi không có quyền
<PermissionGuard feature="disease-list">
  <DiseaseTable />
</PermissionGuard>

// Ẩn button khi không có quyền
<PermissionGuard feature="disease-edit" hide>
  <button onClick={handleEdit}>Sửa</button>
</PermissionGuard>

// Hiển thị thông báo fallback khi không có quyền
<PermissionGuard 
  feature="medicine-list"
  fallback={<div>Bạn không có quyền xem danh sách thuốc</div>}
>
  <MedicineList />
</PermissionGuard>
```

#### Sử dụng Hook usePermission

```jsx
import { usePermission } from "../../hooks/usePermission";

const MyComponent = () => {
  const { hasFeature, hasAnyFeature } = usePermission();
  
  // Kiểm tra một feature
  if (hasFeature("medicine-import")) {
    // Cho phép nhập thuốc
  }
  
  // Kiểm tra có ít nhất 1 feature
  if (hasAnyFeature(["user-edit", "user-create"])) {
    // Cho phép thao tác với user
  }
};
```

#### Sử dụng AuthContext

```jsx
import { useAuth } from "../../contexts/AuthContext";

const MyComponent = () => {
  const { checkFeature, hasAnyFeature, features } = useAuth();
  
  // Direct check
  const canEdit = checkFeature("disease-edit");
  
  // Check multiple
  const canManageUsers = hasAnyFeature(["user-list", "user-create"]);
  
  // Access raw feature list
  console.log("User features:", features);
};
```

---

## 📝 Feature Codes Reference

### Quản lý Bệnh
- `disease-list` - Xem danh sách bệnh
- `disease-create` - Thêm bệnh mới
- `disease-edit` - Sửa bệnh
- `disease-delete` - Xóa bệnh

### Quản lý Thuốc
- `medicine-list` - Xem danh sách thuốc
- `medicine-create` - Thêm thuốc mới
- `medicine-edit` - Sửa thuốc
- `medicine-delete` - Xóa thuốc
- `medicine-import` - Nhập thuốc

### Quản lý Đơn vị Tính
- `unit-list` - Xem danh sách đơn vị tính
- `unit-create` - Thêm đơn vị tính
- `unit-edit` - Sửa đơn vị tính
- `unit-delete` - Xóa đơn vị tính

### Quản lý Cách Dùng
- `usage-list` - Xem danh sách cách dùng
- `usage-create` - Thêm cách dùng
- `usage-edit` - Sửa cách dùng
- `usage-delete` - Xóa cách dùng

### Quản lý Bệnh Nhân
- `patient-list` - Xem danh sách bệnh nhân
- `patient-create` - Thêm bệnh nhân
- `patient-edit` - Sửa thông tin bệnh nhân
- `patient-delete` - Xóa bệnh nhân

### Quản lý Phiếu Khám
- `exam-form-list` - Xem danh sách phiếu khám
- `exam-form-create` - Lập phiếu khám
- `exam-form-edit` - Sửa phiếu khám
- `exam-form-delete` - Xóa phiếu khám

### Quản lý Hóa Đơn
- `invoice-list` - Xem danh sách hóa đơn
- `invoice-create` - Lập hóa đơn
- `invoice-edit` - Sửa hóa đơn
- `invoice-delete` - Xóa hóa đơn

### Báo Cáo
- `report-revenue` - Xem báo cáo doanh thu
- `report-medicine-usage` - Xem báo cáo sử dụng thuốc

### Quản lý Hệ Thống
- `user-list` - Xem danh sách user
- `user-create` - Thêm user
- `user-edit` - Sửa user
- `user-delete` - Xóa user
- `user-group-manage` - Quản lý nhóm user
- `permission-assign` - Phân quyền
- `argument-manage` - Quản lý tham số

---

## 🔄 Props của PermissionGuard Component

| Prop | Type | Mặc định | Mô tả |
|------|------|---------|--------|
| `feature` | string \| Array<string> | - | Feature code(s) cần kiểm tra |
| `children` | ReactNode | - | Nội dung hiển thị khi có quyền |
| `fallback` | ReactNode | null | Nội dung hiển thị khi không có quyền |
| `hide` | boolean | false | Ẩn hoàn toàn thay vì hiển thị fallback |
| `mode` | 'any' \| 'all' | 'any' | 'any': có 1 trong các feature, 'all': phải có tất cả |
| `debug` | boolean | dev mode | Hiển thị data-feature attribute |

---

## ✅ Component Đã Update

1. ✅ [Disease.jsx](src/pages/Examine/Disease.jsx) - Danh sách bệnh
2. ✅ [Medicines.jsx](src/pages/Medicines/Medicines.jsx) - Trang quản lý thuốc
3. ✅ [MedicinesList.jsx](src/pages/Medicines/MedicinesList.jsx) - Danh sách thuốc
4. ✅ [Unit.jsx](src/pages/Medicines/Unit.jsx) - Danh sách đơn vị tính
5. ✅ [Usage.jsx](src/pages/Medicines/Usage.jsx) - Danh sách cách dùng
6. ✅ [PatientsList.jsx](src/pages/Examine/PatientsList.jsx) - Danh sách bệnh nhân
7. ✅ [ExamFormsList.jsx](src/pages/Examine/ExamFormsList.jsx) - Danh sách phiếu khám

---

## 📂 File Cấu Trúc

```
src/
├── contexts/
│   └── AuthContext.js          # ✅ State features + checkFeature()
├── components/
│   └── PermissionGuard.jsx     # ✅ Main component
├── hooks/
│   └── usePermission.js        # ✅ Hook với hasFeature(), hasAnyFeature()
└── pages/
    ├── Medicines/
    │   ├── Medicines.jsx       # ✅ Updated
    │   ├── MedicinesList.jsx   # ✅ Updated
    │   ├── Unit.jsx            # ✅ Updated
    │   └── Usage.jsx           # ✅ Updated
    └── Examine/
        ├── Disease.jsx         # ✅ Updated
        ├── PatientsList.jsx    # ✅ Updated
        └── ExamFormsList.jsx   # ✅ Updated
```

---

## 🎯 Best Practices

### 1. Luôn sử dụng feature code string

```jsx
// ❌ KHÔNG
<PermissionGuard feature={FEATURES.DISEASE_LIST}>

// ✅ ĐÚ
<PermissionGuard feature="disease-list">
```

### 2. Wrap entire page component

```jsx
// Wrap toàn bộ page khi cần check permission chính
<PermissionGuard feature="disease-list">
  <div className="tab-content">
    {/* Page content */}
  </div>
</PermissionGuard>
```

### 3. Ẩn buttons/actions riêng lẻ

```jsx
// Chỉ ẩn button, không ẩn toàn trang
<PermissionGuard feature="disease-edit" hide>
  <button onClick={handleEdit}>Sửa</button>
</PermissionGuard>
```

### 4. Kiểm tra logic trong component

```jsx
const { hasFeature } = usePermission();

if (!hasFeature("medicine-import")) {
  return <div>No permission</div>;
}
```

---

## 🚀 Future Enhancements

- [ ] Thêm `data-feature-name` attribute cho debugging
- [ ] Component-level permission analytics
- [ ] Role-based CSS classes cho styling
- [ ] Permission-based route redirects
- [ ] Audit log cho permission checks

---

## 📞 Support

Nếu có câu hỏi, vui lòng kiểm tra:
- `src/contexts/AuthContext.js` - State management
- `src/components/PermissionGuard.jsx` - Component implementation
- `src/hooks/usePermission.js` - Hook utilities
