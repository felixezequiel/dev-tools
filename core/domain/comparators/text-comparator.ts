import { InvisibleCharIssue, TextComparator, TextComparatorOptions, TextComparatorResult, TextDiffLine } from '../ports/diff';

const INVISIBLE_CHAR_TABLE: Array<{ re: RegExp; name: string }> = [
    { re: /\u00A0/g, name: 'NO-BREAK SPACE (U+00A0)' },
    { re: /\u2007/g, name: 'FIGURE SPACE (U+2007)' },
    { re: /\u202F/g, name: 'NARROW NO-BREAK SPACE (U+202F)' },
    { re: /\u200B/g, name: 'ZERO WIDTH SPACE (U+200B)' },
    { re: /\u200C/g, name: 'ZERO WIDTH NON-JOINER (U+200C)' },
    { re: /\u200D/g, name: 'ZERO WIDTH JOINER (U+200D)' },
    { re: /\uFEFF/g, name: 'ZERO WIDTH NO-BREAK SPACE (U+FEFF)' }
];

export class DefaultTextComparator implements TextComparator {
    compare(leftText: string, rightText: string, options?: TextComparatorOptions): TextComparatorResult {
        const normalize = options?.normalizeLineEndings !== false;
        const tabSize = options?.tabSize ?? 4;

        const left = normalize ? this.normalizeLineEndings(leftText) : leftText;
        const right = normalize ? this.normalizeLineEndings(rightText) : rightText;

        const leftLines = left.split('\n').map(l => this.expandTabs(l, tabSize));
        const rightLines = right.split('\n').map(l => this.expandTabs(l, tabSize));

        const lines: TextDiffLine[] = [];
        let added = 0, removed = 0, changed = 0;

        const len = Math.max(leftLines.length, rightLines.length);
        for (let i = 0; i < len; i++) {
            const l = leftLines[i];
            const r = rightLines[i];
            const lineNumber = i + 1;

            if (l === undefined) {
                const issues = r ? this.detectInvisible(r) : [];
                lines.push({ kind: 'added', lineNumber, right: r, issues });
                added++;
                continue;
            }
            if (r === undefined) {
                const issues = l ? this.detectInvisible(l) : [];
                lines.push({ kind: 'removed', lineNumber, left: l, issues });
                removed++;
                continue;
            }
            if (l === r) {
                const issues = this.detectInvisible(l);
                lines.push({ kind: 'equal', lineNumber, left: l, right: r, issues: issues.length ? issues : undefined });
            } else {
                const issues = [...this.detectInvisible(l), ...this.detectInvisible(r)];
                lines.push({ kind: 'changed', lineNumber, left: l, right: r, issues: issues.length ? issues : undefined });
                changed++;
            }
        }

        // Recalculate summary using LCS-based estimation to better reflect add/remove vs change
        const lcsLen = this.lcsLength(leftLines, rightLines);
        const summary = {
            added: Math.max(0, rightLines.length - lcsLen),
            removed: Math.max(0, leftLines.length - lcsLen),
            changed: Math.max(0, Math.min(leftLines.length, rightLines.length) - lcsLen)
        };

        return { lines, summary };
    }

    private normalizeLineEndings(text: string): string {
        return text.replace(/\r\n?/g, '\n');
    }

    private expandTabs(line: string, tabSize: number): string {
        return line.replace(/\t/g, ' '.repeat(tabSize));
    }

    private detectInvisible(line: string): InvisibleCharIssue[] {
        const issues: InvisibleCharIssue[] = [];
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            const code = ch.codePointAt(0)!;
            const isInvisible = INVISIBLE_CHAR_TABLE.find(entry => entry.re.test(ch));
            if (isInvisible) {
                issues.push({ index: i, char: ch, codePoint: 'U+' + code.toString(16).toUpperCase().padStart(4, '0'), name: isInvisible.name });
            }
        }
        return issues;
    }

    private lcsLength(a: string[], b: string[]): number {
        const n = a.length, m = b.length;
        const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= m; j++) {
                if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
                else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        return dp[n][m];
    }
}


