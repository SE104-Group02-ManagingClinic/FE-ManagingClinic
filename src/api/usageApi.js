// src/api/usageApi.js

/**
 * Tạo cách dùng mới
 * @param {object} formData - Dữ liệu cách dùng
 * @returns {Promise<object>} Thông tin cách dùng vừa tạo
 */
export const createUsage = async (formData) => {
  if (!formData.TenCachDung || formData.TenCachDung.trim() === "") {
    throw new Error("Tên cách dùng không được để trống");
  }

  const payload = {
    TenCachDung: formData.TenCachDung,
  };

  const response = await fetch("/api/usage/createUsage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Tên cách dùng đã tồn tại");
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
 * Lấy danh sách tất cả cách dùng
 * @returns {Promise<Array>} Danh sách cách dùng
 */
export const getAllUsages = async () => {
  const response = await fetch("/api/usage/getUsage", {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      throw new Error(data.error || "Lỗi khi lấy danh sách cách dùng");
    } else {
      throw new Error(`API /api/usage/getUsage trả về lỗi ${response.status}`);
    }
  }

  return response.json();
};

/**
 * Cập nhật thông tin cách dùng
 * @param {string} maCachDung - Mã cách dùng
 * @param {object} formData - Dữ liệu cập nhật
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updateUsage = async (maCachDung, formData) => {
  if (!maCachDung || maCachDung.trim() === "") {
    throw new Error("Mã cách dùng không được để trống");
  }

  const payload = {
    TenCachDung: formData.TenCachDung,
  };

  const response = await fetch(`/api/usage/updateUsage/${maCachDung}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy cách dùng");
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
 * Xóa cách dùng
 * @param {string} maCachDung - Mã cách dùng cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteUsage = async (maCachDung) => {
  if (!maCachDung || maCachDung.trim() === "") {
    throw new Error("Mã cách dùng không được để trống");
  }

  const response = await fetch(`/api/usage/deleteUsage/${maCachDung}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  });

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy cách dùng");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};
