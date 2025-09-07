import { describe, it, expect } from 'vitest';
import { JsonToCsvBuilder } from '../../core/domain/json-to-csv';
import { DotBracketKeyPathFormatter } from '../../core/infrastructure/key-path/dot-bracket-key-path-formatter';
import { DefaultJsonToFormDataSerializer } from '../../core/infrastructure/json/default-json-to-formdata-serializer';
import { DefaultCsvFieldEscaper } from '../../core/infrastructure/csv/csv-escaper';

describe('JsonToCsvBuilder', () => {
    it('builds csv from flat json', () => {
        const builder = new JsonToCsvBuilder({
            formatter: new DotBracketKeyPathFormatter(),
            serializer: new DefaultJsonToFormDataSerializer(),
            escaper: new DefaultCsvFieldEscaper(),
        });
        const csv = builder.build({ a: 1, b: 'x' });
        expect(csv).toBe('a,b\n1,x');
    });
});


