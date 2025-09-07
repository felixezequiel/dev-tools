import { useMemo } from 'react'
import Editor from '@monaco-editor/react'
import { useThemeContext } from '@/components/common/ThemeProvider'

export interface CodeEditorProps {
    value: string
    language?: string
    onChange?: (value: string) => void
    height?: number | string
    readOnly?: boolean
}

export function CodeEditor({ value, language = 'json', onChange, height = 300, readOnly }: CodeEditorProps) {
    const { theme } = useThemeContext()
    const monacoTheme = useMemo(() => (theme === 'dark' ? 'vs-dark' : 'vs-light'), [theme])

    return (
        <div className="rounded-md border overflow-hidden">
            <Editor
                value={value}
                defaultLanguage={language}
                language={language}
                onChange={(val) => onChange?.(val ?? '')}
                height={height}
                theme={monacoTheme}
                options={{
                    wordWrap: 'on',
                    minimap: { enabled: false },
                    fontSize: 13,
                    smoothScrolling: true,
                    readOnly,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    renderWhitespace: 'selection',
                    renderControlCharacters: true
                }}
            />
        </div>
    )
}
