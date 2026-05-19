import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { claimTemporaryPreview } from '../services/temporaryPreviewsApi'
import { useGeoStore } from '../store/geoStore'
import { ApiError } from '../lib/apiFetch'
import { DEMO_STORAGE_KEY } from '../pages/Try/TryPage'

export const PENDING_CLAIM_KEY = 'pendingTemporaryPreviewToken'

/** Resolves both absolute same-origin URLs and relative paths via React Router. */
function navigateToResult(url: string, navigate: ReturnType<typeof useNavigate>) {
  try {
    const parsed = new URL(url)
    if (parsed.origin === window.location.origin) {
      navigate(parsed.pathname + parsed.search, { replace: true })
    } else {
      window.location.href = url
    }
  } catch {
    navigate(url, { replace: true })
  }
}

/**
 * After the user becomes authenticated, checks localStorage for a pending
 * temporary preview token and claims it against the backend.
 * On success  → navigates to the editor of the newly created project.
 * On expiry   → shows a toast and clears the token.
 * On other errors → shows a generic toast.
 *
 * Must be called inside a component that is always rendered while authenticated
 * (e.g. ProtectedRoute).
 */
export function usePendingClaim() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const claimedRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated || claimedRef.current) return
    const token = localStorage.getItem(PENDING_CLAIM_KEY)
    if (!token) return

    claimedRef.current = true
    localStorage.removeItem(PENDING_CLAIM_KEY)

    claimTemporaryPreview(token)
      .then((result) => {
        localStorage.removeItem(DEMO_STORAGE_KEY)
        const url = result.redirect_url ?? result.redirectUrl
        if (url) navigateToResult(url, navigate)
      })
      .catch((err) => {
        let msg = 'No se pudo importar la experiencia temporal.'
        if (err instanceof ApiError && (err.status === 404 || err.status === 410)) {
          msg = 'La experiencia temporal expiró. Puedes crear una nueva en /try.'
        }
        useGeoStore.getState().addToast(msg, 'error')
      })
  }, [isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps
}
