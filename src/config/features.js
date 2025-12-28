// src/config/features.js
/**
 * Định nghĩa tất cả Feature Codes cho hệ thống phân quyền
 * 
 * Format: FEATURE_[MODULE]_[ACTION]
 * 
 * Backend trả về danh sách MaChucNang mà user được phép.
 * Frontend sử dụng file này để map và kiểm tra quyền.
 */

// ==================== CHỨC NĂNG CHÍNH (từ Backend) ====================
export const PERMISSION_CODES = {
  // Quản lý người dùng
  USER_MANAGE: 'CN001',
  
  // Quản lý nhóm người dùng  
  USER_GROUP_MANAGE: 'CN002',
  
  // Phân quyền
  PERMISSION_MANAGE: 'CN003',
  
  // Quản lý bệnh nhân
  PATIENT_MANAGE: 'CN004',
  
  // Tra cứu bệnh nhân
  PATIENT_SEARCH: 'CN005',
  
  // Lập phiếu khám bệnh
  EXAM_FORM_CREATE: 'CN006',
  
  // Xem phiếu khám bệnh
  EXAM_FORM_VIEW: 'CN007',
  
  // Quản lý thuốc
  MEDICINE_MANAGE: 'CN008',
  
  // Nhập thuốc
  MEDICINE_IMPORT: 'CN009',
  
  // Tra cứu thuốc
  MEDICINE_SEARCH: 'CN010',
  
  // Lập hóa đơn
  INVOICE_CREATE: 'CN011',
  
  // Quản lý hóa đơn
  INVOICE_MANAGE: 'CN012',
  
  // Báo cáo doanh thu
  REPORT_REVENUE: 'CN013',
  
  // Báo cáo sử dụng thuốc
  REPORT_MEDICINE_USAGE: 'CN014',
  
  // Quản lý danh mục bệnh
  DISEASE_MANAGE: 'CN015',
  
  // Quản lý đơn vị tính
  UNIT_MANAGE: 'CN016',
  
  // Quản lý cách dùng thuốc
  USAGE_MANAGE: 'CN017',
  
  // Quản lý tham số
  ARGUMENT_MANAGE: 'CN018',
};

// ==================== FEATURE DEFINITIONS ====================
// Mapping chi tiết hơn với metadata cho từng feature

