import { createContext, useContext } from 'react'

export type EditorMode = 'real' | 'demo'

const EditorModeContext = createContext<EditorMode>('real')

export const useEditorMode = () => useContext(EditorModeContext)

export default EditorModeContext
