import { describe, it, expect } from 'vitest';
import { createEntrySource } from '../../presentation/src/lib/entrySources';
import { DataReBuilder } from '../../core/application/data-rebuilder';

describe('FormData Multipart Conversion', () => {
    it('should correctly parse complex multipart FormData with nested arrays', () => {
        const multipartInput = `------WebKitFormBoundaryBseZlck0XfyG0BcR
Content-Disposition: form-data; name="storyCreator.type"

Agile
------WebKitFormBoundaryBseZlck0XfyG0BcR
Content-Disposition: form-data; name="storyCreator.subType"

Config
------WebKitFormBoundaryBseZlck0XfyG0BcR
Content-Disposition: form-data; name="storyCreator.fields[0].fieldName"

DefaultBackLog
------WebKitFormBoundaryBseZlck0XfyG0BcR
Content-Disposition: form-data; name="storyCreator.fields[0].fieldType"

String
------WebKitFormBoundaryBseZlck0XfyG0BcR
Content-Disposition: form-data; name="storyCreator.fields[0].value"

AzureDevOps
------WebKitFormBoundaryBseZlck0XfyG0BcR
Content-Disposition: form-data; name="storyCreator.fields[0].subFields"

[]
------WebKitFormBoundaryBseZlck0XfyG0BcR
Content-Disposition: form-data; name="storyCreator.fields[1].fieldName"

ProcessDefinition
------WebKitFormBoundaryBseZlck0XfyG0BcR
Content-Disposition: form-data; name="storyCreator.fields[1].fieldType"

Object
------WebKitFormBoundaryBseZlck0XfyG0BcR
Content-Disposition: form-data; name="storyCreator.fields[1].value"


------WebKitFormBoundaryBseZlck0XfyG0BcR
Content-Disposition: form-data; name="storyCreator.fields[1].subFields[0].fieldName"

Level
------WebKitFormBoundaryBseZlck0XfyG0BcR
Content-Disposition: form-data; name="storyCreator.fields[1].subFields[0].fieldType"

String
------WebKitFormBoundaryBseZlck0XfyG0BcR
Content-Disposition: form-data; name="storyCreator.fields[1].subFields[0].value"

Epic-TESTEBISPO
------WebKitFormBoundaryBseZlck0XfyG0BcR--`;

        // Create entry source from the multipart input
        const entrySource = createEntrySource(multipartInput, 'formdata');
        const rebuilder = new DataReBuilder();
        const pipeline = rebuilder.rebuildFrom(entrySource);
        const result = pipeline.toJSON();

        // Expected structure
        expect(result.storyCreator.type).toBe('Agile');
        expect(result.storyCreator.subType).toBe('Config');
        expect(Array.isArray(result.storyCreator.fields)).toBe(true);
        expect(result.storyCreator.fields.length).toBe(2);

        // First field
        expect(result.storyCreator.fields[0].fieldName).toBe('DefaultBackLog');
        expect(result.storyCreator.fields[0].fieldType).toBe('String');
        expect(result.storyCreator.fields[0].value).toBe('AzureDevOps');
        expect(Array.isArray(result.storyCreator.fields[0].subFields)).toBe(true);
        expect(result.storyCreator.fields[0].subFields.length).toBe(0);

        // Second field
        expect(result.storyCreator.fields[1].fieldName).toBe('ProcessDefinition');
        expect(result.storyCreator.fields[1].fieldType).toBe('Object');
        expect(result.storyCreator.fields[1].value).toBeUndefined();
        expect(Array.isArray(result.storyCreator.fields[1].subFields)).toBe(true);
        expect(result.storyCreator.fields[1].subFields.length).toBe(1);
        expect(result.storyCreator.fields[1].subFields[0].fieldName).toBe('Level');
        expect(result.storyCreator.fields[1].subFields[0].fieldType).toBe('String');
        expect(result.storyCreator.fields[1].subFields[0].value).toBe('Epic-TESTEBISPO');
    });
});
