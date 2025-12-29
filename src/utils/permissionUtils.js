/**
 * Utility functions để hỗ trợ quản lý phân quyền ở frontend
 * Giúp simplify logic kiểm tra và render tabs dựa trên quyền
 */

/**
 * Hook helper: Tạo tab config với permission checking
 * 
 * @param {Array<Object>} tabsConfig - Mảng config tabs
 * @param {Function} checkFeature - Function từ useAuth() để check feature
 * @returns {Object} { visibleTabs, canViewTab, filterVisibleTabs }
 * 
 * @example
 * const tabs = [
 *   { id: 'users', label: '👥 Quản lý', features: ['user-list', 'user-edit'] },
 *   { id: 'perms', label: '🔐 Quyền', features: ['permission-assign'] },
 * ];
 * 
 * const { visibleTabs } = useTabPermissions(tabs, checkFeature);
 * // visibleTabs = tabs mà user có quyền xem
 */
export const createTabPermissionHelper = (tabsConfig, checkFeature) => {
  /**
   * Check xem user có quyền xem một tab không
   * (cần ít nhất 1 feature trong tab.features)
   */
  const canViewTab = (tabFeatures) => {
    if (!Array.isArray(tabFeatures) || tabFeatures.length === 0) {
      return true; // Nếu không yêu cầu feature, cho phép xem
    }
    return tabFeatures.some(feature => checkFeature(feature));
  };

  /**
   * Lọc ra những tabs mà user có quyền xem
   */
  const visibleTabs = tabsConfig.filter(tab => canViewTab(tab.features));

  /**
   * Check xem user có quyền xem tab cụ thể không
   */
  const canViewTabById = (tabId) => {
    const tab = tabsConfig.find(t => t.id === tabId);
    return tab ? canViewTab(tab.features) : false;
  };

  /**
   * Lấy tab đầu tiên mà user có quyền xem
   * Hữu dụng cho việc set default activeTab
   */
  const getFirstVisibleTabId = () => {
    return visibleTabs.length > 0 ? visibleTabs[0].id : null;
  };

  /**
   * Check xem activeTab có hợp lệ không
   * Nếu không, trả về tab đầu tiên có quyền
   */
  const getValidActiveTab = (currentActiveTab) => {
    if (visibleTabs.find(t => t.id === currentActiveTab)) {
      return currentActiveTab;
    }
    return getFirstVisibleTabId();
  };

  return {
    visibleTabs,
    canViewTab,
    canViewTabById,
    getFirstVisibleTabId,
    getValidActiveTab,
  };
};

/**
 * Validate rằng một tab configuration hợp lệ
 * Giúp catch lỗi cấu hình sớm
 * 
 * @param {Object} tab - Tab config object
 * @returns {boolean} - true nếu hợp lệ
 */
export const isValidTabConfig = (tab) => {
  if (!tab || typeof tab !== 'object') return false;
  if (!tab.id || typeof tab.id !== 'string') return false;
  if (!tab.label || typeof tab.label !== 'string') return false;
  // features là optional, nhưng nếu có thì phải là array
  if (tab.features && !Array.isArray(tab.features)) return false;
  return true;
};

/**
 * Validate toàn bộ tabs config array
 * 
 * @param {Array<Object>} tabsConfig - Mảng config tabs
 * @returns {Object} - { isValid: boolean, errors: Array<string> }
 */
export const validateTabsConfig = (tabsConfig) => {
  const errors = [];

  if (!Array.isArray(tabsConfig)) {
    return {
      isValid: false,
      errors: ['Tabs config phải là một array'],
    };
  }

  if (tabsConfig.length === 0) {
    return {
      isValid: false,
      errors: ['Tabs config không được rỗng'],
    };
  }

  // Check unique IDs
  const ids = tabsConfig.map(t => t.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    errors.push('Các tab ID phải là duy nhất');
  }

  // Check individual tab configs
  tabsConfig.forEach((tab, index) => {
    if (!isValidTabConfig(tab)) {
      errors.push(`Tab ở vị trí ${index} không hợp lệ`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Helper để tạo tab config từ simple list
 * 
 * @param {Array<{id, label, features, icon}>} tabDefs - Định nghĩa tab đơn giản
 * @returns {Array<Object>} - Mảng tab config chuẩn
 * 
 * @example
 * const tabs = createTabConfig([
 *   { id: 'users', label: 'Users', features: ['user-list'] },
 *   { id: 'groups', label: 'Groups', features: ['group-manage'] },
 * ]);
 */
export const createTabConfig = (tabDefs) => {
  return tabDefs.map((def) => ({
    id: def.id,
    label: def.label,
    icon: def.icon || '',
    features: def.features || [],
  }));
};

/**
 * Debug helper: In ra tab config và visibility status
 * Chỉ hoạt động ở development mode
 * 
 * @param {string} pageName - Tên page (để dễ identify)
 * @param {Array<Object>} tabsConfig - Tabs config
 * @param {Array<Object>} visibleTabs - Visible tabs (output của createTabPermissionHelper)
 * @param {Array<string>} userFeatures - Features của user (từ useAuth().features)
 */
export const debugTabPermissions = (pageName, tabsConfig, visibleTabs, userFeatures) => {
  if (process.env.NODE_ENV !== 'development') return;

  console.group(`🔐 [${pageName}] Tab Permissions Debug`);
  console.log('User Features:', userFeatures);
  console.log('All Tabs:', tabsConfig);
  console.log('Visible Tabs:', visibleTabs);

  tabsConfig.forEach(tab => {
    const hasAccess = visibleTabs.some(t => t.id === tab.id);
    const featureStatus = (tab.features || []).map(f => ({
      feature: f,
      hasAccess: userFeatures.includes(f),
    }));
    console.log(
      `${hasAccess ? '✅' : '❌'} ${tab.label} (${tab.id})`,
      featureStatus
    );
  });

  console.groupEnd();
};

/**
 * Format tab metadata cho data attributes (debugging)
 * 
 * @param {Object} tab - Tab config
 * @returns {string} - Formatted string cho data-* attributes
 * 
 * @example
 * <button data-feature={formatTabFeatures(tab)}>
 */
export const formatTabFeatures = (tab) => {
  if (!tab.features || tab.features.length === 0) return '';
  return tab.features.join(',');
};
