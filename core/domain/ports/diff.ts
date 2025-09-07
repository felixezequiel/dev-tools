export type DiffKind = 'equal' | 'added' | 'removed' | 'changed' | 'moved' | 'type-changed';

export interface DiffEntry<TPath = string> {
    kind: DiffKind;
    path: TPath; // dot/bracket notation path
    left?: any;
    right?: any;
    message?: string;
}

export interface JsonComparatorOptions {
    // When true, ignore ordering of array elements if possible by matching objects by keys
    ignoreArrayOrder?: boolean;
    // When true, ignore differences in whitespace-only strings
    ignoreWhitespaceOnlyChanges?: boolean;
    // Keys to ignore entirely
    ignoreKeys?: string[];
}

export interface JsonComparator {
    compare(left: unknown, right: unknown, options?: JsonComparatorOptions): DiffEntry[];
}

export interface InvisibleCharIssue {
    index: number;
    char: string; // actual character
    codePoint: string; // e.g. U+00A0
    name: string; // best-effort human readable name
}

export interface TextDiffLine {
    lineNumber: number;
    kind: 'equal' | 'added' | 'removed' | 'changed';
    left?: string;
    right?: string;
    issues?: InvisibleCharIssue[];
}

export interface TextComparatorResult {
    lines: TextDiffLine[];
    summary: {
        added: number;
        removed: number;
        changed: number;
    };
}

export interface TextComparatorOptions {
    // Normalize line endings before diffing
    normalizeLineEndings?: boolean;
    // Treat tabs and spaces equivalently for the purposes of diff
    tabSize?: number;
}

export interface TextComparator {
    compare(leftText: string, rightText: string, options?: TextComparatorOptions): TextComparatorResult;
}


