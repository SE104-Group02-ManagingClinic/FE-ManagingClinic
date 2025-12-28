// src/api/patientApi.js

const readResponseData = async (response) => {
  const contentType = response.headers?.get?.("content-type") || "";
  const text = await response.text();

  if (!text) return {};

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      // Backend may claim json but send plain text
      return { message: text };
    }
  }

  return { message: text };
};

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
      "Content-Type": "application/json; charset=utf-8",
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
      "Cache-Control": "no-cache",
    },
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "CCCD không hợp lệ");
  }

  // ✅ 404: Không tìm thấy bệnh nhân - trả về null thay vì throw error
  if (response.status === 404 || response.status === 500) {
    return null;
  }

  if (response.status === 304) {
    throw new Error("Dữ liệu không thay đổi. Vui lòng thử lại.");
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
export const updatePatient = async (MaBN, formData, signal = null) => {
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

  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  };

  if (signal) {
    fetchOptions.signal = signal;
  }

  const response = await fetch(`/api/patient/updatePatient/${MaBN}`, fetchOptions);

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 400) {
    const data = await readResponseData(response);
    throw new Error(data.message || "Thông tin không thay đổi hoặc dữ liệu không hợp lệ");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await readResponseData(response);
    throw new Error(data.error || "Lỗi hệ thống");
  }

  // ✅ 200 OK
  // Some backends return empty body / non-JSON on 200; don't parse body to avoid hanging.
  return { success: true };
};

/**
 * Xóa bệnh nhân
 * @param {string} MaBN - Mã bệnh nhân cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deletePatient = async (MaBN, signal = null) => {
  if (!MaBN || MaBN.trim() === "") {
    throw new Error("Mã bệnh nhân không được để trống");
  }

  const fetchOptions = {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  };

  if (signal) {
    fetchOptions.signal = signal;
  }

  const response = await fetch(`/api/patient/deletePatient/${MaBN}`, fetchOptions);

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 400) {
    const data = await readResponseData(response);
    throw new Error(data.message || "Xóa không thành công - bệnh nhân không tồn tại hoặc dữ liệu không hợp lệ");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await readResponseData(response);
    throw new Error(data.error || "Lỗi hệ thống");
  }

  // ✅ 200 OK
  // Some backends return empty body / non-JSON on 200; don't parse body to avoid hanging.
  return { success: true };
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
