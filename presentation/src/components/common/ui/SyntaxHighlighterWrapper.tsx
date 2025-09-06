export function SyntaxHighlighterWrapper({ code }: { code: string }) {
    return (
        <pre className="text-sm font-mono whitespace-pre min-w-full overflow-x-auto">
            {code}
        </pre>
    )
}


