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
    // Relative path — pass straight to React Router
    navigate(url, { replace: true })
  }
}

/**
 * After the user becomes fully authenticated, checks localStorage for a pending
 * temporary preview token and claims it against the backend.
 *
 * Waits for isAuthenticated + currentUser + !isLoading + isInitialized
 * to all be satisfied before firing — avoids false negatives during the
 * brief auth-loading window.
 *
 * Must be called inside a component rendered for ALL protected routes (ProtectedRoute).
 */
export function usePendingClaim() {
  const { isAuthenticated, currentUser, isLoading, isInitialized } = useAuthStore()
  const navigate = useNavigate()
  const claimedRef = useRef(false)

  const readyToCheck = isInitialized && !isLoading && isAuthenticated && currentUser !== null

  useEffect(() => {
    console.info(
      '[usePendingClaim] effect fired — readyToCheck:', readyToCheck,
      '| isAuthenticated:', isAuthenticated,
      '| currentUser:', currentUser?.email ?? null,
      '| isLoading:', isLoading,
      '| isInitialized:', isInitialized,
      '| claimedRef:', claimedRef.current,
    )

    if (!readyToCheck) {
      console.info('[usePendingClaim] Not ready yet — skipping claim check')
      return
    }

    if (claimedRef.current) {
      console.info('[usePendingClaim] Already claimed in this session — skipping')
      return
    }

    const token = localStorage.getItem(PENDING_CLAIM_KEY)
    console.info('[usePendingClaim] localStorage token:', token ? token.slice(0, 8) + '…' : null)

    if (!token) {
      console.info('[usePendingClaim] No pending claim token found — nothing to do')
      return
    }

    // Mark as in-progress to prevent concurrent attempts within this component
    // lifetime. The token stays in localStorage until the call resolves so that
    // a page-refresh can retry on transient errors (network, 5xx).
    claimedRef.current = true

    console.info('[usePendingClaim] Claiming temporary preview…', token.slice(0, 8) + '…')

    claimTemporaryPreview(token)
      .then((result) => {
        console.info('[usePendingClaim] Claim succeeded:', result)
        localStorage.removeItem(PENDING_CLAIM_KEY)
        localStorage.removeItem(DEMO_STORAGE_KEY)
        const url = result.redirect_url ?? result.redirectUrl
        if (url) {
          console.info('[usePendingClaim] Navigating to:', url)
          navigateToResult(url, navigate)
        } else {
          console.warn('[usePendingClaim] No redirect_url in response — falling back to /app')
          navigate('/app', { replace: true })
        }
      })
      .catch((err) => {
        let msg = 'No se pudo importar la experiencia temporal.'

        if (err instanceof ApiError) {
          console.error('[usePendingClaim] Claim failed — HTTP', err.status, err.message)
          if (err.status === 404 || err.status === 410) {
            // Token expired or already claimed — clear it so we don't retry
            localStorage.removeItem(PENDING_CLAIM_KEY)
            msg = 'La experiencia temporal expiró. Puedes crear una nueva en /try.'
          }
          // For 401, 5xx, network: keep token in localStorage — page refresh can retry
        } else {
          console.error('[usePendingClaim] Unexpected error:', err)
        }

        useGeoStore.getState().addToast(msg, 'error')
      })
  // Re-run whenever any auth field that affects readiness changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToCheck])
}
