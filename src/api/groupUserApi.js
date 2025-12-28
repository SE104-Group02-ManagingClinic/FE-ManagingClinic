// src/api/groupUserApi.js

/**
 * Tạo nhóm người dùng mới
 * @param {object} formData - Dữ liệu nhóm người dùng
 * @returns {Promise<object>} Thông tin nhóm vừa tạo
 */
export const createGroupUser = async (formData) => {
  if (!formData.TenNhom || formData.TenNhom.trim() === "") {
    throw new Error("Tên nhóm không được để trống");
  }

  const payload = {
    TenNhom: formData.TenNhom,
  };

  const response = await fetch("/api/groupUser/createGroupUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Tên nhóm người dùng đã tồn tại");
  }

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Dữ liệu không hợp lệ");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};

/**
 * Lấy danh sách tất cả nhóm người dùng
 * @returns {Promise<Array>} Danh sách nhóm người dùng
 */
export const getAllGroupUsers = async () => {
  const response = await fetch("/api/groupUser/getAllGroupUsers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống khi lấy danh sách nhóm người dùng");
  }

  return response.json();
};

/**
 * Lấy thông tin nhóm người dùng theo mã
 * @param {string} MaNhom - Mã nhóm người dùng
 * @returns {Promise<object>} Thông tin nhóm người dùng
 */
export const getGroupUserById = async (MaNhom) => {
  if (!MaNhom || MaNhom.trim() === "") {
    throw new Error("Mã nhóm không được để trống");
  }

  const response = await fetch(`/api/groupUser/getGroupUserById/${MaNhom}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Mã nhóm không hợp lệ");
  }

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy nhóm người dùng");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};

/**
 * Xóa nhóm người dùng
 * @param {string} MaNhom - Mã nhóm người dùng
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteGroupUser = async (MaNhom) => {
  if (!MaNhom || MaNhom.trim() === "") {
    throw new Error("Mã nhóm không được để trống");
  }

  const response = await fetch(`/api/groupUser/deleteGroupUser/${MaNhom}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Xóa không thành công");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};
