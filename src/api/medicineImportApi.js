// src/api/medicineImportApi.js

/**
 * Tạo phiếu nhập thuốc mới
 * @param {object} formData - Dữ liệu phiếu nhập thuốc
 * @returns {Promise<object>} Thông tin phiếu nhập thuốc vừa tạo
 */
export const createMedicineImport = async (formData) => {
  if (!formData.MaThuoc || formData.MaThuoc.trim() === "") {
    throw new Error("Mã thuốc không được để trống");
  }

  if (!formData.SoLuongNhap || formData.SoLuongNhap <= 0) {
    throw new Error("Số lượng nhập phải lớn hơn 0");
  }

  if (!formData.GiaNhap || formData.GiaNhap <= 0) {
    throw new Error("Giá nhập phải lớn hơn 0");
  }

  if (!formData.HanSuDung || formData.HanSuDung.trim() === "") {
    throw new Error("Hạn sử dụng không được để trống");
  }

  const payload = {
    MaThuoc: formData.MaThuoc,
    GiaNhap: formData.GiaNhap,
    NgayNhap: formData.NgayNhap || new Date().toISOString().split('T')[0],
    SoLuongNhap: formData.SoLuongNhap,
    HanSuDung: formData.HanSuDung,
  };

  const response = await fetch("/api/medicineImport/createMedicineImport", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Dữ liệu không hợp lệ hoặc thuốc không tồn tại");
  }

  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Chưa cấu hình tỷ lệ tính đơn giá bán");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};

/**
 * Lấy danh sách tất cả phiếu nhập thuốc
 * @returns {Promise<Array>} Danh sách phiếu nhập thuốc
 */
export const getAllMedicineImports = async () => {
  const response = await fetch("/api/medicineImport/getMedicineImport", {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      throw new Error(data.error || "Lỗi khi lấy danh sách phiếu nhập thuốc");
    } else {
      throw new Error(`API /api/medicineImport/getMedicineImport trả về lỗi ${response.status}. Có thể endpoint không tồn tại hoặc server chưa chạy.`);
    }
  }

  return response.json();
};

/**
 * Cập nhật thông tin phiếu nhập thuốc
 * @param {string} maPNT - Mã phiếu nhập thuốc
 * @param {object} formData - Dữ liệu cập nhật
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updateMedicineImport = async (maPNT, formData) => {
  if (!maPNT || maPNT.trim() === "") {
    throw new Error("Mã phiếu nhập thuốc không được để trống");
  }

  const payload = {
    GiaNhap: formData.GiaNhap,
    NgayNhap: formData.NgayNhap,
    SoLuongNhap: formData.SoLuongNhap,
    HanSuDung: formData.HanSuDung,
  };

  const response = await fetch(`/api/medicineImport/updateMedicineImport/${maPNT}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy phiếu nhập thuốc");
  }

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Dữ liệu không hợp lệ hoặc tồn kho âm");
  }

  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Chưa cấu hình tỷ lệ tính đơn giá bán");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};

/**
 * Xóa phiếu nhập thuốc
 * @param {string} maPNT - Mã phiếu nhập thuốc cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteMedicineImport = async (maPNT) => {
  if (!maPNT || maPNT.trim() === "") {
    throw new Error("Mã phiếu nhập thuốc không được để trống");
  }

  const response = await fetch(`/api/medicineImport/deleteMedicineImport/${maPNT}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  });

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy phiếu nhập thuốc");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};
