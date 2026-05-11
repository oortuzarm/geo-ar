export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<T> {
  const { timeout = 10_000, ...init } = options
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(url, {
      ...init,
      credentials: 'include',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...init.headers },
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new ApiError(res.status, body || res.statusText)
    }

    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout')
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}
