import { describe, it, expect } from 'vitest';
import { EntrySourceToJsonConverter } from '../../application/entry-source-to-json-converter';
import { DotBracketKeyPathParser } from '../../infrastructure/key-path/dot-bracket-key-path-parser';
import { LiteralStringValueCoercer } from '../../infrastructure/value-coercers/literal-string-value-coercer';
import { NestedPathStructureMutator } from '../../infrastructure/structure-mutators/nested-path-structure-mutator';
import { EntrySource } from '../../domain/entry-source';

class ArrayEntrySource implements EntrySource<string, unknown> {
    constructor(private pairs: Array<[string, unknown]>) { }
    entries(): Iterable<[string, unknown]> { return this.pairs; }
}

describe('EntrySourceToJsonConverter', () => {
    it('builds json object from entries', () => {
        const converter = new EntrySourceToJsonConverter({
            parser: new DotBracketKeyPathParser(),
            coercer: new LiteralStringValueCoercer(),
            mutator: new NestedPathStructureMutator()
        });

        const src = new ArrayEntrySource([
            ['user.name', 'John'],
            ['user.tags[0]', 'a'],
            ['user.tags[1]', 'b']
        ]);

        const json = converter.convert(src);
        expect(json.user.name).toBe('John');
        expect(json.user.tags).toEqual(['a', 'b']);
    });
});


