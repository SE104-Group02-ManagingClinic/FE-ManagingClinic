// src/config/permissions.js

/**
 * Mapping giữa Route Path và Mã Chức Năng (CHUCNANG)
 * 
 * Mô hình: NGUOIDUNG → NHOMNGUOIDUNG → PHANQUYEN → CHUCNANG
 * 
 * Mã chức năng từ Backend:
 * - CN001: Quản lý người dùng
 * - CN002: Quản lý nhóm người dùng
 * - CN003: Phân quyền
 * - CN004: Quản lý bệnh nhân
 * - CN005: Tra cứu bệnh nhân
 * - CN006: Lập phiếu khám bệnh
 * - CN007: Xem phiếu khám bệnh
 * - CN008: Quản lý thuốc
 * - CN009: Nhập thuốc
 * - CN010: Tra cứu thuốc
 * - CN011: Lập hóa đơn
 * - CN012: Quản lý hóa đơn
 * - CN013: Báo cáo doanh thu
 * - CN014: Báo cáo sử dụng thuốc
 * - CN015: Quản lý danh mục bệnh
 * - CN016: Quản lý đơn vị tính
 * - CN017: Quản lý cách dùng thuốc
 * - CN018: Quản lý tham số
 */

export const ROUTE_PERMISSIONS = {
  '/home': {
    maChucNang: null, // Trang chủ - không cần quyền
    tenChucNang: 'Trang chủ',
    public: true, // Cho phép tất cả user đã đăng nhập
  },
  '/examine': {
    maChucNang: ['CN004', 'CN005', 'CN006', 'CN007'], // Quản lý bệnh nhân, tra cứu, lập phiếu khám
    tenChucNang: 'Khám bệnh',
    public: false,
    description: 'Dành cho Bác sĩ và Admin',
  },
  '/medicines': {
    maChucNang: ['CN008', 'CN009', 'CN010'], // Quản lý thuốc, nhập thuốc, tra cứu
    tenChucNang: 'Quản lí thuốc',
    public: false,
    description: 'Dành cho Nhân viên và Admin',
  },
  '/payment': {
    maChucNang: ['CN011', 'CN012'], // Lập hóa đơn, Quản lý hóa đơn
    tenChucNang: 'Thanh toán',
    public: false,
    description: 'Dành cho Nhân viên thu ngân và Admin',
  },
  '/statistics': {
    maChucNang: ['CN013', 'CN014'], // Báo cáo doanh thu, báo cáo sử dụng thuốc
    tenChucNang: 'Báo cáo thống kê',
    public: false,
    description: 'Dành cho Admin',
  },
  '/settings': {
    maChucNang: ['CN001', 'CN002', 'CN003', 'CN015', 'CN016', 'CN017', 'CN018'], // Quản lý user, nhóm, quyền, danh mục
    tenChucNang: 'Cài đặt hệ thống',
    public: false,
    description: 'Dành cho Admin',
  },
  '/admin': {
    maChucNang: ['CN001', 'CN002', 'CN003', 'CN018'], // Quản lý user, nhóm, phân quyền, tham số
    tenChucNang: 'Quản trị hệ thống',
    public: false,
    description: 'Dành cho Admin - Quản lý người dùng, nhóm, phân quyền',
    adminOnly: true, // Chỉ admin (GR001) mới được truy cập
  },
};

/**
 * Sidebar items với thông tin phân quyền
 */
export const SIDEBAR_ITEMS = [
  {
    icon: '🏠',
    label: 'Trang chủ',
    path: '/home',
    maChucNang: null,
    public: true,
  },
  {
    icon: '🩺',
    label: 'Khám bệnh',
    path: '/examine',
    maChucNang: ['CN004', 'CN005', 'CN006', 'CN007'], // Cần ít nhất 1 trong các quyền này
    public: false,
  },
  {
    icon: '💊',
    label: 'Quản lí thuốc',
    path: '/medicines',
    maChucNang: ['CN008', 'CN009', 'CN010'],
    public: false,
  },
  {
    icon: '💵',
    label: 'Thanh toán',
    path: '/payment',
    maChucNang: ['CN011', 'CN012'], // Lập hóa đơn, Quản lý hóa đơn
    public: false,
  },
  {
    icon: '📊',
    label: 'Báo cáo',
    path: '/statistics',
    maChucNang: ['CN013', 'CN014'],
    public: false,
  },
  {
    icon: '⚙️',
    label: 'Cài đặt',
    path: '/settings',
    maChucNang: ['CN001', 'CN002', 'CN003'],
    public: false,
  },
  {
    icon: '🛠️',
    label: 'Quản trị',
    path: '/admin',
    maChucNang: ['CN001', 'CN002', 'CN003', 'CN018'],
    public: false,
    adminOnly: true, // Chỉ admin (GR001) mới hiển thị
  },
];

