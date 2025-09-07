import { KeyPath } from '../../domain/ports/key-path';
import { KeyPathParser } from '../../interfaces/key-path-parser';

export class DotBracketKeyPathParser implements KeyPathParser {
    parse(rawKey: string): KeyPath {
        const segments = rawKey
            .replace(/\[(\d+)\]/g, '.$1')
            .split('.')
            .filter(Boolean);
        return new KeyPath(segments);
    }
}


