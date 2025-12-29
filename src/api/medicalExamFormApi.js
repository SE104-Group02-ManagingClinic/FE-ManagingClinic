// src/api/medicalExamFormApi.js

/**
 * Kiểm tra tồn kho và lấy mã lô phù hợp
 * @param {Array} medicines - Danh sách thuốc [{MaThuoc, SoLuong}, ...]
 * @returns {Promise<Array>} Danh sách thuốc kèm mã lô [{MaThuoc, MaLo}, ...]
 */
export const confirmMedicalExamForm = async (medicines) => {
  if (!Array.isArray(medicines) || medicines.length === 0) {
    throw new Error("Danh sách thuốc không được để trống");
  }

  const payload = medicines.map(thuoc => ({
    MaThuoc: thuoc.MaThuoc,
    SoLuong: thuoc.SoLuong,
  }));

  const response = await fetch("/api/medicalExamForm/confirmMedicalExamForm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 400) {
    throw new Error("Danh sách thuốc không hợp lệ");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống khi kiểm tra tồn kho");
  }

  // ✅ 200 OK
  return response.json();
};

/**
 * Tạo phiếu khám bệnh (PKB)
 * @param {object} formData - Dữ liệu phiếu khám bệnh
 * @returns {Promise<object>} Thông tin PKB vừa tạo (bao gồm MaPKB)
 */
export const createMedicalExamForm = async (formData) => {
  if (!formData.MaBN || formData.MaBN.trim() === "") {
    throw new Error("Mã bệnh nhân không được để trống");
  }

  // Map frontend → backend
  const payload = {
    MaBN: formData.MaBN,
    NgayKham: formData.NgayKham,
    TrieuChung: formData.TrieuChung || "",
    CT_Benh: formData.CT_Benh || [],
    CT_Thuoc: (formData.CT_Thuoc || []).map(thuoc => ({
      MaThuoc: thuoc.MaThuoc,
      MaLo: thuoc.MaLo, // Mã lô bắt buộc (lấy từ confirmMedicalExamForm)
      SoLuong: thuoc.SoLuong,
      DonGiaBan: thuoc.GiaBan || thuoc.DonGiaBan, // Map GiaBan to DonGiaBan
    })),
    TongTienThuoc: formData.TongTienThuoc || 0,
  };

  const response = await fetch("/api/medicalExamForm/createMedicalExamForm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Bệnh nhân không tồn tại");
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
 * Cập nhật phiếu khám bệnh (PKB)
 * @param {string} maPKB - Mã phiếu khám bệnh
 * @param {object} formData - Dữ liệu phiếu khám bệnh
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updateMedicalExamForm = async (maPKB, formData) => {
  if (!maPKB || maPKB.trim() === "") {
    throw new Error("Mã phiếu khám bệnh không được để trống");
  }

  // Map frontend → backend
  const payload = {
    MaBN: formData.MaBN,
    NgayKham: formData.NgayKham,
    TrieuChung: formData.TrieuChung || "",
    CT_Benh: formData.CT_Benh || [],
    CT_Thuoc: (formData.CT_Thuoc || []).map(thuoc => ({
      MaThuoc: thuoc.MaThuoc,
      SoLuong: thuoc.SoLuong,
      DonGiaBan: thuoc.GiaBan || thuoc.DonGiaBan, // Map GiaBan to DonGiaBan
      ThanhTien: thuoc.ThanhTien
    })),
    TongTienThuoc: formData.TongTienThuoc || 0,
  };

  const response = await fetch(`/api/medicalExamForm/updateMedicalExamForm/${maPKB}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Bệnh nhân không tồn tại");
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
 * Xóa phiếu khám bệnh (PKB)
 * @param {string} maPKB - Mã phiếu khám bệnh cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteMedicalExamForm = async (maPKB) => {
  if (!maPKB || maPKB.trim() === "") {
    throw new Error("Mã phiếu khám bệnh không được để trống");
  }

  const response = await fetch(`/api/medicalExamForm/deleteMedicalExamForm/${maPKB}`, {
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

/**
 * Lấy danh sách phiếu khám bệnh theo ngày khám
 * @param {string} ngayKham - Ngày khám (yyyy-MM-dd)
 * @returns {Promise<Array>} Danh sách phiếu khám bệnh
 */
export const getExamFormsByDate = async (ngayKham) => {
  if (!ngayKham || ngayKham.trim() === "") {
    throw new Error("Ngày khám không được để trống");
  }

  const response = await fetch(`/api/medicalExamForm/getExamsFormByDate/${ngayKham}`, {
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
 * Lấy danh sách phiếu khám bệnh sắp tới (từ hôm nay trở đi)
 * @returns {Promise<Array>} Danh sách phiếu khám bệnh sắp tới, sắp xếp theo ngày tăng dần
 */
export const getUpcomingExamForms = async () => {
  try {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    
    // Get exams for next 7 days
    const promises = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      promises.push(
        getExamFormsByDate(dateStr).catch(() => [])
      );
    }
    
    const results = await Promise.all(promises);
    const allExams = results.flat();
    
    // Sort by date ascending
    allExams.sort((a, b) => {
      const dateA = new Date(a.NgayKham);
      const dateB = new Date(b.NgayKham);
      return dateA - dateB;
    });
    
    return allExams;
  } catch (error) {
    console.error("Error fetching upcoming exams:", error);
    throw error;
  }
};

/**
 * Lấy thông tin phiếu khám bệnh theo mã PKB
 * @param {string} maPKB - Mã phiếu khám bệnh
 * @returns {Promise<object>} Thông tin chi tiết phiếu khám bệnh
 */
export const getExamFormById = async (maPKB) => {
  if (!maPKB || maPKB.trim() === "") {
    throw new Error("Mã phiếu khám bệnh không được để trống");
  }

  const response = await fetch(`/api/medicalExamForm/getExamFormById/${maPKB}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy phiếu khám bệnh");
  }

  if (!response.ok) {
    // 500 hoặc lỗi khác
    const data = await response.json();
    throw new Error(data.error || "Lỗi hệ thống");
  }

  // ✅ 200 OK
  return response.json();
};


