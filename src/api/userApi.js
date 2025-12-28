// src/api/userApi.js

/**
 * Đăng nhập hệ thống
 * @param {string} TenDangNhap - Tên đăng nhập
 * @param {string} MatKhau - Mật khẩu
 * @returns {Promise<object>} Thông tin tài khoản (TenDangNhap, MaNhom, TenNhom)
 */
export const loginUser = async (TenDangNhap, MatKhau) => {
  if (!TenDangNhap || TenDangNhap.trim() === "") {
    throw new Error("Tên đăng nhập không được để trống");
  }

  if (!MatKhau || MatKhau.trim() === "") {
    throw new Error("Mật khẩu không được để trống");
  }

  const payload = {
    TenDangNhap,
    MatKhau,
  };

  const response = await fetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Tài khoản đăng nhập không đúng");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  // ✅ 200 OK
  const data = await response.json();
  
  // Debug: Log response để kiểm tra
  console.log('✅ Login API response:', data);
  
  // ⚠️ Xử lý 3 format từ backend:
  // Format 1: { token, user, permissions } - New
  // Format 2: { token, user, permissions, DanhSachChucNang } - New (với danh sách features)
  // Format 3: { TenDangNhap, MaNhom, TenNhom, DanhSachChucNang } - Legacy (backend cũ)
  
  // Extract permissions (MaChucNang)
  let permissions = data.permissions || [];
  
  // Extract features từ DanhSachChucNang (component codes)
  let features = [];
  if (data.DanhSachChucNang && Array.isArray(data.DanhSachChucNang)) {
    console.log('📦 Found DanhSachChucNang:', data.DanhSachChucNang);
    
    // Flatten tất cả TenThanhPhanDuocLoad thành một mảng features
    features = data.DanhSachChucNang.flatMap(chucNang => {
      try {
        // TenThanhPhanDuocLoad là JSON string: "[\"user-list\",\"user-create\"]"
        const components = JSON.parse(chucNang.TenThanhPhanDuocLoad || '[]');
        console.log(`  ✅ ${chucNang.MaChucNang}: ${JSON.stringify(components)}`);
        return components;
      } catch (e) {
        console.error(`  ❌ Error parsing TenThanhPhanDuocLoad for ${chucNang.MaChucNang}:`, e);
        return [];
      }
    });
    
    // Loại bỏ duplicates
    features = [...new Set(features)];
    console.log('✅ Extracted features:', features);
  }
  
  if (data.token && data.user) {
    // ✅ Format mới - Backend đã cập nhật
    console.log('✅ Using new format with token & user');
    return {
      token: data.token,
      user: data.user,
      permissions: permissions,
      features: features // Thêm features từ DanhSachChucNang
    };
  } else if (data.TenDangNhap && data.MaNhom) {
    // ⚠️ Format cũ - Backend chưa cập nhật hoàn toàn
    console.warn('⚠️ Backend chưa hoàn toàn cập nhật! Sử dụng format legacy');
    
    // Nếu chưa có permissions, dùng mặc định
    if (permissions.length === 0) {
      permissions = getDefaultPermissions(data.MaNhom);
    }
    
    // Chuyển đổi sang format mới
    const convertedData = {
      token: data.token || null,
      user: {
        TenDangNhap: data.TenDangNhap,
        MaNhom: data.MaNhom,
        TenNhom: data.TenNhom || 'User'
      },
      permissions: permissions,
      features: features
    };
    
    console.log('✅ Converted to new format:', convertedData);
    return convertedData;
  } else {
    console.error('❌ Response không hợp lệ:', data);
    throw new Error('Response từ server không đúng định dạng');
  }
};

/**
 * Lấy quyền mặc định theo nhóm (dùng khi backend chưa cập nhật)
 * @param {string} maNhom - Mã nhóm người dùng
 * @returns {Array} Danh sách permissions
 */
