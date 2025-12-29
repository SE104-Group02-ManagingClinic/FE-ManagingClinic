// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { hasPermission, canAccessRoute, getAccessibleSidebarItems } from '../config/permissions';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [features, setFeatures] = useState([]); // Danh sách feature/component codes từ backend
  const [loading, setLoading] = useState(true);

  // Load user từ localStorage khi khởi tạo
  useEffect(() => {
    const storedData = localStorage.getItem('authData');
    if (storedData) {
      try {
        const authData = JSON.parse(storedData);
        setUser(authData.user);
        setToken(authData.token);
        // permissions là mảng object [{MaChucNang, TenChucNang}]
        // Extract ra mảng MaChucNang để dễ check
        const permissionCodes = authData.permissions?.map(p => p.MaChucNang) || [];
        setPermissions(permissionCodes);
        // Features/components từ backend (có thể là "features" hoặc "components")
        const featureCodes = authData.features || authData.components || [];
        setFeatures(featureCodes);
      } catch (error) {
        console.error('Error parsing auth data:', error);
        localStorage.removeItem('authData');
      }
    }
    setLoading(false);
  }, []);

  // Đăng nhập và lưu thông tin user
  const login = (responseData) => {
    console.log('🔐 AuthContext.login() called with:', responseData);
    
    // Validate responseData
    if (!responseData) {
      console.error('❌ responseData is null/undefined');
      throw new Error('Dữ liệu đăng nhập không hợp lệ');
    }
    
    if (!responseData.user) {
      console.error('❌ responseData.user is missing:', responseData);
      throw new Error('Thiếu thông tin user');
    }
    
    // ⚠️ Token có thể null nếu backend chưa cập nhật
    if (!responseData.token) {
      console.warn('⚠️ Backend chưa trả về token - chế độ tương thích');
    }
    
    // responseData = { token, user: {TenDangNhap, MaNhom, TenNhom}, permissions: [{MaChucNang, TenChucNang}] }
    console.log('✅ Setting user:', responseData.user);
    setUser(responseData.user);
    
    console.log('✅ Setting token:', responseData.token ? 'Có token' : 'Không có token');
    setToken(responseData.token);
    
    // Extract mảng MaChucNang từ permissions
    const permissionCodes = responseData.permissions?.map(p => p.MaChucNang) || [];
    console.log('✅ Extracted permissions:', permissionCodes);
    setPermissions(permissionCodes);
    
    // Extract features/components từ backend
    const featureCodes = responseData.features || responseData.components || [];
    console.group('🎯 AuthContext Features Processing');
    console.log('✅ Extracted features:', featureCodes);
    console.log('   Features count:', featureCodes.length);
    if (featureCodes.length > 0) {
      console.log('   First 10 features:', featureCodes.slice(0, 10));
    } else {
      console.warn('⚠️ No features found! responseData:', responseData);
    }
    console.groupEnd();
    setFeatures(featureCodes);
    
    // Lưu toàn bộ vào localStorage
    console.log('💾 Saving to localStorage...');
    localStorage.setItem('authData', JSON.stringify(responseData));
    
    if (responseData.token) {
      localStorage.setItem('token', responseData.token);
    }
    
    console.log('✅ Login completed successfully');
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    setToken(null);
    setPermissions([]);
    setFeatures([]);
    localStorage.removeItem('authData');
    localStorage.removeItem('token');
  };

  // Kiểm tra có quyền truy cập chức năng không (legacy - dùng MaChucNang)
  const checkPermission = (maChucNang) => {
    return hasPermission(maChucNang, permissions);
  };

  // Kiểm tra có quyền truy cập feature/component không (mới - dùng feature code từ backend)
  const checkFeature = (featureCode) => {
    if (!featureCode) return true;
    return features.includes(featureCode);
  };

  // Kiểm tra có ít nhất 1 trong các features
  const hasAnyFeature = (featureCodes) => {
    if (!Array.isArray(featureCodes) || featureCodes.length === 0) return true;
    return featureCodes.some(code => features.includes(code));
  };

  // Kiểm tra có tất cả các features
  const hasAllFeatures = (featureCodes) => {
    if (!Array.isArray(featureCodes) || featureCodes.length === 0) return true;
    return featureCodes.every(code => features.includes(code));
  };

  // Kiểm tra có quyền truy cập route không
  const checkRouteAccess = (path) => {
    return canAccessRoute(path, permissions);
  };

  // Lấy sidebar items mà user có quyền
  const getSidebarItems = () => {
    const userGroup = user?.MaNhom || null;
    return getAccessibleSidebarItems(permissions, userGroup, features);
  };

  // Kiểm tra đã đăng nhập chưa
  const isAuthenticated = () => {
    return !!user;
  };

  // Lấy token (dùng khi gọi API)
  const getToken = () => {
    return token || localStorage.getItem('token');
  };

  const value = {
    user,
    token,
    permissions,
    features, // Danh sách feature codes từ backend
    loading,
    login,
    logout,
    checkPermission, // Legacy: check bằng MaChucNang
    checkFeature,    // Mới: check bằng feature code
    hasAnyFeature,   // Check có ít nhất 1 feature
    hasAllFeatures,  // Check có tất cả features
    checkRouteAccess,
    getSidebarItems,
    isAuthenticated,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
