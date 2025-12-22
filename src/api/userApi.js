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
      "Content-Type": "application/json",
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
  return response.json();
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
      "Content-Type": "application/json",
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
      "Content-Type": "application/json",
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
      "Content-Type": "application/json",
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
