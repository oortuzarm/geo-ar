import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const PENDING_CLAIM_KEY = 'pendingTemporaryPreviewToken'

/**
 * After the user becomes fully authenticated, checks localStorage for a pending
 * temporary-preview token and redirects to /app/select-plan so the user can
 * choose a plan before the project is imported.
 *
 * Claim execution (POST /api/temporary_previews/:token/claim) now happens inside
 * SelectPlanPage after the user picks a plan. This hook is intentionally thin:
 * it only detects the token and routes the user to the right screen.
 *
 * Must be called inside a component rendered for ALL protected routes (ProtectedRoute).
 */
export function usePendingClaim() {
  const { isAuthenticated, currentUser, isLoading, isInitialized } = useAuthStore()
  const navigate = useNavigate()
  const redirectedRef = useRef(false)

  const readyToCheck = isInitialized && !isLoading && isAuthenticated && currentUser !== null

  useEffect(() => {
    console.info(
      '[usePendingClaim] effect fired — readyToCheck:', readyToCheck,
      '| currentUser:', currentUser?.email ?? null,
      '| redirectedRef:', redirectedRef.current,
    )

    if (!readyToCheck || redirectedRef.current) return

    const token = localStorage.getItem(PENDING_CLAIM_KEY)
    console.info('[usePendingClaim] localStorage token:', token ? token.slice(0, 8) + '…' : null)

    if (!token) {
      console.info('[usePendingClaim] No pending claim token — nothing to do')
      return
    }

    // Mark as handled for this session to prevent redirect loops on re-renders.
    // The token stays in localStorage so SelectPlanPage can read it even after a refresh.
    redirectedRef.current = true

    console.info('[usePendingClaim] Redirecting to plan selection for token', token.slice(0, 8) + '…')
    navigate(
      `/app/select-plan?claim_preview_token=${encodeURIComponent(token)}`,
      { replace: true },
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToCheck])
}
