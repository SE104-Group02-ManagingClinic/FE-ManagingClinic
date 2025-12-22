// src/api/unitApi.js

/**
 * Tạo đơn vị tính mới
 * @param {object} formData - Dữ liệu đơn vị tính
 * @returns {Promise<object>} Thông tin đơn vị tính vừa tạo
 */
export const createUnit = async (formData) => {
  if (!formData.TenDVT || formData.TenDVT.trim() === "") {
    throw new Error("Tên đơn vị tính không được để trống");
  }

  const payload = {
    TenDVT: formData.TenDVT,
  };

  const response = await fetch("/api/unit/createUnit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Tên đơn vị tính đã tồn tại");
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
 * Lấy danh sách tất cả đơn vị tính
 * @returns {Promise<Array>} Danh sách đơn vị tính
 */
export const getAllUnits = async () => {
  const response = await fetch("/api/unit/getUnit", {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      throw new Error(data.error || "Lỗi khi lấy danh sách đơn vị tính");
    } else {
      throw new Error(`API /api/unit/getUnit trả về lỗi ${response.status}`);
    }
  }

  return response.json();
};

/**
 * Cập nhật thông tin đơn vị tính
 * @param {string} maDVT - Mã đơn vị tính
 * @param {object} formData - Dữ liệu cập nhật
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updateUnit = async (maDVT, formData) => {
  if (!maDVT || maDVT.trim() === "") {
    throw new Error("Mã đơn vị tính không được để trống");
  }

  const payload = {
    TenDVT: formData.TenDVT,
  };

  const response = await fetch(`/api/unit/updateUnit/${maDVT}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy đơn vị tính");
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
 * Xóa đơn vị tính
 * @param {string} maDVT - Mã đơn vị tính cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteUnit = async (maDVT) => {
  if (!maDVT || maDVT.trim() === "") {
    throw new Error("Mã đơn vị tính không được để trống");
  }

  const response = await fetch(`/api/unit/deleteUnit/${maDVT}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  });

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy đơn vị tính");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};
