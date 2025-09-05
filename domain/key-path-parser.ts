import { KeyPath } from './key-path';

// Domain Abstraction: Parses raw keys to a KeyPath
export interface KeyPathParser {
    parse(rawKey: string): KeyPath;
}