export const FEATURES = {
  // ===== BỆNH NHÂN =====
  PATIENT_LIST: {
    code: 'patient-list',
    permissions: [PERMISSION_CODES.PATIENT_MANAGE, PERMISSION_CODES.PATIENT_SEARCH],
    description: 'Xem danh sách bệnh nhân',
    mode: 'any', // Cần ít nhất 1 trong các quyền
  },
  PATIENT_CREATE: {
    code: 'patient-create',
    permissions: [PERMISSION_CODES.PATIENT_MANAGE],
    description: 'Thêm bệnh nhân mới',
    mode: 'any',
  },
  PATIENT_EDIT: {
    code: 'patient-edit',
    permissions: [PERMISSION_CODES.PATIENT_MANAGE],
    description: 'Sửa thông tin bệnh nhân',
    mode: 'any',
  },
  PATIENT_DELETE: {
    code: 'patient-delete',
    permissions: [PERMISSION_CODES.PATIENT_MANAGE],
    description: 'Xóa bệnh nhân',
    mode: 'any',
  },

  // ===== PHIẾU KHÁM =====
  EXAM_FORM_LIST: {
    code: 'exam-form-list',
    permissions: [PERMISSION_CODES.EXAM_FORM_VIEW, PERMISSION_CODES.EXAM_FORM_CREATE],
    description: 'Xem danh sách phiếu khám',
    mode: 'any',
  },
  EXAM_FORM_CREATE: {
    code: 'exam-form-create',
    permissions: [PERMISSION_CODES.EXAM_FORM_CREATE],
    description: 'Lập phiếu khám bệnh',
    mode: 'any',
  },
  EXAM_FORM_EDIT: {
    code: 'exam-form-edit',
    permissions: [PERMISSION_CODES.EXAM_FORM_CREATE],
    description: 'Sửa phiếu khám bệnh',
    mode: 'any',
  },
  EXAM_FORM_DELETE: {
    code: 'exam-form-delete',
    permissions: [PERMISSION_CODES.EXAM_FORM_CREATE],
    description: 'Xóa phiếu khám bệnh',
    mode: 'any',
  },

  // ===== DANH MỤC BỆNH =====
  DISEASE_LIST: {
    code: 'disease-list',
    permissions: [PERMISSION_CODES.DISEASE_MANAGE],
    description: 'Xem danh sách bệnh',
    mode: 'any',
  },
  DISEASE_CREATE: {
    code: 'disease-create',
    permissions: [PERMISSION_CODES.DISEASE_MANAGE],
    description: 'Thêm bệnh mới',
    mode: 'any',
  },
  DISEASE_EDIT: {
    code: 'disease-edit',
    permissions: [PERMISSION_CODES.DISEASE_MANAGE],
    description: 'Sửa thông tin bệnh',
    mode: 'any',
  },
  DISEASE_DELETE: {
    code: 'disease-delete',
    permissions: [PERMISSION_CODES.DISEASE_MANAGE],
    description: 'Xóa bệnh',
    mode: 'any',
  },

  // ===== THUỐC =====
  MEDICINE_LIST: {
    code: 'medicine-list',
    permissions: [PERMISSION_CODES.MEDICINE_MANAGE, PERMISSION_CODES.MEDICINE_SEARCH],
    description: 'Xem danh sách thuốc',
    mode: 'any',
  },
  MEDICINE_CREATE: {
    code: 'medicine-create',
    permissions: [PERMISSION_CODES.MEDICINE_MANAGE],
    description: 'Thêm thuốc mới',
    mode: 'any',
  },
  MEDICINE_EDIT: {
    code: 'medicine-edit',
    permissions: [PERMISSION_CODES.MEDICINE_MANAGE],
    description: 'Sửa thông tin thuốc',
    mode: 'any',
  },
  MEDICINE_DELETE: {
    code: 'medicine-delete',
    permissions: [PERMISSION_CODES.MEDICINE_MANAGE],
    description: 'Xóa thuốc',
    mode: 'any',
  },
  MEDICINE_IMPORT: {
    code: 'medicine-import',
    permissions: [PERMISSION_CODES.MEDICINE_IMPORT],
    description: 'Nhập thuốc vào kho',
    mode: 'any',
  },

  // ===== ĐƠN VỊ TÍNH =====
  UNIT_LIST: {
    code: 'unit-list',
    permissions: [PERMISSION_CODES.UNIT_MANAGE],
    description: 'Xem danh sách đơn vị tính',
    mode: 'any',
  },
  UNIT_CREATE: {
    code: 'unit-create',
    permissions: [PERMISSION_CODES.UNIT_MANAGE],
    description: 'Thêm đơn vị tính',
    mode: 'any',
  },
  UNIT_EDIT: {
    code: 'unit-edit',
    permissions: [PERMISSION_CODES.UNIT_MANAGE],
    description: 'Sửa đơn vị tính',
    mode: 'any',
  },
  UNIT_DELETE: {
    code: 'unit-delete',
    permissions: [PERMISSION_CODES.UNIT_MANAGE],
    description: 'Xóa đơn vị tính',
    mode: 'any',
  },

  // ===== CÁCH DÙNG =====
  USAGE_LIST: {
    code: 'usage-list',
    permissions: [PERMISSION_CODES.USAGE_MANAGE],
    description: 'Xem danh sách cách dùng',
    mode: 'any',
  },
  USAGE_CREATE: {
    code: 'usage-create',
    permissions: [PERMISSION_CODES.USAGE_MANAGE],
    description: 'Thêm cách dùng',
    mode: 'any',
  },
  USAGE_EDIT: {
    code: 'usage-edit',
    permissions: [PERMISSION_CODES.USAGE_MANAGE],
    description: 'Sửa cách dùng',
    mode: 'any',
  },
  USAGE_DELETE: {
    code: 'usage-delete',
    permissions: [PERMISSION_CODES.USAGE_MANAGE],
    description: 'Xóa cách dùng',
    mode: 'any',
  },

  // ===== HÓA ĐƠN =====
  INVOICE_LIST: {
    code: 'invoice-list',
    permissions: [PERMISSION_CODES.INVOICE_MANAGE, PERMISSION_CODES.INVOICE_CREATE],
    description: 'Xem danh sách hóa đơn',
    mode: 'any',
  },
  INVOICE_CREATE: {
    code: 'invoice-create',
    permissions: [PERMISSION_CODES.INVOICE_CREATE],
    description: 'Lập hóa đơn',
    mode: 'any',
  },
  INVOICE_EDIT: {
    code: 'invoice-edit',
    permissions: [PERMISSION_CODES.INVOICE_MANAGE],
    description: 'Sửa hóa đơn',
    mode: 'any',
  },
  INVOICE_DELETE: {
    code: 'invoice-delete',
    permissions: [PERMISSION_CODES.INVOICE_MANAGE],
    description: 'Xóa hóa đơn',
    mode: 'any',
  },

  // ===== BÁO CÁO =====
  REPORT_REVENUE: {
    code: 'report-revenue',
    permissions: [PERMISSION_CODES.REPORT_REVENUE],
    description: 'Xem báo cáo doanh thu',
    mode: 'any',
  },
  REPORT_MEDICINE_USAGE: {
    code: 'report-medicine-usage',
    permissions: [PERMISSION_CODES.REPORT_MEDICINE_USAGE],
    description: 'Xem báo cáo sử dụng thuốc',
    mode: 'any',
  },

  // ===== QUẢN LÝ HỆ THỐNG =====
  USER_LIST: {
    code: 'user-list',
    permissions: [PERMISSION_CODES.USER_MANAGE],
    description: 'Xem danh sách người dùng',
    mode: 'any',
  },
  USER_CREATE: {
    code: 'user-create',
    permissions: [PERMISSION_CODES.USER_MANAGE],
    description: 'Thêm người dùng',
    mode: 'any',
  },
  USER_EDIT: {
    code: 'user-edit',
    permissions: [PERMISSION_CODES.USER_MANAGE],
    description: 'Sửa người dùng',
    mode: 'any',
  },
  USER_DELETE: {
    code: 'user-delete',
    permissions: [PERMISSION_CODES.USER_MANAGE],
    description: 'Xóa người dùng',
    mode: 'any',
  },
  USER_GROUP_MANAGE: {
    code: 'user-group-manage',
    permissions: [PERMISSION_CODES.USER_GROUP_MANAGE],
    description: 'Quản lý nhóm người dùng',
    mode: 'any',
  },
  PERMISSION_ASSIGN: {
    code: 'permission-assign',
    permissions: [PERMISSION_CODES.PERMISSION_MANAGE],
    description: 'Phân quyền cho nhóm',
    mode: 'any',
  },
  ARGUMENT_MANAGE: {
    code: 'argument-manage',
    permissions: [PERMISSION_CODES.ARGUMENT_MANAGE],
    description: 'Quản lý tham số hệ thống',
    mode: 'any',
  },
};

/**
 * Helper function để lấy feature config từ feature key
 * @param {string} featureKey - Key của feature (vd: 'DISEASE_LIST')
 * @returns {Object|null} Feature config hoặc null
 */
export const getFeature = (featureKey) => {
  return FEATURES[featureKey] || null;
};

/**
 * Helper function để lấy permissions từ feature key
 * @param {string} featureKey - Key của feature
 * @returns {Array<string>} Mảng permission codes
 */
export const getFeaturePermissions = (featureKey) => {
  const feature = FEATURES[featureKey];
  return feature ? feature.permissions : [];
};

export default FEATURES;
