## 🔧 Hướng Dẫn Sử Dụng Feature-Based Permission System

### Vấn Đề Gốc
Backend trả về `DanhSachChucNang` chứa danh sách components (`TenThanhPhanDuocLoad`), nhưng frontend không extract và sử dụng chúng.

### Giải Pháp Đã Implement

#### 1️⃣ **Cập nhật `userApi.js`** ✅
- Extract `TenThanhPhanDuocLoad` từ từng `DanhSachChucNang` item
- Parse JSON string thành array components
- Flatten tất cả thành một mảng `features` duy nhất
- Loại bỏ duplicates
- Return trong login response: `{ token, user, permissions, features }`

**Kết quả:** 38 component codes được extract từ backend data của bạn:
```
user-list, user-create, user-edit, user-delete,
user-group-manage, permission-assign,
patient-list, patient-create, patient-edit, patient-delete,
exam-form-list, exam-form-create, exam-form-edit, exam-form-delete,
medicine-list, medicine-create, medicine-edit, medicine-delete,
medicine-import, invoice-list, invoice-create, invoice-edit,
invoice-delete, report-revenue, report-medicine-usage,
disease-list, disease-create, disease-edit, disease-delete,
unit-list, unit-create, unit-edit, unit-delete,
usage-list, usage-create, usage-edit, usage-delete,
argument-manage
```

#### 2️⃣ **Cập nhật `AuthContext.js`** ✅
- Lưu `features` vào state
- Lưu vào localStorage
- Cung cấp methods: `checkFeature()`, `hasAnyFeature()`, `hasAllFeatures()`
- Log chi tiết cho debugging

#### 3️⃣ **Sử dụng trong Components**

**Option A: Sử dụng PermissionGuard (khuyến nghị)**
```jsx
import PermissionGuard from '../../components/PermissionGuard';
import usePermission from '../../hooks/usePermission';

// Ẩn hoàn toàn nếu không có quyền
<PermissionGuard feature="medicine-edit" hide>
  <button onClick={handleEdit}>Sửa</button>
</PermissionGuard>

// Hiển thị fallback nếu không có quyền
<PermissionGuard feature="medicine-delete" fallback={<span>Không có quyền</span>}>
  <button onClick={handleDelete}>Xóa</button>
</PermissionGuard>

// Kiểm tra nhiều features (mode='any' hoặc 'all')
<PermissionGuard feature={['medicine-create', 'medicine-edit']} mode="any">
  <div>Có quyền create hoặc edit</div>
</PermissionGuard>
```

**Option B: Sử dụng Hook (trong logic component)**
```jsx
const { hasFeature, hasAnyFeature, hasAllFeatures } = usePermission();

if (hasFeature('medicine-edit')) {
  // Render edit button
}

if (hasAnyFeature(['disease-create', 'disease-edit'])) {
  // Render management section
}
```

**Option C: Conditional Rendering**
```jsx
const { features } = useAuth();

const canEditMedicine = features.includes('medicine-edit');

// Sử dụng canEditMedicine để control rendering
```

### 📋 Danh Sách Component Codes Có Sẵn

Tương ứng với `CN001` - `CN018` từ backend:

| CN | Tên Chức Năng | Component Codes |
|---|---|---|
| CN001 | User Management | user-list, user-create, user-edit, user-delete |
| CN002 | User Group Management | user-group-manage |
| CN003 | Permission Management | permission-assign |
| CN004 | Patient Management | patient-list, patient-create, patient-edit, patient-delete |
| CN005 | Patient Search | patient-list |
| CN006 | Exam Form Create | exam-form-list, exam-form-create, exam-form-edit, exam-form-delete |
| CN007 | Exam Form View | exam-form-list |
| CN008 | Medicine Management | medicine-list, medicine-create, medicine-edit, medicine-delete |
| CN009 | Medicine Import | medicine-import |
| CN010 | Medicine Search | medicine-list |
| CN011 | Invoice Create | invoice-list, invoice-create |
| CN012 | Invoice Management | invoice-list, invoice-edit, invoice-delete |
| CN013 | Revenue Report | report-revenue |
| CN014 | Medicine Usage Report | report-medicine-usage |
| CN015 | Disease Management | disease-list, disease-create, disease-edit, disease-delete |
| CN016 | Unit Management | unit-list, unit-create, unit-edit, unit-delete |
| CN017 | Usage Management | usage-list, usage-create, usage-edit, usage-delete |
| CN018 | Argument Management | argument-manage |

### 🔗 Phân Biệt Permission vs Feature

**Permissions (MaChucNang):**
- Dùng để kiểm tra quyền truy cập menu/page
- Ví dụ: `CN001`, `CN008`, `CN015`
- Kiểm tra trong: `Sidebar`, `ProtectedRoute`

**Features (component codes):**
- Dùng để kiểm tra quyền truy cập từng component/nút bấm
- Ví dụ: `user-list`, `medicine-edit`, `disease-delete`
- Kiểm tra trong: `PermissionGuard`, individual components

### 🧪 Cách Test

1. **Trong Console Browser:**
```javascript
// Lấy auth context
const auth = window.__authContext; // Tùy cách bạn expose

// Kiểm tra features
auth.features; // Mảng tất cả component codes

// Kiểm tra một feature
auth.checkFeature('medicine-edit'); // true/false
```

2. **Trong Component:**
```jsx
const { features } = useAuth();
console.log('User features:', features);
```

3. **Debug Mode:**
`PermissionGuard` có `debug` prop mặc định = true in dev mode:
```jsx
<PermissionGuard feature="medicine-edit">
  <button>Sửa</button>
  {/* Sẽ hiển thị data-feature="medicine-edit" trong DOM */}
</PermissionGuard>
```

### ✅ Checklist - Làm để Components Load Đầy Đủ

- [x] ✅ Backend extract `TenThanhPhanDuocLoad` từ `DanhSachChucNang`
- [x] ✅ Frontend extract `features` từ login response
- [x] ✅ AuthContext store `features` vào state
- [ ] ⏳ **TODO**: Wrap các action buttons/features với `PermissionGuard`
  - Nút Edit, Delete, Create
  - Form sections
  - Report components
- [ ] ⏳ **TODO**: Test từng page để đảm bảo component loading đầy đủ
- [ ] ⏳ **TODO** (Optional): Thêm feature checks trong higher-level page guards

### 🚀 Tiếp Theo - Các Page Cần Update

1. **Examine Pages**
   - `ExamineForm.jsx` - Thêm checks cho create, edit, delete
   - `ExamFormDetail.jsx` - Check `exam-form-edit`, `exam-form-delete`

2. **Medicine Pages**
   - `Medicines.jsx` - Check `medicine-edit`, `medicine-delete`, `medicine-import`
   - `MedicinesList.jsx` - Individual action buttons

3. **Disease Pages**
   - Tất cả action buttons cần wrap với feature codes

4. **User Management Pages**
   - `User.jsx` - Check `user-create`, `user-edit`, `user-delete`

5. **Invoice Pages**
   - `Invoice.jsx` - Check `invoice-create`, `invoice-edit`, `invoice-delete`

### 📝 Ghi Chú

- Hệ thống hiện hỗ trợ cả **legacy permission-based** (MaChucNang) và **modern feature-based** (component codes)
- Sidebar dùng permission-based (quyền xem menu item)
- Individual components dùng feature-based (quyền sử dụng action)
- Có thể dùng 2 cách song song trong cùng một app

---

**Tạo lúc:** 2025-12-28
**Status:** Implementation Complete ✅ | Testing Needed ⏳
