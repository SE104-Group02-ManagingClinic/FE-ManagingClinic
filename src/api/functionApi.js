// src/api/functionApi.js

/**
 * Tạo mới chức năng
 * @param {object} formData - Dữ liệu chức năng {TenChucNang, TenThanhPhanDuocLoad}
 * @returns {Promise<object>} Thông tin chức năng vừa tạo
 */
export const createFunction = async (formData) => {
  if (!formData.TenChucNang || formData.TenChucNang.trim() === "") {
    throw new Error("Tên chức năng không được để trống");
  }

  if (!formData.TenThanhPhanDuocLoad || formData.TenThanhPhanDuocLoad.trim() === "") {
    throw new Error("Tên thành phần được load không được để trống");
  }

  const payload = {
    TenChucNang: formData.TenChucNang,
    TenThanhPhanDuocLoad: formData.TenThanhPhanDuocLoad,
  };

  const response = await fetch("/api/function/createFunction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Tên chức năng đã tồn tại");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};

/**
 * Lấy thông tin chức năng theo mã chức năng
 * @param {string} MaChucNang - Mã chức năng
 * @returns {Promise<object>} Thông tin chức năng
 */
export const getFunctionById = async (MaChucNang) => {
  if (!MaChucNang || MaChucNang.trim() === "") {
    throw new Error("Mã chức năng không được để trống");
  }

  const response = await fetch(`/api/function/getFunctionById/${MaChucNang}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Mã chức năng không hợp lệ");
  }

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy chức năng");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};

/**
 * Lấy thông tin toàn bộ các chức năng
 * @returns {Promise<Array>} Danh sách chức năng
 */
export const getAllFunctions = async () => {
  const response = await fetch("/api/function/getAllFunctions", {
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
 * Lấy danh sách các chức năng (id và tên)
 * @returns {Promise<Array>} Danh sách mã và tên chức năng
 */
export const getFunctionNameList = async () => {
  const response = await fetch("/api/function/getFunctionNameList", {
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
 * Cập nhật chức năng theo mã chức năng
 * @param {string} MaChucNang - Mã chức năng
 * @param {object} formData - Dữ liệu cập nhật {TenThanhPhanDuocLoad}
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updateFunction = async (MaChucNang, formData) => {
  if (!MaChucNang || MaChucNang.trim() === "") {
    throw new Error("Mã chức năng không được để trống");
  }

  if (!formData.TenThanhPhanDuocLoad || formData.TenThanhPhanDuocLoad.trim() === "") {
    throw new Error("Tên thành phần được load không được để trống");
  }

  const payload = {
    TenThanhPhanDuocLoad: formData.TenThanhPhanDuocLoad,
  };

  const response = await fetch(`/api/function/updateFunction/${MaChucNang}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Thông tin không thay đổi hoặc dữ liệu không hợp lệ");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};

/**
 * Xóa chức năng theo mã chức năng
 * @param {string} MaChucNang - Mã chức năng
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteFunction = async (MaChucNang) => {
  if (!MaChucNang || MaChucNang.trim() === "") {
    throw new Error("Mã chức năng không được để trống");
  }

  const response = await fetch(`/api/function/deleteFunction/${MaChucNang}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Xóa không thành công do chức năng được phân quyền trong group");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};
