// Domain Abstraction: Formats a list of key segments into a single key string
export interface KeyPathFormatter {
    format(segments: string[]): string;
}


