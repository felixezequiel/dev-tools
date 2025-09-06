import { JsonOutputBuilder } from './ports/json-output-builder';
import { JsonSerializer } from './ports/json-serializer';

export interface YamlOptions {
    indent?: number;
    indentChar?: string;
    lineWidth?: number;
    version?: string;
    includeVersion?: boolean;
}

export class JsonToYamlBuilder implements JsonOutputBuilder<string> {
    private readonly serializer: JsonSerializer;
    private readonly options: YamlOptions;

    constructor(params: { serializer: JsonSerializer; options?: YamlOptions }) {
        this.serializer = params.serializer;
        this.options = {
            indent: 2,
            indentChar: ' ',
            lineWidth: 80,
            version: '1.1',
            includeVersion: false,
            ...params.options
        };
    }

    build(json: Record<string, any>): string {
        let yaml = '';

        if (this.options.includeVersion) {
            yaml += `%YAML ${this.options.version}\n---\n`;
        }

        yaml += this.convertToYaml(json, 0);
        return yaml;
    }

    private convertToYaml(data: any, depth: number): string {
        if (data === null || data === undefined) {
            return 'null\n';
        }

        if (Array.isArray(data)) {
            if (data.length === 0) {
                return '[]\n';
            }

            // For non-empty arrays, convert to YAML format
            let yaml = '\n';
            data.forEach((item) => {
                const indent = this.options.indentChar!.repeat(depth * this.options.indent!);
                yaml += `${indent}- ${this.convertToYamlInline(item, depth + 1)}`;
            });
            return yaml;
        }

        if (typeof data === 'object') {
            let yaml = '\n';
            const entries = Object.entries(data);

            entries.forEach(([key, value]) => {
                const indent = this.options.indentChar!.repeat(depth * this.options.indent!);
                yaml += `${indent}${this.escapeYamlKey(key)}: `;

                if (this.isComplexValue(value)) {
                    yaml += this.convertToYaml(value, depth + 1);
                } else {
                    yaml += this.convertToYamlInline(value, depth + 1);
                }
            });

            return yaml;
        }

        return this.convertToYamlInline(data, depth);
    }

    private convertToYamlInline(data: any, depth: number): string {
        // Don't serialize objects and arrays - let them be handled by convertToYaml
        if (data === null || data === undefined) {
            return 'null\n';
        }

        if (Array.isArray(data) || (typeof data === 'object' && !(data instanceof Date))) {
            return this.convertToYaml(data, depth);
        }

        // Handle Date objects directly
        if (data instanceof Date) {
            return `${data.toISOString()}\n`;
        }

        const serialized = this.serializer.serialize(data);

        if (serialized === null || serialized === undefined) {
            return 'null\n';
        }

        if (typeof serialized === 'string') {
            if (serialized.includes('\n') || serialized.length > this.options.lineWidth! - (depth * this.options.indent!)) {
                // Multi-line string
                const lines = serialized.split('\n');
                return `|\n${lines.map(line => this.options.indentChar!.repeat((depth + 1) * this.options.indent!) + line).join('\n')}\n`;
            }

            // Check if string needs quotes
            if (serialized.match(/^[\s#&*{}[\],|>-]+/) || serialized.includes(': ') || serialized.includes(' #') || serialized.includes('|')) {
                return `"${serialized.replace(/"/g, '\\"')}"\n`;
            }

            return `${serialized}\n`;
        }

        if (typeof serialized === 'boolean') {
            return `${serialized}\n`;
        }

        if (typeof serialized === 'number') {
            return `${serialized}\n`;
        }

        return `${String(serialized)}\n`;
    }

    private isComplexValue(value: any): boolean {
        return value !== null &&
               typeof value === 'object' &&
               !Array.isArray(value) &&
               !(value instanceof Date);
    }

    private escapeYamlKey(key: string): string {
        // Keys that need quotes
        if (key.match(/^[\s#&*{}[\],|>-]+/) || key.includes(': ') || key.includes(' #') || key.includes('"')) {
            return `"${key.replace(/"/g, '\\"')}"`;
        }
        return key;
    }
}
