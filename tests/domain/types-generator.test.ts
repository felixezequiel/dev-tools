import { describe, it, expect } from 'vitest';
import { TypesGeneratorService } from '../../core/application/types-generator-service';

describe('TypesGeneratorService', () => {
    it('generates TS and Zod from simple JSON object', () => {
        const gen = new TypesGeneratorService();
        const sample = { id: 1, name: 'John', email: 'john@example.com', tags: ['a', 'b'] };
        const { ts, zod } = gen.generateAll(sample, { rootName: 'User' });
        expect(ts).toContain('export interface User');
        expect(ts).toContain('id: number');
        expect(ts).toContain('name: string');
        expect(zod).toContain('export const UserSchema');
        expect(zod).toContain("z.string().email()");
    });
    it('quotes invalid TS identifiers in props and emits valid Zod keys', () => {
        const gen = new TypesGeneratorService();
        const sample = { 'react-router-dom': 'x', '@scoped/pkg': 'y' } as any;
        const { ts, zod } = gen.generateAll(sample, { rootName: 'Pkg' });
        expect(ts).toContain('  "react-router-dom": string');
        expect(ts).toContain('  "@scoped/pkg": string');
        expect(zod).toContain('"react-router-dom": z.string()');
        expect(zod).toContain('"@scoped/pkg": z.string()');
    });
});


