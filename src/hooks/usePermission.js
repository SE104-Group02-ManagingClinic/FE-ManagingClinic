// src/hooks/usePermission.js
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook để kiểm tra quyền trong component logic
 * 
 * Hỗ trợ 2 cách:
 * 1. Feature-based (khuyến nghị): Dùng feature code từ backend
 * 2. Permission-based (legacy): Dùng MaChucNang
 * 
 * @returns {Object} { hasFeature, hasAnyFeature, hasAllFeatures, hasPermission, ... }
 */
export const usePermission = () => {
  const { 
    permissions, 
    features,
    checkPermission, 
    checkFeature,
    hasAnyFeature: authHasAnyFeature,
    hasAllFeatures: authHasAllFeatures,
  } = useAuth();

  /**
   * Kiểm tra có feature cụ thể (từ backend)
   * @param {string} feature - Feature code (vd: 'disease-list')
   */
  const hasFeature = (feature) => {
    return checkFeature(feature);
  };

  /**
   * Kiểm tra có ít nhất 1 trong các features
   * @param {Array<string>} featureList - Danh sách feature codes
   */
  const hasAnyFeature = (featureList) => {
    return authHasAnyFeature(featureList);
  };

  /**
   * Kiểm tra có tất cả các features
   * @param {Array<string>} featureList - Danh sách feature codes
   */
  const hasAllFeatures = (featureList) => {
    return authHasAllFeatures(featureList);
  };

  // ============ Legacy methods (MaChucNang) ============

  /**
   * Kiểm tra có quyền cụ thể (legacy - dùng MaChucNang)
   * @param {string} permission - Mã chức năng
   */
  const hasPermission = (permission) => {
    return checkPermission(permission);
  };

  /**
   * Kiểm tra có ít nhất 1 trong các quyền (legacy)
   * @param {Array<string>} permissionList - Danh sách mã chức năng
   */
  const hasAnyPermission = (permissionList) => {
    if (!Array.isArray(permissionList)) return false;
    return permissionList.some(perm => checkPermission(perm));
  };

  /**
   * Kiểm tra có tất cả các quyền (legacy)
   * @param {Array<string>} permissionList - Danh sách mã chức năng
   */
  const hasAllPermissions = (permissionList) => {
    if (!Array.isArray(permissionList)) return false;
    return permissionList.every(perm => checkPermission(perm));
  };

  return {
    // Feature-based (khuyến nghị)
    hasFeature,
    hasAnyFeature,
    hasAllFeatures,
    features,
    
    // Legacy (MaChucNang)
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
  };
};

export default usePermission;
