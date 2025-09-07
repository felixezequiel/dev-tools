import { KeyPath } from '../domain/ports/key-path';

// Domain Abstraction: Parses raw keys to a KeyPath
export interface KeyPathParser {
    parse(rawKey: string): KeyPath;
}


