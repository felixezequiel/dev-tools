import { describe, it, expect } from 'vitest';
import { JsonToFormDataBuilder } from '../../application/json-to-formdata';
import { DotBracketKeyPathFormatter } from '../../infrastructure/key-path/dot-bracket-key-path-formatter';
import { DefaultJsonToFormDataSerializer } from '../../infrastructure/json/default-json-to-formdata-serializer';

describe('JsonToFormDataBuilder', () => {
  it('serializes scalars and arrays', () => {
    const builder = new JsonToFormDataBuilder({
      formatter: new DotBracketKeyPathFormatter(),
      serializer: new DefaultJsonToFormDataSerializer(),
    });
    const fd = builder.build({ a: 1, arr: ['x', 'y'] });
    const entries = Array.from(fd.entries());
    expect(entries).toContainEqual(['a', '1']);
    expect(entries).toContainEqual(['arr[0]', 'x']);
    expect(entries).toContainEqual(['arr[1]', 'y']);
  });
});


