import { KeyPathFormatter } from '../../interfaces/key-path-formatter';

export class DotBracketKeyPathFormatter implements KeyPathFormatter {
    format(segments: string[]): string {
        if (segments.length === 0) return '';
        const out: string[] = [];
        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];
            const isIndex = /^\d+$/.test(seg);
            if (i === 0) {
                out.push(isIndex ? `[${seg}]` : seg);
            } else if (isIndex) {
                out.push(`[${seg}]`);
            } else {
                out.push(`.${seg}`);
            }
        }
        return out.join('');
    }
}


