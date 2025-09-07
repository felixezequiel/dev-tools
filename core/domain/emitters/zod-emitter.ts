import { TypeModel, TypeRef, ZodEmitter, ZodEmitterOptions } from '../ports/types-model';

export class DefaultZodEmitter implements ZodEmitter {
    emit(model: TypeModel, options?: ZodEmitterOptions): string {
        const schemaName = options?.constName ?? `${model.rootName}Schema`;
        const body = this.emitType(model.root, 0);
        return `import { z } from 'zod'\n\nexport const ${schemaName} = ${body}`;
    }

    private emitType(ref: TypeRef, indentLevel: number): string {
        const i = (n: number) => '  '.repeat(n);
        switch (ref.kind) {
            case 'object': {
                const propLines = ref.properties.map(p => {
                    const value = this.emitType(p.type, indentLevel + 1);
                    const opt = p.optional ? '.optional()' : '';
                    return `${i(indentLevel + 1)}${this.formatPropName(p.name)}: ${value}${opt}`;
                });
                const content = propLines.length ? `\n${propLines.join(',\n')}\n${i(indentLevel)}` : '';
                const catchall = ref.additionalProperties ? '.catchall(z.unknown())' : '';
                return `z.object({${content}})${catchall}`;
            }
            case 'array':
                return `z.array(${this.emitType(ref.itemType, indentLevel)})`;
            case 'string':
                return this.stringWithFormat(ref);
            case 'number':
                return 'z.number()';
            case 'boolean':
                return 'z.boolean()';
            case 'null':
                return 'z.null()';
            case 'enum':
                return `z.enum([${ref.values.map(v => JSON.stringify(String(v))).join(', ')}])`;
            case 'union':
                return `z.union([${ref.members.map(m => this.emitType(m, indentLevel)).join(', ')}])`;
            default:
                return 'z.unknown()';
        }
    }

    private stringWithFormat(ref: Extract<TypeRef, { kind: 'string' }>): string {
        if (ref.format === 'email') return 'z.string().email()';
        if (ref.format === 'uri') return 'z.string().url()';
        if (ref.format === 'uuid') return 'z.string().uuid()';
        if (ref.format === 'date' || ref.format === 'date-time') return 'z.string()';
        return 'z.string()';
    }

    private formatPropName(name: string): string {
        const isValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);
        if (isValidIdentifier) return name;
        const escaped = name.replace(/"/g, '\\"');
        return `"${escaped}"`;
    }
}


