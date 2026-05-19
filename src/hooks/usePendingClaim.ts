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

    // Mark as in-progress immediately to prevent concurrent attempts within this
    // component lifetime. The token stays in localStorage until the call resolves
    // so that a page-refresh can retry on transient errors (network, 5xx).
    claimedRef.current = true

    console.info('[usePendingClaim] Claiming temporary preview token', token.slice(0, 8) + '…')

    claimTemporaryPreview(token)
      .then((result) => {
        console.info('[usePendingClaim] Claim succeeded', result)
        localStorage.removeItem(PENDING_CLAIM_KEY)
        localStorage.removeItem(DEMO_STORAGE_KEY)
        const url = result.redirect_url ?? result.redirectUrl
        if (url) {
          navigateToResult(url, navigate)
        } else {
          // Backend succeeded but sent no redirect — go to dashboard so the user
          // can see the newly created project in the project list.
          console.warn('[usePendingClaim] No redirect_url in claim response, falling back to /app')
          navigate('/app', { replace: true })
        }
      })
      .catch((err) => {
        let msg = 'No se pudo importar la experiencia temporal.'

        if (err instanceof ApiError) {
          console.error('[usePendingClaim] Claim failed — HTTP', err.status, err.message)
          if (err.status === 404 || err.status === 410) {
            // Token expired or already used — remove it so we don't retry endlessly.
            localStorage.removeItem(PENDING_CLAIM_KEY)
            msg = 'La experiencia temporal expiró. Puedes crear una nueva en /try.'
          }
          // For 401, 5xx, network errors: keep the token so a page-refresh can retry.
        } else {
          console.error('[usePendingClaim] Unexpected error during claim', err)
        }

        useGeoStore.getState().addToast(msg, 'error')
      })
  }, [isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps
}
