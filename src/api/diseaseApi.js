// src/api/diseaseApi.js

/**
 * Tạo bệnh mới
 * @param {object} formData - Dữ liệu bệnh
 * @returns {Promise<object>} Thông tin bệnh vừa tạo (bao gồm MaBenh)
 */
export const createDisease = async (formData) => {
  if (!formData.TenBenh || formData.TenBenh.trim() === "") {
    throw new Error("Tên bệnh không được để trống");
  }

  // Map frontend → backend
  const payload = {
    TenBenh: formData.TenBenh,
    TrieuChung: formData.TrieuChung || "",
    NguyenNhan: formData.NguyenNhan || "",
    BienPhapChanDoan: formData.BienPhapChanDoan || "",
    CachDieuTri: formData.CachDieuTri || "",
  };

  const response = await fetch("/api/disease/createBenh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 409) {
    const data = await response.json();
    throw new Error(data.message || "Tên bệnh đã tồn tại");
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
 * Lấy toàn bộ danh sách bệnh
 * @returns {Promise<Array>} Danh sách tất cả các bệnh
 */
export const getAllDiseases = async () => {
  const response = await fetch("/api/disease/getDSBenh", {
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
 * Lấy danh sách tên bệnh (MaBenh và TenBenh)
 * @returns {Promise<Array>} Danh sách bệnh (chỉ MaBenh và TenBenh)
 */
export const getDiseaseNames = async () => {
  const response = await fetch("/api/disease/getDSTenBenh", {
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
 * Tra cứu bệnh theo tên
 * @param {string} tenBenh - Tên bệnh cần tra cứu
 * @returns {Promise<Array>} Danh sách bệnh phù hợp
 */
export const searchDisease = async (tenBenh) => {
  if (!tenBenh || tenBenh.trim() === "") {
    throw new Error("Tên bệnh không được để trống");
  }

  const response = await fetch(`/api/disease/searchBenh/${tenBenh}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 404) {
    const data = await response.json();
    throw new Error(data.message || "Không tìm thấy bệnh phù hợp");
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
 * Cập nhật thông tin bệnh
 * @param {string} MaBenh - Mã bệnh cần cập nhật
 * @param {object} formData - Dữ liệu cập nhật
 * @returns {Promise<object>} Kết quả cập nhật
 */
export const updateDisease = async (MaBenh, formData) => {
  if (!MaBenh || MaBenh.trim() === "") {
    throw new Error("Mã bệnh không được để trống");
  }

  // Map frontend → backend
  const payload = {
    TrieuChung: formData.TrieuChung || "",
    NguyenNhan: formData.NguyenNhan || "",
    BienPhapChanDoan: formData.BienPhapChanDoan || "",
    CachDieuTri: formData.CachDieuTri || "",
  };

  const response = await fetch(`/api/disease/updateBenh/${MaBenh}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // ✅ Xử lý theo STATUS từ Swagger
  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Thông tin không thay đổi");
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
 * Xóa bệnh
 * @param {string} MaBenh - Mã bệnh cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteDisease = async (MaBenh) => {
  if (!MaBenh || MaBenh.trim() === "") {
    throw new Error("Mã bệnh không được để trống");
  }

  const response = await fetch(`/api/disease/deleteBenh/${MaBenh}`, {
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
