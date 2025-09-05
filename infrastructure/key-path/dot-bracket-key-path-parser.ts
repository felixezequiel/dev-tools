import { KeyPath } from '../../domain/key-path';
import { KeyPathParser } from '../../domain/key-path-parser';

export class DotBracketKeyPathParser implements KeyPathParser {
    parse(rawKey: string): KeyPath {
        const segments = rawKey
            .replace(/\[(\d+)\]/g, '.$1')
            .split('.')
            .filter(Boolean);
        return new KeyPath(segments);
    }
}


