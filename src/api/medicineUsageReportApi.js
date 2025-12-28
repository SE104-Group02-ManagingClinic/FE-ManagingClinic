// src/api/medicineUsageReportApi.js

/**
 * API quản lý báo cáo sử dụng thuốc
 */

/**
 * Tạo báo cáo sử dụng thuốc theo tháng/năm
 * @param {number} thang - Tháng cần tạo báo cáo (1-12)
 * @param {number} nam - Năm cần tạo báo cáo
 * @returns {Promise<object>} Thông tin báo cáo vừa tạo
 */
export const createMedicineUsageReport = async (thang, nam) => {
  if (!thang || thang < 1 || thang > 12) {
    throw new Error("Tháng không hợp lệ (1-12)");
  }
  if (!nam || nam < 2000) {
    throw new Error("Năm không hợp lệ");
  }

  const payload = {
    Thang: thang,
    Nam: nam,
  };

  const response = await fetch("/api/medicineUsageReport/createReport", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Không được lập báo cáo cho tháng/năm trong tương lai");
  }

  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Báo cáo tháng này đã tồn tại");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống khi tạo báo cáo");
  }

  // 201 Created
  return response.json();
};

/**
 * Lấy danh sách tất cả báo cáo sử dụng thuốc
 * @returns {Promise<Array>} Danh sách báo cáo
 */
export const getMedicineUsageReports = async () => {
  const response = await fetch("/api/medicineUsageReport/getReports", {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi lấy danh sách báo cáo sử dụng thuốc");
  }

  return response.json();
};

/**
 * Lấy chi tiết báo cáo sử dụng thuốc theo mã
 * @param {string} maBCSDT - Mã báo cáo sử dụng thuốc
 * @returns {Promise<object>} Chi tiết báo cáo bao gồm danh sách thuốc đã sử dụng
 */
export const getMedicineUsageReportDetail = async (maBCSDT) => {
  if (!maBCSDT || maBCSDT.trim() === "") {
    throw new Error("Mã báo cáo không được để trống");
  }

  const response = await fetch(`/api/medicineUsageReport/getReportDetail/${encodeURIComponent(maBCSDT)}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy báo cáo");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi lấy chi tiết báo cáo");
  }

  return response.json();
};

/**
 * Tìm kiếm báo cáo sử dụng thuốc theo tháng/năm
 * @param {number} thang - Tháng cần tìm (optional)
 * @param {number} nam - Năm cần tìm (optional)
 * @returns {Promise<Array>} Danh sách báo cáo phù hợp
 */
export const searchMedicineUsageReports = async (thang, nam) => {
  const params = new URLSearchParams();
  if (thang) params.append("Thang", thang);
  if (nam) params.append("Nam", nam);

  const queryString = params.toString();
  const url = `/api/medicineUsageReport/searchReports${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi tìm kiếm báo cáo");
  }

  return response.json();
};

/**
 * Cập nhật (tái tổng hợp) báo cáo sử dụng thuốc
 * @param {string} maBCSDT - Mã báo cáo cần cập nhật
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updateMedicineUsageReport = async (maBCSDT) => {
  if (!maBCSDT || maBCSDT.trim() === "") {
    throw new Error("Mã báo cáo không được để trống");
  }

  const response = await fetch(`/api/medicineUsageReport/updateReport/${encodeURIComponent(maBCSDT)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (response.status === 404) {
    throw new Error("Không tìm thấy báo cáo");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi cập nhật báo cáo");
  }

  return response.json();
};

/**
 * Xóa báo cáo sử dụng thuốc
 * @param {string} maBCSDT - Mã báo cáo cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteMedicineUsageReport = async (maBCSDT) => {
  if (!maBCSDT || maBCSDT.trim() === "") {
    throw new Error("Mã báo cáo không được để trống");
  }

  const response = await fetch(`/api/medicineUsageReport/deleteReport/${encodeURIComponent(maBCSDT)}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  });

  if (response.status === 404) {
    throw new Error("Không tìm thấy báo cáo");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi xóa báo cáo");
  }

  return response.json();
};
