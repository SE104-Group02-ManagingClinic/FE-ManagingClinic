// src/api/listExamApi.js

/**
 * Thêm bệnh nhân vào danh sách khám
 * @param {object} data - Dữ liệu {NgayKham, MaBN}
 * @returns {Promise<object>} Thông tin bệnh nhân vừa thêm
 */
export const addPatientToExamList = async (data) => {
  if (!data.NgayKham || data.NgayKham.trim() === "") {
    throw new Error("Ngày khám không được để trống");
  }
  if (!data.MaBN || data.MaBN.trim() === "") {
    throw new Error("Mã bệnh nhân không được để trống");
  }

  const payload = {
    NgayKham: data.NgayKham,
    MaBN: data.MaBN,
  };

  const response = await fetch("/api/listExam/addInList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Bệnh nhân đã có trong danh sách khám");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống khi thêm bệnh nhân vào danh sách khám");
  }

  // ✅ 201 Created
  return response.json();
};

/**
 * Xóa bệnh nhân khỏi danh sách khám
 * @param {object} data - Dữ liệu {NgayKham, MaBN}
 * @returns {Promise<object>} Thông tin bệnh nhân vừa xóa
 */
export const removePatientFromExamList = async (data) => {
  if (!data.NgayKham || data.NgayKham.trim() === "") {
    throw new Error("Ngày khám không được để trống");
  }
  if (!data.MaBN || data.MaBN.trim() === "") {
    throw new Error("Mã bệnh nhân không được để trống");
  }

  const payload = {
    NgayKham: data.NgayKham,
    MaBN: data.MaBN,
  };

  const response = await fetch("/api/listExam/removeFromList", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy bệnh nhân trong danh sách khám");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống khi xóa bệnh nhân khỏi danh sách khám");
  }

  // ✅ 200 OK
  return response.json();
};

/**
 * Lấy danh sách bệnh nhân khám trong ngày
 * @param {string} ngayKham - Ngày khám (yyyy-MM-dd)
 * @returns {Promise<object>} Thông tin danh sách khám trong ngày
 *  Cấu trúc: { NgayKham, TongSoBenhNhan, DanhSachBenhNhan: [...] }
 */
export const getDailyExamList = async (ngayKham) => {
  if (!ngayKham || ngayKham.trim() === "") {
    throw new Error("Ngày khám không được để trống");
  }

  // ✅ Sử dụng path parameter theo API spec: /listExam/getDaylyList/{NgayKham}
  const response = await fetch(`/api/listExam/getDaylyList/${encodeURIComponent(ngayKham)}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  // ✅ Xử lý theo STATUS từ API Swagger
  if (response.status === 404) {
    // Không tìm thấy dữ liệu cho ngày khám - trả về danh sách rỗng
    return {
      NgayKham: ngayKham,
      TongSoBenhNhan: 0,
      DanhSachBenhNhan: [],
    };
  }

  if (response.status === 500) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Lỗi hệ thống khi lấy danh sách khám bệnh");
  }

  if (!response.ok) {
    // Xử lý các lỗi khác
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || data.message || "Lỗi không xác định khi lấy danh sách khám bệnh");
  }

  // ✅ 200 OK - trả về dữ liệu
  return response.json();
};
