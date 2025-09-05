import { describe, it, expect } from 'vitest';
import { JsonToCsvBuilder } from '../../application/json-to-csv';
import { DotBracketKeyPathFormatter } from '../../infrastructure/key-path/dot-bracket-key-path-formatter';
import { DefaultJsonToFormDataSerializer } from '../../infrastructure/json/default-json-to-formdata-serializer';
import { DefaultCsvFieldEscaper } from '../../infrastructure/csv/csv-escaper';

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


