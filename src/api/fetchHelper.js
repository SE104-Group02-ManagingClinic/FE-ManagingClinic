// src/api/fetchHelper.js
/**
 * Helper function để gọi fetch API với UTF-8 encoding
 */

export const UTF8Headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Accept': 'application/json; charset=utf-8',
};

export const fetchAPI = async (url, options = {}) => {
  const defaultOptions = {
    headers: UTF8Headers,
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...UTF8Headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    
    const text = await response.text();
    
    const contentType = response.headers.get('content-type') || '';
    let data;
    
    if (contentType.includes('application/json')) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('JSON parse error:', e, 'text:', text);
        data = { message: text };
      }
    } else {
      data = { message: text };
    }

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data,
      text,
      json: async () => data,
    };
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const fetchGet = (url) => {
  return fetchAPI(url, {
    method: 'GET',
  });
};

export const fetchPost = (url, data) => {
  return fetchAPI(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const fetchPut = (url, data) => {
  return fetchAPI(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const fetchDelete = (url) => {
  return fetchAPI(url, {
    method: 'DELETE',
  });
};

export default fetchAPI;