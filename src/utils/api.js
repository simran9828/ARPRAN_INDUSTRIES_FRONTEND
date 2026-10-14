// Centralized API Base URL configuration
// Base URL for ARPRAN Industries backend
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'https://arpran-industries-backend.onrender.com'
).replace(/\/+$/, '');

/**
 * Returns the full API URL based on API_BASE_URL
 * @param {string} endpoint - API endpoint (e.g. '/api/admin/login')
 * @returns {string} - Full API URL
 */
export function getApiUrl(endpoint) {
  if (!endpoint) return '';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

/**
 * Safely parses response JSON, handling empty bodies, HTML error pages, and network issues gracefully
 * @param {Response} res - Fetch Response object
 * @returns {Promise<{ ok: boolean, status: number, data: any, error: string|null }>}
 */
export async function safeParseResponse(res) {
  if (!res) {
    return { ok: false, status: 0, data: null, error: 'No response received from server' };
  }

  const status = res.status;
  const contentType = res.headers.get('content-type') || '';

  let text = '';
  try {
    text = await res.text();
  } catch (err) {
    return {
      ok: false,
      status,
      data: null,
      error: `Failed to read server response (${status} ${res.statusText || 'Error'})`
    };
  }

  if (!text || !text.trim()) {
    if (res.ok) {
      return { ok: true, status, data: {}, error: null };
    }
    return {
      ok: false,
      status,
      data: null,
      error: `Server returned an empty response (${status} ${res.statusText || 'Error'}). If the backend is waking up, please wait a moment and try again.`
    };
  }

  // Non-JSON content (e.g., HTML 404/502 page)
  if (!contentType.includes('application/json') && text.trim().startsWith('<')) {
    return {
      ok: false,
      status,
      data: null,
      error: `Server returned an HTML page (${status} ${res.statusText || 'Error'}) instead of JSON. The backend may be starting up.`
    };
  }

  try {
    const json = JSON.parse(text);
    return {
      ok: res.ok,
      status,
      data: json,
      error: res.ok ? null : (json.error || json.message || `Request failed with status ${status}`)
    };
  } catch (parseErr) {
    return {
      ok: false,
      status,
      data: null,
      error: `Invalid JSON response from server (${status}): ${text.slice(0, 100)}`
    };
  }
}
