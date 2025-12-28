// src/api/apiClient.js

/**
 * API Client với tự động gắn token vào header
 */

/**
 * Lấy token từ localStorage
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Tạo headers với token
 */
const getAuthHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json; charset=utf-8',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * API Request với token tự động
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<any>}
 */
export const apiRequest = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  // Xử lý lỗi 401 Unauthorized - token hết hạn
  if (response.status === 401) {
    // Xóa token và redirect về login
    localStorage.removeItem('token');
    localStorage.removeItem('authData');
    window.location.href = '/';
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }

  return response;
};

/**
 * GET request
 */
export const apiGet = async (url) => {
  return apiRequest(url, {
    method: 'GET',
  });
};

/**
 * POST request
 */
export const apiPost = async (url, data) => {
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT request
 */
export const apiPut = async (url, data) => {
  return apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request
 */
export const apiDelete = async (url, data) => {
  return apiRequest(url, {
    method: 'DELETE',
    body: data ? JSON.stringify(data) : undefined,
  });
};

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  request: apiRequest,
};
