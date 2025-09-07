import { useMemo } from 'react'
import { DiffEditor } from '@monaco-editor/react'
import { useThemeContext } from '@/components/common/ThemeProvider'

export interface DiffCodeEditorProps {
    original: string
    modified: string
    language?: string
    height?: number | string
    onChangeOriginal?: (value: string) => void
    onChangeModified?: (value: string) => void
}

export function DiffCodeEditor({ original, modified, language = 'plaintext', height = 360, onChangeOriginal, onChangeModified }: DiffCodeEditorProps) {
    const { theme } = useThemeContext()
    const monacoTheme = useMemo(() => (theme === 'dark' ? 'vs-dark' : 'vs-light'), [theme])

    return (
        <div className="rounded-md border overflow-hidden">
            <DiffEditor
                original={original}
                modified={modified}
                language={language}
                theme={monacoTheme}
                height={height}
                options={{
                    renderSideBySide: true,
                    readOnly: false,
                    originalEditable: true,
                    wordWrap: 'on',
                    minimap: { enabled: false },
                    fontSize: 13,
                    smoothScrolling: true,
                    scrollBeyondLastLine: false,
                    renderWhitespace: 'selection',
                    renderControlCharacters: true,
                }}
                onMount={(editor) => {
                    const originalEditor = editor.getOriginalEditor()
                    const modifiedEditor = editor.getModifiedEditor()
                    const originalModel = originalEditor.getModel()
                    const modifiedModel = modifiedEditor.getModel()
                    if (originalModel && onChangeOriginal) {
                        originalModel.onDidChangeContent(() => {
                            onChangeOriginal(originalModel.getValue())
                        })
                    }
                    if (modifiedModel && onChangeModified) {
                        modifiedModel.onDidChangeContent(() => {
                            onChangeModified(modifiedModel.getValue())
                        })
                    }
                }}
            />
        </div>
    )
}

export default DiffCodeEditor


