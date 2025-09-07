import { describe, it, expect } from 'vitest';
import { EntrySourceToJsonConverter } from '../../core/domain/converters/entry-source-to-json-converter';
import { DotBracketKeyPathParser } from '../../core/infrastructure/key-path/dot-bracket-key-path-parser';
import { LiteralStringValueCoercer } from '../../core/infrastructure/value-coercers/literal-string-value-coercer';
import { NestedPathStructureMutator } from '../../core/infrastructure/structure-mutators/nested-path-structure-mutator';
import { EntrySource } from '../../core/interfaces/entry-source';

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


