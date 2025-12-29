// src/components/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SIDEBAR_ITEMS } from '../../config/permissions';

/**
 * Component bảo vệ route dựa trên phân quyền
 * 
 * Kiểm tra quyền theo feature codes từ backend
 * Nếu user có BẤT KÌ 1 feature nào thuộc route đó → cho phép truy cập
 * 
 * @param {React.ReactNode} children - Component con cần bảo vệ
 * @param {string} redirectTo - Route redirect khi không có quyền
 */
const ProtectedRoute = ({ 
  children,
  redirectTo = '/home' 
}) => {
  const { isAuthenticated, hasAnyFeature, loading } = useAuth();
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

  // Tìm route config theo pathname
  const routeConfig = SIDEBAR_ITEMS.find(item => item.path === location.pathname);
  
  // Nếu là trang public (như /home) → cho phép truy cập
  if (!routeConfig || routeConfig.public) {
    return children;
  }

  // Kiểm tra user có ít nhất 1 feature thuộc route này không
  if (!hasAnyFeature(routeConfig.features)) {
    console.warn(`🚫 User không có quyền truy cập ${location.pathname}`);
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
