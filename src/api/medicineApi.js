// src/api/medicineApi.js

/**
 * Tạo thuốc mới
 * @param {object} formData - Dữ liệu thuốc
 * @returns {Promise<object>} Thông tin thuốc vừa tạo
 */
export const createMedicine = async (formData) => {
  if (!formData.TenThuoc || formData.TenThuoc.trim() === "") {
    throw new Error("Tên thuốc không được để trống");
  }

  const payload = {
    TenThuoc: formData.TenThuoc,
    CongDung: formData.CongDung || "",
    MaCachDung: formData.MaCachDung,
    MaDVT: formData.MaDVT,
    TacDungPhu: formData.TacDungPhu || "",
  };

  const response = await fetch("/api/medicine/createMedicine", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Tên thuốc đã tồn tại");
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
 * Lấy danh sách tất cả thuốc
 * @returns {Promise<Array>} Danh sách thuốc
 */
export const getAllMedicines = async () => {
  const response = await fetch("/api/medicine/getMedicine", {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      throw new Error(data.error || "Lỗi khi lấy danh sách thuốc");
    } else {
      throw new Error(`API /api/medicine/getMedicine trả về lỗi ${response.status}. Có thể endpoint không tồn tại hoặc server chưa chạy.`);
    }
  }

  return response.json();
};

/**
 * Cập nhật thông tin thuốc
 * @param {string} maThuoc - Mã thuốc
 * @param {object} formData - Dữ liệu cập nhật
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updateMedicine = async (maThuoc, formData) => {
  if (!maThuoc || maThuoc.trim() === "") {
    throw new Error("Mã thuốc không được để trống");
  }

  const payload = {
    TenThuoc: formData.TenThuoc,
    CongDung: formData.CongDung || "",
    MaCachDung: formData.MaCachDung,
    MaDVT: formData.MaDVT,
    TacDungPhu: formData.TacDungPhu || "",
  };

  const response = await fetch(`/api/medicine/updateMedicine/${maThuoc}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy thuốc");
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
 * Xóa thuốc
 * @param {string} maThuoc - Mã thuốc cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteMedicine = async (maThuoc) => {
  if (!maThuoc || maThuoc.trim() === "") {
    throw new Error("Mã thuốc không được để trống");
  }

  const response = await fetch(`/api/medicine/deleteMedicine/${maThuoc}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  });

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy thuốc");
  }

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Không thể xóa thuốc đã được sử dụng");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  return response.json();
};

/**
 * Tìm kiếm thuốc theo tên hoặc công dụng
 * @param {string} tenThuoc - Tên thuốc cần tìm kiếm
 * @param {string} congDung - Công dụng cần tìm kiếm
 * @returns {Promise<Array>} Danh sách thuốc phù hợp
 */
export const searchMedicines = async (tenThuoc = "", congDung = "") => {
  if (!tenThuoc.trim() && !congDung.trim()) {
    throw new Error("Vui lòng nhập tên thuốc hoặc công dụng để tìm kiếm");
  }

  const params = new URLSearchParams();
  if (tenThuoc.trim()) {
    params.append("TenThuoc", tenThuoc.trim());
  }
  if (congDung.trim()) {
    params.append("CongDung", congDung.trim());
  }

  const response = await fetch(`/api/medicine/searchMedicine?${params.toString()}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Dữ liệu tìm kiếm không hợp lệ");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống khi tìm kiếm thuốc");
  }

  return response.json();
};
