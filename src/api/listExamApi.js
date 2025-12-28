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
 */
export const getDailyExamList = async (ngayKham) => {
  if (!ngayKham || ngayKham.trim() === "") {
    throw new Error("Ngày khám không được để trống");
  }

  const response = await fetch(`/api/listExam/getDaylyList?NgayKham=${encodeURIComponent(ngayKham)}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống khi lấy danh sách khám");
  }

  // ✅ 200 OK
  return response.json();
};
