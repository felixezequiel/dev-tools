import { TypeModel, TypeRef, TypeScriptEmitter, TypeScriptEmitterOptions } from '../ports/types-model';

export class DefaultTypeScriptEmitter implements TypeScriptEmitter {
    emit(model: TypeModel, options?: TypeScriptEmitterOptions): string {
        const exportKw = options?.export ? 'export ' : '';
        const typeName = model.rootName;
        const body = this.emitType(model.root, 1);
        return `${exportKw}interface ${typeName} ${body}`;
    }

    private emitType(ref: TypeRef, indentLevel: number): string {
        const i = (n: number) => '  '.repeat(n);
        switch (ref.kind) {
            case 'object': {
                const props = ref.properties.map(p => `${i(indentLevel)}${p.readonly ? 'readonly ' : ''}${this.formatPropName(p.name)}${p.optional ? '?' : ''}: ${this.inlineType(p.type, indentLevel)};`).join('\n');
                return `{
${props}
${i(indentLevel - 1)}}`;
            }
            case 'array':
                return `${this.inlineType(ref.itemType, indentLevel)}[]`;
            case 'string':
                return 'string';
            case 'number':
                return 'number';
            case 'boolean':
                return 'boolean';
            case 'null':
                return 'null';
            case 'enum':
                return ref.values.map(v => JSON.stringify(v)).join(' | ');
            case 'union':
                return ref.members.map(m => this.inlineType(m, indentLevel)).join(' | ');
            default:
                return 'unknown';
        }
    }

    private inlineType(ref: TypeRef, indentLevel: number): string {
        switch (ref.kind) {
            case 'object':
                return this.emitType(ref, indentLevel + 1);
            case 'array':
                return `${this.inlineType(ref.itemType, indentLevel)}[]`;
            case 'string':
                return 'string';
            case 'number':
                return 'number';
            case 'boolean':
                return 'boolean';
            case 'null':
                return 'null';
            case 'enum':
                return ref.values.map(v => JSON.stringify(v)).join(' | ');
            case 'union':
                return ref.members.map(m => this.inlineType(m, indentLevel)).join(' | ');
            default:
                return 'unknown';
        }
    }

    private formatPropName(name: string): string {
        // Valid TS identifier or needs quoting
        const isValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);
        if (isValidIdentifier) return name;
        const escaped = name.replace(/"/g, '\\"');
        return `"${escaped}"`;
    }
}


