// export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export async function apiGet<T>(endpoint: string): Promise<T> {
//   const res = await fetch(`${API_URL}${endpoint}`, { cache: "no-store" });
//   if (!res.ok) throw new Error(`GET ${endpoint} failed`);
//   return res.json();
// }

// export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
//   const res = await fetch(`${API_URL}${endpoint}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data)
//   });
//   if (!res.ok) throw new Error(`POST ${endpoint} failed`);
//   return res.json();
// }

// export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
//   const res = await fetch(`${API_URL}${endpoint}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data)
//   });
//   if (!res.ok) throw new Error(`PUT ${endpoint} failed`);
//   return res.json();
// }

// export async function apiDelete<T>(endpoint: string): Promise<T> {
//   const res = await fetch(`${API_URL}${endpoint}`, { method: "DELETE" });
//   if (!res.ok) throw new Error(`DELETE ${endpoint} failed`);
//   return res.json();
// }

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Helper to get auth token from cookies
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1] || null;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

   if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API request failed: ${res.statusText}`
    );
  }

  return res.json();
}

// Auth-specific API functions
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest<{
      status: string;
      message: string;
      data: {
        user: any;
        token: string;
      };
    }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) =>
    apiRequest<{
      status: string;
      message: string;
      data: {
        user: any;
        token: string;
      };
    }>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getProfile: () =>
    apiRequest<{
      status: string;
      message: string;
      data: any;
    }>('/profile', {
      method: 'GET',
    }),
};

// Existing API functions (updated)
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

// Cookie helper functions
export function setAuthToken(token: string, expiresInDays = 1) {
  const date = new Date();
  date.setTime(date.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `auth_token=${token}; ${expires}; path=/; SameSite=Strict`;
}

export function removeAuthToken() {
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export function getToken(): string | null {
  return getAuthToken();
}