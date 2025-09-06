export function SyntaxHighlighterWrapper({ code }: { code: string }) {
    return (
        <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
            {code}
        </pre>
    )
}


