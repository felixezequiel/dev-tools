import { describe, it, expect } from 'vitest';
import { JsonDataEntrySource } from '../../../core/infrastructure/entry-sources/json-data-entry-source';

describe('JsonDataEntrySource', () => {
    it('emits flattened entries from json', () => {
        const src = new JsonDataEntrySource({ user: { name: 'A', tags: ['x'] } });
        const entries = Array.from(src.entries());
        expect(entries).toContainEqual(['user.name', 'A']);
        expect(entries).toContainEqual(['user.tags[0]', 'x']);
    });
});


