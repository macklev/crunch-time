const API_BASE_URL = import.meta.env.VITE_API_ROOT || 'http://localhost:3000'

export default function rest<T>(
  url: string,
  data?: unknown,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return fetch(url, {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  }).then((res) => {
    if (!res.ok) {
      return res.text().then((text) => {
        throw new Error(text)
      })
    }

    return res.json() as Promise<T>
  })
}

export function api<T>(
  endpoint: string,
  data?: unknown,
  options: RequestInit = {},
) {
  return rest<T>(`${API_BASE_URL}${endpoint}`, data, options)
}
