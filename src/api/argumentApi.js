// src/api/argumentApi.js

/**
 * Lấy thông tin tham số hệ thống từ bảng THAMSO
 * @returns {Promise<object>} Thông tin tham số {SoBenhNhanToiDa, TiLeTinhDonGiaBan, TienKham}
 */
export const getThamSo = async () => {
  const response = await fetch("/api/argument/getThamSo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi lấy thông tin tham số hệ thống");
  }

  return response.json();
};

/**
 * Tạo mới tham số hệ thống
 * @param {object} formData - Dữ liệu tham số {so_benh_nhan, ti_le, tien_kham}
 * @returns {Promise<object>} Thông tin tham số vừa tạo
 */
export const createThamSo = async (formData) => {
  if (formData.so_benh_nhan === undefined || formData.so_benh_nhan === null) {
    throw new Error("Số bệnh nhân tối đa không được để trống");
  }

  if (formData.ti_le === undefined || formData.ti_le === null) {
    throw new Error("Tỉ lệ tính đơn giá bán không được để trống");
  }

  if (formData.tien_kham === undefined || formData.tien_kham === null) {
    throw new Error("Tiền khám không được để trống");
  }

  const payload = {
    so_benh_nhan: formData.so_benh_nhan,
    ti_le: formData.ti_le,
    tien_kham: formData.tien_kham,
  };

  const response = await fetch("/api/argument/createThamSo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi tạo tham số hệ thống");
  }

  return response.json();
};

/**
 * Cập nhật số bệnh nhân tối đa
 * @param {number} soBenhNhanMoi - Số bệnh nhân tối đa mới
 * @returns {Promise<object>} Thông tin tham số sau khi cập nhật
 */
export const updateSoBenhNhanToiDa = async (soBenhNhanMoi) => {
  if (soBenhNhanMoi === undefined || soBenhNhanMoi === null) {
    throw new Error("Số bệnh nhân tối đa mới không được để trống");
  }

  if (soBenhNhanMoi <= 0) {
    throw new Error("Số bệnh nhân tối đa phải lớn hơn 0");
  }

  const payload = {
    so_benh_nhan_moi: soBenhNhanMoi,
  };

  const response = await fetch("/api/argument/updateSoBenhNhanToiDa", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi cập nhật số bệnh nhân tối đa");
  }

  return response.json();
};

/**
 * Cập nhật tỉ lệ tính đơn giá bán
 * @param {number} tiLeMoi - Tỉ lệ mới
 * @returns {Promise<object>} Thông tin tham số sau khi cập nhật
 */
export const updateTiLeTinhDonGiaBan = async (tiLeMoi) => {
  if (tiLeMoi === undefined || tiLeMoi === null) {
    throw new Error("Tỉ lệ mới không được để trống");
  }

  if (tiLeMoi <= 0) {
    throw new Error("Tỉ lệ tính đơn giá bán phải lớn hơn 0");
  }

  const payload = {
    ti_le_moi: tiLeMoi,
  };

  const response = await fetch("/api/argument/updateTiLeTinhDonGiaBan", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi cập nhật tỉ lệ tính đơn giá bán");
  }

  return response.json();
};

/**
 * Cập nhật tiền khám
 * @param {number} tienKham - Tiền khám mới
 * @returns {Promise<object>} Thông tin tham số sau khi cập nhật
 */
export const updateTienKham = async (tienKham) => {
  if (tienKham === undefined || tienKham === null) {
    throw new Error("Tiền khám mới không được để trống");
  }

  if (tienKham < 0) {
    throw new Error("Tiền khám không được âm");
  }

  const payload = {
    tien_kham: tienKham,
  };

  const response = await fetch("/api/argument/updateTienKham", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi cập nhật tiền khám");
  }

  return response.json();
};