const getDefaultPermissions = (maNhom) => {
  const defaultPerms = {
    'GR001': [
      { MaChucNang: 'CN001', TenChucNang: 'Quản lý người dùng' },
      { MaChucNang: 'CN002', TenChucNang: 'Quản lý nhóm người dùng' },
      { MaChucNang: 'CN003', TenChucNang: 'Phân quyền' },
      { MaChucNang: 'CN004', TenChucNang: 'Quản lý bệnh nhân' },
      { MaChucNang: 'CN005', TenChucNang: 'Tra cứu bệnh nhân' },
      { MaChucNang: 'CN006', TenChucNang: 'Lập phiếu khám bệnh' },
      { MaChucNang: 'CN007', TenChucNang: 'Xem phiếu khám bệnh' },
      { MaChucNang: 'CN008', TenChucNang: 'Quản lý thuốc' },
      { MaChucNang: 'CN009', TenChucNang: 'Nhập thuốc' },
      { MaChucNang: 'CN010', TenChucNang: 'Tra cứu thuốc' },
      { MaChucNang: 'CN011', TenChucNang: 'Lập hóa đơn' },
      { MaChucNang: 'CN012', TenChucNang: 'Quản lý hóa đơn' },
      { MaChucNang: 'CN013', TenChucNang: 'Báo cáo doanh thu' },
      { MaChucNang: 'CN014', TenChucNang: 'Báo cáo sử dụng thuốc' },
      { MaChucNang: 'CN015', TenChucNang: 'Quản lý danh mục bệnh' },
      { MaChucNang: 'CN016', TenChucNang: 'Quản lý đơn vị tính' },
      { MaChucNang: 'CN017', TenChucNang: 'Quản lý cách dùng thuốc' },
      { MaChucNang: 'CN018', TenChucNang: 'Quản lý tham số' }
    ],
    'GR002': [
      { MaChucNang: 'CN004', TenChucNang: 'Quản lý bệnh nhân' },
      { MaChucNang: 'CN005', TenChucNang: 'Tra cứu bệnh nhân' },
      { MaChucNang: 'CN006', TenChucNang: 'Lập phiếu khám bệnh' },
      { MaChucNang: 'CN007', TenChucNang: 'Xem phiếu khám bệnh' }
    ],
    'GR003': [
      { MaChucNang: 'CN008', TenChucNang: 'Quản lý thuốc' },
      { MaChucNang: 'CN009', TenChucNang: 'Nhập thuốc' },
      { MaChucNang: 'CN010', TenChucNang: 'Tra cứu thuốc' }
    ],
    'ADMIN': [
      { MaChucNang: 'CN001', TenChucNang: 'Quản lý người dùng' },
      { MaChucNang: 'CN002', TenChucNang: 'Quản lý nhóm người dùng' },
      { MaChucNang: 'CN003', TenChucNang: 'Phân quyền' },
      { MaChucNang: 'CN004', TenChucNang: 'Quản lý bệnh nhân' },
      { MaChucNang: 'CN005', TenChucNang: 'Tra cứu bệnh nhân' },
      { MaChucNang: 'CN006', TenChucNang: 'Lập phiếu khám bệnh' },
      { MaChucNang: 'CN007', TenChucNang: 'Xem phiếu khám bệnh' },
      { MaChucNang: 'CN008', TenChucNang: 'Quản lý thuốc' },
      { MaChucNang: 'CN009', TenChucNang: 'Nhập thuốc' },
      { MaChucNang: 'CN010', TenChucNang: 'Tra cứu thuốc' },
      { MaChucNang: 'CN011', TenChucNang: 'Lập hóa đơn' },
      { MaChucNang: 'CN012', TenChucNang: 'Quản lý hóa đơn' },
      { MaChucNang: 'CN013', TenChucNang: 'Báo cáo doanh thu' },
      { MaChucNang: 'CN014', TenChucNang: 'Báo cáo sử dụng thuốc' },
      { MaChucNang: 'CN015', TenChucNang: 'Quản lý danh mục bệnh' },
      { MaChucNang: 'CN016', TenChucNang: 'Quản lý đơn vị tính' },
      { MaChucNang: 'CN017', TenChucNang: 'Quản lý cách dùng thuốc' },
      { MaChucNang: 'CN018', TenChucNang: 'Quản lý tham số' }
    ]
  };
  
  return defaultPerms[maNhom] || defaultPerms['GR003']; // Default: quyền thấp nhất
};

/**
 * Tạo tài khoản người dùng
 * @param {object} formData - Dữ liệu tài khoản {TenDangNhap, MatKhau, MaNhom}
 * @returns {Promise<object>} Kết quả tạo tài khoản
 */
export const createAccount = async (formData) => {
  if (!formData.TenDangNhap || formData.TenDangNhap.trim() === "") {
    throw new Error("Tên đăng nhập không được để trống");
  }

  if (!formData.MatKhau || formData.MatKhau.trim() === "") {
    throw new Error("Mật khẩu không được để trống");
  }

  if (!formData.MaNhom || formData.MaNhom.trim() === "") {
    throw new Error("Nhóm người dùng không được để trống");
  }

  const payload = {
    TenDangNhap: formData.TenDangNhap,
    MatKhau: formData.MatKhau,
    MaNhom: formData.MaNhom,
  };

  const response = await fetch("/api/user/createAccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Tên đăng nhập đã tồn tại");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  // ✅ 201 Created
  return response.json();
};

/**
 * Cập nhật mật khẩu người dùng
 * @param {string} TenDangNhap - Tên đăng nhập
 * @param {string} MatKhauMoi - Mật khẩu mới
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updatePassword = async (TenDangNhap, MatKhauMoi) => {
  if (!TenDangNhap || TenDangNhap.trim() === "") {
    throw new Error("Tên đăng nhập không được để trống");
  }

  if (!MatKhauMoi || MatKhauMoi.trim() === "") {
    throw new Error("Mật khẩu mới không được để trống");
  }

  const payload = {
    MatKhauMoi,
  };

  const response = await fetch(`/api/user/updatePassword/${TenDangNhap}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Tài khoản không tồn tại");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  // ✅ 200 OK
  return response.json();
};

/**
 * Cập nhật nhóm người dùng
 * @param {string} TenDangNhap - Tên đăng nhập
 * @param {string} MaNhomMoi - Mã nhóm mới
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updateGroup = async (TenDangNhap, MaNhomMoi) => {
  if (!TenDangNhap || TenDangNhap.trim() === "") {
    throw new Error("Tên đăng nhập không được để trống");
  }

  if (!MaNhomMoi || MaNhomMoi.trim() === "") {
    throw new Error("Mã nhóm mới không được để trống");
  }

  const payload = {
    MaNhomMoi,
  };

  const response = await fetch(`/api/user/updateGroup/${TenDangNhap}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Tài khoản không tồn tại");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  // ✅ 200 OK
  return response.json();
};

/**
 * Xóa người dùng
 * @param {string} TenDangNhap - Tên đăng nhập
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteUser = async (TenDangNhap) => {
  if (!TenDangNhap || TenDangNhap.trim() === "") {
    throw new Error("Tên đăng nhập không được để trống");
  }

  const response = await fetch(`/api/user/deleteUser/${TenDangNhap}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Xóa không thành công");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  // ✅ 200 OK
  return response.json();
};
