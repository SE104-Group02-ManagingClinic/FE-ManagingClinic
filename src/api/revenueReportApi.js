// src/api/revenueReportApi.js

/**
 * API quản lý báo cáo doanh thu
 */

/**
 * Tạo báo cáo doanh thu theo tháng/năm
 * @param {number} thang - Tháng cần tạo báo cáo (1-12)
 * @param {number} nam - Năm cần tạo báo cáo
 * @returns {Promise<object>} Thông tin báo cáo vừa tạo
 */
export const createRevenueReport = async (thang, nam) => {
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

  const response = await fetch("/api/revenueReport/createReport", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Báo cáo tháng này đã tồn tại");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống khi tạo báo cáo doanh thu");
  }

  // 201 Created
  return response.json();
};

/**
 * Lấy danh sách tất cả báo cáo doanh thu
 * @returns {Promise<Array>} Danh sách báo cáo
 */
export const getRevenueReports = async () => {
  const response = await fetch("/api/revenueReport/getReports", {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi lấy danh sách báo cáo doanh thu");
  }

  return response.json();
};

/**
 * Lấy chi tiết báo cáo doanh thu theo mã
 * @param {string} maBCDT - Mã báo cáo doanh thu
 * @returns {Promise<object>} Chi tiết báo cáo bao gồm doanh thu theo ngày
 */
export const getRevenueReportDetail = async (maBCDT) => {
  if (!maBCDT || maBCDT.trim() === "") {
    throw new Error("Mã báo cáo không được để trống");
  }

  const response = await fetch(`/api/revenueReport/getReportDetail/${encodeURIComponent(maBCDT)}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy báo cáo doanh thu");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi lấy chi tiết báo cáo doanh thu");
  }

  return response.json();
};

/**
 * Tìm kiếm báo cáo doanh thu theo tháng/năm
 * @param {number} thang - Tháng cần tìm (optional)
 * @param {number} nam - Năm cần tìm (optional)
 * @returns {Promise<Array>} Danh sách báo cáo phù hợp
 */
export const searchRevenueReports = async (thang, nam) => {
  const params = new URLSearchParams();
  if (thang) params.append("Thang", thang);
  if (nam) params.append("Nam", nam);

  const queryString = params.toString();
  const url = `/api/revenueReport/search${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi tìm kiếm báo cáo doanh thu");
  }

  return response.json();
};

/**
 * Cập nhật báo cáo doanh thu (tái tổng hợp)
 * @param {string} maBCDT - Mã báo cáo cần cập nhật
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updateRevenueReport = async (maBCDT) => {
  if (!maBCDT || maBCDT.trim() === "") {
    throw new Error("Mã báo cáo không được để trống");
  }

  const response = await fetch(`/api/revenueReport/updateReport/${encodeURIComponent(maBCDT)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (response.status === 404) {
    throw new Error("Không tìm thấy báo cáo doanh thu");
  }

  if (response.status === 409) {
    throw new Error("Không có dữ liệu mới để cập nhật");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi cập nhật báo cáo doanh thu");
  }

  return response.json();
};

/**
 * Xóa báo cáo doanh thu
 * @param {string} maBCDT - Mã báo cáo cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteRevenueReport = async (maBCDT) => {
  if (!maBCDT || maBCDT.trim() === "") {
    throw new Error("Mã báo cáo không được để trống");
  }

  const response = await fetch(`/api/revenueReport/deleteReport/${encodeURIComponent(maBCDT)}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  });

  if (response.status === 404) {
    throw new Error("Không tìm thấy báo cáo doanh thu");
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Lỗi khi xóa báo cáo doanh thu");
  }

  return response.json();
};
