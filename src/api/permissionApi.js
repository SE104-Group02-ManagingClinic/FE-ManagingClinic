// src/api/permissionApi.js

/**
 * Tạo mới phân quyền cho nhóm người dùng
 * @param {string} MaNhom - Mã nhóm người dùng
 * @param {Array<string>} DSMaChucNang - Danh sách mã chức năng
 * @returns {Promise<object>} Kết quả tạo phân quyền
 */
export const createPermission = async (MaNhom, DSMaChucNang) => {
  if (!MaNhom || MaNhom.trim() === "") {
    throw new Error("Mã nhóm không được để trống");
  }

  if (!DSMaChucNang || !Array.isArray(DSMaChucNang) || DSMaChucNang.length === 0) {
    throw new Error("Danh sách chức năng không được để trống");
  }

  const payload = {
    MaNhom,
    DSMaChucNang,
  };

  const response = await fetch("/api/permission/createPermission", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Nhóm đã có phân quyền hoặc dữ liệu không hợp lệ");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};

/**
 * Xóa phân quyền của nhóm người dùng
 * @param {string} MaNhom - Mã nhóm người dùng
 * @param {Array<string>} DSMaChucNang - Danh sách mã chức năng cần xóa
 * @returns {Promise<object>} Kết quả xóa phân quyền
 */
export const deletePermission = async (MaNhom, DSMaChucNang) => {
  if (!MaNhom || MaNhom.trim() === "") {
    throw new Error("Mã nhóm không được để trống");
  }

  if (!DSMaChucNang || !Array.isArray(DSMaChucNang) || DSMaChucNang.length === 0) {
    throw new Error("Danh sách chức năng không được để trống");
  }

  const payload = {
    DSMaChucNang,
  };

  const response = await fetch(`/api/permission/deletePermission/${MaNhom}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Nhóm chưa được tạo phân quyền hoặc dữ liệu không hợp lệ");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};

/**
 * Lấy danh sách các chức năng của một nhóm người dùng
 * @param {string} MaNhom - Mã nhóm người dùng
 * @returns {Promise<Array>} Danh sách chức năng (MaChucNang, TenChucNang)
 */
export const getFunctionsOfGroupUser = async (MaNhom) => {
  if (!MaNhom || MaNhom.trim() === "") {
    throw new Error("Mã nhóm không được để trống");
  }

  const response = await fetch(`/api/permission/getFunctionsOfGroupUser/${MaNhom}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};

/**
 * Cập nhật danh sách phân quyền cho nhóm người dùng
 * @param {string} MaNhom - Mã nhóm người dùng
 * @param {Array<string>} DSMaChucNang - Danh sách mã chức năng mới
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updatePermission = async (MaNhom, DSMaChucNang) => {
  if (!MaNhom || MaNhom.trim() === "") {
    throw new Error("Mã nhóm không được để trống");
  }

  if (!DSMaChucNang || !Array.isArray(DSMaChucNang) || DSMaChucNang.length === 0) {
    throw new Error("Danh sách chức năng không được để trống");
  }

  const payload = {
    DSMaChucNang,
  };

  const response = await fetch(`/api/permission/updatePermission/${MaNhom}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Cập nhật không thành công");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};
