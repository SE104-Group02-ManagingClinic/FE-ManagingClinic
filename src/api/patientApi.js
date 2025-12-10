// src/api/patientApi.js

export const createPatient = async (formData) => {
  // Map frontend → backend
  const payload = {
    HoTen: formData.HoTen,
    CCCD: formData.CCCD,
    GioiTinh: formData.GioiTinh,
    NamSinh: formData.NamSinh,
    DiaChi: formData.DiaChi,
    SDT: formData.SDT,
  };

  const response = await fetch("/api/patient/createPatient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Create patient failed");
  }

  return response.json();
};

// src/api/patientApi.js

/**
 * Tra cứu bệnh nhân theo CCCD
 * @param {string} cccd
 * @returns {Promise<Array>} danh sách bệnh nhân
 */
export const searchPatientByCCCD = async (cccd) => {
  if (!cccd || cccd.trim() === "") {
    throw new Error("CCCD không được để trống");
  }

  const response = await fetch(`/api/patient/searchPatient/${cccd}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "CCCD không hợp lệ");
  }

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy bệnh nhân");
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
 * Cập nhật thông tin bệnh nhân
 * @param {string} MaBN - Mã bệnh nhân cần cập nhật
 * @param {object} formData - Dữ liệu cập nhật
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updatePatient = async (MaBN, formData) => {
  if (!MaBN || MaBN.trim() === "") {
    throw new Error("Mã bệnh nhân không được để trống");
  }

  // Map frontend → backend
  const payload = {
    HoTen: formData.HoTen,
    CCCD: formData.CCCD,
    GioiTinh: formData.GioiTinh,
    NamSinh: formData.NamSinh,
    DiaChi: formData.DiaChi,
    SDT: formData.SDT,
  };

  const response = await fetch(`/api/patient/updatePatient/${MaBN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Thông tin không thay đổi hoặc dữ liệu không hợp lệ");
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
 * Xóa bệnh nhân
 * @param {string} MaBN - Mã bệnh nhân cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deletePatient = async (MaBN) => {
  if (!MaBN || MaBN.trim() === "") {
    throw new Error("Mã bệnh nhân không được để trống");
  }

  const response = await fetch(`/api/patient/deletePatient/${MaBN}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Xóa không thành công - bệnh nhân không tồn tại hoặc dữ liệu không hợp lệ");
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
 * Lấy danh sách tất cả bệnh nhân
 * @returns {Promise<Array>} Danh sách tất cả bệnh nhân
 */
export const getAllPatients = async () => {
  const response = await fetch("/api/patient/getAllPatients", {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  // ✅ 200 OK
  return response.json();
};