/**
 * Danh sách nhóm người dùng
 */
export const USER_GROUPS = {
  ADMIN: 'GR001',
  BAC_SI: 'GR002',
  NHAN_VIEN: 'GR003',
};

/**
 * Tên nhóm người dùng
 */
export const GROUP_NAMES = {
  GR001: 'Admin',
  GR002: 'Bác sĩ',
  GR003: 'Nhân viên',
};

/**
 * Ví dụ phân quyền mặc định theo nhóm (tham khảo)
 * Backend sẽ quản lý phân quyền thực tế thông qua bảng PHANQUYEN
 */
export const DEFAULT_GROUP_PERMISSIONS = {
  GR001: ['TRANG_CHU', 'KHAM_BENH', 'QUAN_LI_THUOC', 'BAO_CAO', 'CAI_DAT'], // Admin - full quyền
  GR002: ['TRANG_CHU', 'KHAM_BENH'], // Bác sĩ - khám bệnh
  GR003: ['TRANG_CHU', 'QUAN_LI_THUOC'], // Nhân viên - quản lí thuốc
};

/**
 * Kiểm tra user có quyền truy cập chức năng không
 * @param {string|Array<string>} maChucNang - Mã chức năng hoặc mảng mã chức năng cần kiểm tra
 * @param {Array<string>} userPermissions - Danh sách mã chức năng user được phép
 * @returns {boolean}
 */
export const hasPermission = (maChucNang, userPermissions = []) => {
  if (!maChucNang) return true; // null = public route
  
  // Nếu maChucNang là mảng, check user có ít nhất 1 quyền trong mảng
  if (Array.isArray(maChucNang)) {
    return maChucNang.some(code => userPermissions.includes(code));
  }
  
  // Nếu là string, check exact match
  return userPermissions.includes(maChucNang);
};

/**
 * Kiểm tra user có quyền truy cập route không
 * @param {string} path - Route path
 * @param {Array<string>} userPermissions - Danh sách mã chức năng user được phép
 * @returns {boolean}
 */
export const canAccessRoute = (path, userPermissions = []) => {
  const routeConfig = ROUTE_PERMISSIONS[path];
  
  if (!routeConfig) return false;
  if (routeConfig.public) return true;
  
  // Sử dụng hasPermission để xử lý cả string và array
  return hasPermission(routeConfig.maChucNang, userPermissions);
};

/**
 * Lấy danh sách sidebar items mà user có quyền truy cập
 * @param {Array<string>} userPermissions - Danh sách mã chức năng user được phép
 * @param {string} userGroup - Mã nhóm người dùng (để check adminOnly)
 * @returns {Array}
 */
export const getAccessibleSidebarItems = (userPermissions = [], userGroup = null) => {
  console.log('🔍 Checking sidebar permissions. User has:', userPermissions);
  console.log('👤 User group:', userGroup);
  
  return SIDEBAR_ITEMS.filter((item) => {
    // Nếu item chỉ dành cho admin, kiểm tra user có phải admin không
    if (item.adminOnly && userGroup !== 'GR001') {
      console.log(`❌ ${item.label}: Admin only (user group: ${userGroup})`);
      return false;
    }
    
    if (item.public) {
      console.log(`✅ ${item.label}: Public`);
      return true;
    }
    
    const hasAccess = hasPermission(item.maChucNang, userPermissions);
    console.log(`${hasAccess ? '✅' : '❌'} ${item.label}: Required ${JSON.stringify(item.maChucNang)}`);
    return hasAccess;
  });
};

/**
 * Lấy tên nhóm từ mã nhóm
 * @param {string} maNhom - Mã nhóm (GR001, GR002, GR003)
 * @returns {string}
 */
export const getGroupName = (maNhom) => {
  return GROUP_NAMES[maNhom] || 'Không xác định';
};