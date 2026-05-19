// ─── EditorModeContext ────────────────────────────────────────────────────────
//
// Single source of truth for the current editor mode, consumed by any
// sub-component that needs to branch on demo vs real behavior.
//
// Allowed uses of `editorMode`:
//   'demo'  → block Vercel Blob uploads (use base64 or show upsell)
//             → restrict image fields with blocked={true} in ImageField
//             → gate media uploads in GeoPointForm
//             → any feature that requires a paid account
//
//   'real'  → full upload pipeline (Vercel Blob via /api/upload)
//             → no point-count cap
//             → publish/draft status toggle
//             → media file uploads (video, audio, files)
//
// NOT allowed uses — never gate these on editorMode:
//   • Layout, tab structure, sidebar panels
//   • Map interactions or GeoPointForm fields
//   • ProjectPanel text fields (title, shareText, initialViewMode)
//   • Any UX that should be consistent across both modes
//
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext } from 'react'

export type EditorMode = 'real' | 'demo'

const EditorModeContext = createContext<EditorMode>('real')

export const useEditorMode = () => useContext(EditorModeContext)

export default EditorModeContext
