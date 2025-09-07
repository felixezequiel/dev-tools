import { describe, it, expect } from 'vitest';
import { DataReBuilder } from '../../core/domain/data-rebuilder';
import { JsonDataEntrySource } from '../../core/infrastructure/entry-sources/json-data-entry-source';
import { CsvDataEntrySource } from '../../core/infrastructure/entry-sources/csv-data-entry-source';

describe('RebuildPipeline integration', () => {
    it('json -> formdata', () => {
        const service = new DataReBuilder();
        const fd = service.rebuildFrom(new JsonDataEntrySource({ a: 1, arr: ['x'] })).toFormData();
        const entries = Array.from(fd.entries());
        expect(entries).toContainEqual(['a', '1']);
        expect(entries).toContainEqual(['arr[0]', 'x']);
    });

    it('csv -> json', () => {
        const service = new DataReBuilder();
        const csv = 'a,b\n1,2';
        const json = service.rebuildFrom(new CsvDataEntrySource(csv)).toJSON();
        expect(json.a).toBe('1');
        expect(json.b).toBe('2');
    });
});


