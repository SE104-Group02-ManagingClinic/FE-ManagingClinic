// src/components/PermissionGuard.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Component bảo vệ nội dung dựa trên quyền
 * 
 * Cách sử dụng đơn giản - chỉ cần truyền feature code từ backend:
 * 
 * <PermissionGuard feature="disease-list">
 *   <DiseaseTable />
 * </PermissionGuard>
 * 
 * <PermissionGuard feature="disease-edit" hide>
 *   <button>Sửa</button>
 * </PermissionGuard>
 * 
 * @param {string|Array<string>} feature - Feature code từ backend (vd: 'disease-list', 'medicine-edit')
 * @param {React.ReactNode} children - Nội dung cần bảo vệ
 * @param {React.ReactNode} fallback - Nội dung hiển thị khi không có quyền (optional)
 * @param {boolean} hide - Ẩn hoàn toàn khi không có quyền (thay vì hiển thị fallback)
 * @param {string} mode - "any" (có 1 trong các features) hoặc "all" (phải có tất cả features)
 * @param {boolean} debug - Hiển thị data-feature attribute cho debugging
 */
const PermissionGuard = ({ 
  feature,
  children, 
  fallback = null,
  hide = false,
  mode = 'any',
  debug = process.env.NODE_ENV === 'development',
}) => {
  const { checkFeature, hasAnyFeature, hasAllFeatures } = useAuth();

  // Nếu không yêu cầu feature gì, cho phép hiển thị
  if (!feature) {
    return <>{children}</>;
  }

  let hasAccess = false;

  if (Array.isArray(feature)) {
    // Kiểm tra nhiều features
    hasAccess = mode === 'all' 
      ? hasAllFeatures(feature) 
      : hasAnyFeature(feature);
  } else {
    // Kiểm tra 1 feature
    hasAccess = checkFeature(feature);
  }

  // Không có quyền
  if (!hasAccess) {
    if (hide) return null;
    return <>{fallback}</>;
  }

  // Có quyền - render với data-feature để debug
  if (debug && feature) {
    const featureAttr = Array.isArray(feature) ? feature.join(',') : feature;
    return (
      <span style={{ display: 'contents' }} data-feature={featureAttr}>
        {children}
      </span>
    );
  }

  return <>{children}</>;
};

/**
 * HOC để wrap component với permission check
 */
export const withFeature = (WrappedComponent, feature, options = {}) => {
  return function FeatureWrappedComponent(props) {
    return (
      <PermissionGuard feature={feature} {...options}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
};

/**
 * Component button có sẵn permission check
 */
export const FeatureButton = ({ 
  feature, 
  children, 
  className = '',
  ...buttonProps 
}) => {
  return (
    <PermissionGuard feature={feature} hide>
      <button className={className} {...buttonProps}>
        {children}
      </button>
    </PermissionGuard>
  );
};

export default PermissionGuard;
