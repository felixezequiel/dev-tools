import { describe, it, expect } from 'vitest';
import { DataReBuilder } from '../../application/service';
import { JsonDataEntrySource } from '../../infrastructure/entry-sources/json-data-entry-source';

describe('RebuildPipeline toCsv', () => {
    it('json -> csv', () => {
        const service = new DataReBuilder();
        const csv = service.rebuildFrom(new JsonDataEntrySource({ a: 1, b: 'x' })).toCsv();
        expect(csv).toBe('a,b\n1,x');
    });
});


