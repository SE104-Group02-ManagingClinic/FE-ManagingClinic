# Hướng dẫn sử dụng API với Token

## 1. Cấu trúc Response từ Backend

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "TenDangNhap": "admin",
    "MaNhom": "ADMIN",
    "TenNhom": "Quản trị viên"
  },
  "permissions": [
    {"MaChucNang": "CN001", "TenChucNang": "Quản lý người dùng"},
    {"MaChucNang": "CN002", "TenChucNang": "Quản lý nhóm người dùng"},
    ...
  ]
}
```

## 2. LocalStorage Structure

Sau khi đăng nhập, frontend lưu 2 keys:

- `authData`: Toàn bộ response (user, token, permissions)
- `token`: Chỉ JWT token để dễ lấy khi gọi API

## 3. Sử dụng useAuth Hook

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, token, permissions, checkPermission, logout, getToken } = useAuth();

  // Lấy thông tin user
  console.log(user.TenDangNhap); // "admin"
  console.log(user.MaNhom);      // "ADMIN"

  // Kiểm tra quyền
  if (checkPermission('CN001')) {
    // User có quyền CN001
  }

  // Lấy token để gọi API
  const token = getToken();
}
```

## 4. Gọi API với Token

### Cách 1: Sử dụng apiClient (Khuyến nghị)

```javascript
import api from '../api/apiClient';

// GET request
const fetchData = async () => {
  const response = await api.get('/api/patient/getAllPatients');
  const data = await response.json();
  return data;
};

// POST request
const createPatient = async (patientData) => {
  const response = await api.post('/api/patient/createPatient', patientData);
  const data = await response.json();
  return data;
};

// PUT request
const updatePatient = async (id, patientData) => {
  const response = await api.put(`/api/patient/updatePatient/${id}`, patientData);
  return await response.json();
};

// DELETE request
const deletePatient = async (id) => {
  const response = await api.delete(`/api/patient/deletePatient/${id}`);
  return await response.json();
};
```

### Cách 2: Thủ công

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { getToken } = useAuth();

  const fetchData = async () => {
    const token = getToken();
    const response = await fetch('/api/endpoint', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  };
}
```

## 5. Xử lý khi Token hết hạn

API Client tự động:
- Phát hiện lỗi 401 (Unauthorized)
- Xóa token và authData khỏi localStorage
- Redirect về trang login

## 6. Mapping MaChucNang với Routes

Cập nhật `src/config/permissions.js`:

```javascript
export const ROUTE_PERMISSIONS = {
  '/home': {
    maChucNang: 'CN000',  // Trang chủ - public
    public: true,
  },
  '/examine': {
    maChucNang: 'CN001',  // Khám bệnh
    public: false,
  },
  '/medicines': {
    maChucNang: 'CN002',  // Quản lý thuốc
    public: false,
  },
  '/settings': {
    maChucNang: 'CN003',  // Cài đặt
    public: false,
  },
};
```

## 7. Ví dụ Hoàn chỉnh

### Component có phân quyền

```javascript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/apiClient';

function PatientManagement() {
  const { checkPermission, user } = useAuth();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/api/patient/getAllPatients');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleCreate = async (patientData) => {
    // Kiểm tra quyền tạo
    if (!checkPermission('CN001')) {
      alert('Bạn không có quyền tạo bệnh nhân');
      return;
    }

    try {
      const response = await api.post('/api/patient/createPatient', patientData);
      const data = await response.json();
      alert('Tạo thành công!');
      fetchPatients(); // Reload danh sách
    } catch (error) {
      console.error('Error creating patient:', error);
      alert('Tạo thất bại!');
    }
  };

  return (
    <div>
      <h1>Quản lý Bệnh nhân - {user.TenDangNhap}</h1>
      
      {checkPermission('CN001') && (
        <button onClick={() => handleCreate({...})}>Tạo mới</button>
      )}

      <ul>
        {patients.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 8. Cập nhật các API cũ

Tất cả các file trong `src/api/` nên được cập nhật để sử dụng `apiClient`:

```javascript
// src/api/patientApi.js
import api from './apiClient';

export const getAllPatients = async () => {
  const response = await api.get('/api/patient/getAllPatients');
  return response.json();
};

export const createPatient = async (patientData) => {
  const response = await api.post('/api/patient/createPatient', patientData);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Tạo bệnh nhân thất bại');
  }
  return response.json();
};
```

## 9. Logout

```javascript
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Xóa token và authData
    navigate('/'); // Về trang login
  };

  return <button onClick={handleLogout}>Đăng xuất</button>;
}
```
