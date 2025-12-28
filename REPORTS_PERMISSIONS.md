# Permissions cho tính năng Báo cáo

## Các quyền đã được cấu hình

Tính năng báo cáo sử dụng 2 mã chức năng từ backend:

### 1. Báo cáo doanh thu (CN013)
- **Mã chức năng**: `CN013`
- **Feature code**: `report-revenue`
- **Chức năng được bảo vệ**:
  - ✅ Tab "Báo cáo doanh thu" (chỉ hiển thị khi có quyền)
  - ✅ Form tạo báo cáo doanh thu mới
  - ✅ Nút "Cập nhật" báo cáo
  - ✅ Nút "Xóa" báo cáo
  - 👁️ Nút "Xem" chi tiết - **KHÔNG** cần quyền (read-only)

### 2. Báo cáo sử dụng thuốc (CN014)
- **Mã chức năng**: `CN014`
- **Feature code**: `report-medicine-usage`
- **Chức năng được bảo vệ**:
  - ✅ Tab "Báo cáo sử dụng thuốc" (chỉ hiển thị khi có quyền)
  - ✅ Form tạo báo cáo sử dụng thuốc mới
  - ✅ Nút "Cập nhật" báo cáo
  - ✅ Nút "Xóa" báo cáo
  - 👁️ Nút "Xem" chi tiết - **KHÔNG** cần quyền (read-only)

## Cấu trúc phân quyền

### Route Level
Route `/statistics` yêu cầu ít nhất 1 trong 2 quyền:
- `CN013` - Báo cáo doanh thu
- `CN014` - Báo cáo sử dụng thuốc

**Định nghĩa trong**: `src/config/permissions.js`
```javascript
'/statistics': {
  maChucNang: ['CN013', 'CN014'],
  tenChucNang: 'Báo cáo thống kê',
  public: false,
  description: 'Dành cho Admin',
}
```

### Feature Level
**Định nghĩa trong**: `src/config/features.js`
```javascript
REPORT_REVENUE: {
  code: 'report-revenue',
  permissions: [PERMISSION_CODES.REPORT_REVENUE], // CN013
  description: 'Xem báo cáo doanh thu',
  mode: 'any',
},
REPORT_MEDICINE_USAGE: {
  code: 'report-medicine-usage',
  permissions: [PERMISSION_CODES.REPORT_MEDICINE_USAGE], // CN014
  description: 'Xem báo cáo sử dụng thuốc',
  mode: 'any',
}
```

## Hành vi khi không có quyền

### Trường hợp 1: User không có quyền CN013 và CN014
- ❌ Không thấy mục "Báo cáo" trong Sidebar
- ❌ Redirect về trang Home nếu truy cập trực tiếp `/statistics`

### Trường hợp 2: User chỉ có quyền CN013 (Báo cáo doanh thu)
- ✅ Thấy mục "Báo cáo" trong Sidebar
- ✅ Truy cập được `/statistics`
- ✅ Chỉ thấy tab "Báo cáo doanh thu"
- ❌ **KHÔNG** thấy tab "Báo cáo sử dụng thuốc"
- ✅ Tạo, xem, cập nhật, xóa báo cáo doanh thu

### Trường hợp 3: User chỉ có quyền CN014 (Báo cáo sử dụng thuốc)
- ✅ Thấy mục "Báo cáo" trong Sidebar
- ✅ Truy cập được `/statistics`
- ✅ Chỉ thấy tab "Báo cáo sử dụng thuốc"
- ❌ **KHÔNG** thấy tab "Báo cáo doanh thu"
- ✅ Tạo, xem, cập nhật, xóa báo cáo sử dụng thuốc

### Trường hợp 4: User có cả 2 quyền CN013 và CN014
- ✅ Thấy mục "Báo cáo" trong Sidebar
- ✅ Truy cập được `/statistics`
- ✅ Thấy cả 2 tab
- ✅ Quản lý được cả 2 loại báo cáo

## Ví dụ sử dụng PermissionGuard

### 1. Ẩn/hiện component (hide mode)
```jsx
<PermissionGuard feature="report-revenue" hide>
  <button onClick={createReport}>Tạo báo cáo</button>
</PermissionGuard>
```
- Nếu có quyền: Component được render
- Nếu không có quyền: Component **không** được render (hide)

### 2. Disable component
```jsx
<PermissionGuard feature="report-revenue">
  <button onClick={createReport}>Tạo báo cáo</button>
</PermissionGuard>
```
- Nếu có quyền: Component được render bình thường
- Nếu không có quyền: Component vẫn render nhưng bị **disable**

## Testing

### Kiểm tra phân quyền
1. **Admin** (có cả CN013 và CN014):
   - Vào `/statistics`
   - Thấy cả 2 tab
   - Tạo được cả 2 loại báo cáo
   - Cập nhật và xóa được

2. **User với quyền CN013**:
   - Vào `/statistics`
   - Chỉ thấy tab "Báo cáo doanh thu"
   - Không thấy tab "Báo cáo sử dụng thuốc"
   - Tạo được báo cáo doanh thu
   - Xem được báo cáo doanh thu

3. **User với quyền CN014**:
   - Vào `/statistics`
   - Chỉ thấy tab "Báo cáo sử dụng thuốc"
   - Không thấy tab "Báo cáo doanh thu"
   - Tạo được báo cáo sử dụng thuốc
   - Xem được báo cáo sử dụng thuốc

4. **User không có quyền**:
   - Không thấy "Báo cáo" trong Sidebar
   - Truy cập trực tiếp `/statistics` → Redirect về Home

## Files đã được cập nhật

1. ✅ `src/pages/Reports/Reports.jsx` - Ẩn/hiện tab theo quyền
2. ✅ `src/pages/Reports/MedicineUsageReportList.jsx` - Bảo vệ các chức năng
3. ✅ `src/pages/Reports/RevenueReportList.jsx` - Bảo vệ các chức năng
4. ✅ `src/config/features.js` - Đã có sẵn features
5. ✅ `src/config/permissions.js` - Đã có sẵn route permissions
