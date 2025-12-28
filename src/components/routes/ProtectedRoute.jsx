// src/components/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Component bảo vệ route dựa trên phân quyền
 * 
 * Mô hình: NGUOIDUNG → NHOMNGUOIDUNG → PHANQUYEN → CHUCNANG
 * 
 * @param {React.ReactNode} children - Component con cần bảo vệ
 * @param {string} maChucNang - Mã chức năng yêu cầu (optional nếu dùng path)
 * @param {string} redirectTo - Route redirect khi không có quyền
 */
const ProtectedRoute = ({ 
  children, 
  maChucNang,
  redirectTo = '/home' 
}) => {
  const { isAuthenticated, checkPermission, checkRouteAccess, loading } = useAuth();
  const location = useLocation();

  // Đang load thông tin user
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Đang tải...</p>
      </div>
    );
  }

  // Chưa đăng nhập → chuyển về trang login
  if (!isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền theo maChucNang nếu được cung cấp
  if (maChucNang && !checkPermission(maChucNang)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Kiểm tra quyền theo path hiện tại
  if (!maChucNang && !checkRouteAccess(location.pathname)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
