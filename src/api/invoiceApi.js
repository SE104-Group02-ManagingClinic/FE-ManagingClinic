// src/api/invoiceApi.js

/**
 * Tạo hóa đơn thanh toán mới
 * @param {object} invoiceData - Dữ liệu hóa đơn {MaPKB, NgayThanhToan, TienKham, TienThuoc}
 * @returns {Promise<object>} Thông tin hóa đơn vừa tạo
 */
export const createInvoice = async (invoiceData) => {
  if (!invoiceData.MaPKB || invoiceData.MaPKB.trim() === "") {
    throw new Error("Mã phiếu khám bệnh không được để trống");
  }

  const payload = {
    MaPKB: invoiceData.MaPKB,
    NgayThanhToan: invoiceData.NgayThanhToan,
    TienKham: invoiceData.TienKham || 0,
    TienThuoc: invoiceData.TienThuoc || 0,
  };

  const response = await fetch("/api/invoice/createInvoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Đã tồn tại hóa đơn thanh toán cho phiếu khám bệnh này");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  // ✅ 201 Created
  return response.json();
};

/**
 * Lấy danh sách hóa đơn thanh toán theo ngày
 * @param {string} ngayThanhToan - Ngày thanh toán (yyyy-MM-dd)
 * @returns {Promise<Array>} Danh sách hóa đơn thanh toán
 */
export const getInvoicesByDate = async (ngayThanhToan) => {
  if (!ngayThanhToan || ngayThanhToan.trim() === "") {
    throw new Error("Ngày thanh toán không được để trống");
  }

  const response = await fetch(`/api/invoice/getInvoicesByDate/${ngayThanhToan}`, {
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

/**
 * Lấy thông tin hóa đơn theo mã hóa đơn
 * @param {string} maHD - Mã hóa đơn
 * @returns {Promise<object>} Thông tin chi tiết hóa đơn
 */
export const getInvoiceById = async (maHD) => {
  if (!maHD || maHD.trim() === "") {
    throw new Error("Mã hóa đơn không được để trống");
  }

  const response = await fetch(`/api/invoice/getInvoice/${maHD}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy hóa đơn");
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
 * Lấy hóa đơn theo mã phiếu khám bệnh
 * @param {string} maPKB - Mã phiếu khám bệnh
 * @returns {Promise<object|null>} Thông tin hóa đơn hoặc null nếu chưa có
 */
export const getInvoiceByExamFormId = async (maPKB) => {
  if (!maPKB || maPKB.trim() === "") {
    throw new Error("Mã phiếu khám bệnh không được để trống");
  }

  try {
    // Get today's date to search invoices
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    // Try to get invoices by date first - this is a workaround
    // In a real app, you'd have an API endpoint for this
    const invoices = await getInvoicesByDate(dateStr);
    const invoice = invoices.find(inv => inv.MaPKB === maPKB);
    
    if (invoice) {
      return invoice;
    }
    
    return null;
  } catch (error) {
    // If no invoices found or error, return null
    return null;
  }
};

/**
 * Cập nhật hóa đơn thanh toán
 * @param {string} maHD - Mã hóa đơn
 * @param {object} invoiceData - Dữ liệu cập nhật {TienKham, TienThuoc}
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updateInvoice = async (maHD, invoiceData) => {
  if (!maHD || maHD.trim() === "") {
    throw new Error("Mã hóa đơn không được để trống");
  }

  const payload = {
    TienKham: invoiceData.TienKham || 0,
    TienThuoc: invoiceData.TienThuoc || 0,
  };

  const response = await fetch(`/api/invoice/updateInvoice/${maHD}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy hóa đơn để cập nhật");
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
 * Xóa hóa đơn thanh toán
 * @param {string} maHD - Mã hóa đơn cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteInvoice = async (maHD) => {
  if (!maHD || maHD.trim() === "") {
    throw new Error("Mã hóa đơn không được để trống");
  }

  const response = await fetch(`/api/invoice/deleteInvoice/${maHD}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Xóa không thành công");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  // ✅ 200 OK
  return response.json();
};
