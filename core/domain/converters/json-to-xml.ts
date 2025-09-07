import { JsonOutputBuilder } from '../ports/json-output-builder';
import { JsonSerializer } from '../ports/json-serializer';

export interface XmlOptions {
    rootElement?: string;
    itemElement?: string;
    indent?: boolean;
    indentSize?: number;
    encoding?: string;
    version?: string;
    includeDeclaration?: boolean;
    attributePrefix?: string;
    indentChar?: string;
}

export class JsonToXmlBuilder implements JsonOutputBuilder<string> {
    private readonly serializer: JsonSerializer;
    private readonly options: XmlOptions;

    constructor(params: { serializer: JsonSerializer; options?: XmlOptions }) {
        this.serializer = params.serializer;
        this.options = {
            rootElement: 'root',
            itemElement: 'item',
            indent: true,
            indentSize: 2,
            indentChar: ' ',
            encoding: 'UTF-8',
            version: '1.0',
            includeDeclaration: false,
            attributePrefix: '@',
            ...params.options
        };
    }

    build(json: Record<string, any>): string {
        let xml = '';

        if (this.options.includeDeclaration) {
            xml += `<?xml version="${this.options.version}" encoding="${this.options.encoding}"?>\n`;
        }

        if (Array.isArray(json)) {
            // For arrays, create a root element containing the items
            xml += this.convertToXml(json, this.options.rootElement!, 0);
        } else {
            xml += this.convertToXml(json, this.options.rootElement!, 0);
        }

        return xml;
    }

    private convertToXml(data: any, elementName: string, depth: number): string {
        const indent = this.options.indent ? this.options.indentChar!.repeat(depth * this.options.indentSize!) : '';

        if (data === null || data === undefined) {
            let result = `${indent}<${elementName}/>`;
            if (this.options.indent) result += '\n';
            return result;
        }

        if (Array.isArray(data)) {
            let xml = '';
            if (data.length === 0) {
                xml += `${indent}<${elementName}></${elementName}>`;
                if (this.options.indent) xml += '\n';
            } else {
                data.forEach((item, index) => {
                    const itemName = this.options.itemElement || `item_${index}`;
                    xml += this.convertToXml(item, itemName, depth);
                });
            }
            return xml;
        }

        if (typeof data === 'object') {
            let xml = `${indent}<${elementName}`;
            let hasContent = false;

            const attributes: string[] = [];
            const childElements: string[] = [];

            for (const [key, value] of Object.entries(data)) {
                if (key.startsWith(this.options.attributePrefix!)) {
                    // This is an attribute
                    const attrName = key.substring(this.options.attributePrefix!.length);
                    const attrValue = this.escapeXml(String(value));
                    attributes.push(`${attrName}="${attrValue}"`);
                } else {
                    // This is a child element
                    childElements.push(this.convertToXml(value, key, depth + 1));
                    hasContent = true;
                }
            }

            if (attributes.length > 0) {
                xml += ' ' + attributes.join(' ');
            }

            if (hasContent) {
                xml += '>';
                if (this.options.indent) xml += '\n';
                xml += childElements.join('');
                xml += `${indent}</${elementName}>`;
                if (this.options.indent) xml += '\n';
            } else {
                xml += '/>';
                if (this.options.indent) xml += '\n';
            }

            return xml;
        }

        // Primitive value
        const serialized = this.serializer.serialize(data);
        if (serialized === null || serialized === undefined) {
            return `${indent}<${elementName}/>\n`;
        }

        const value = this.escapeXml(String(serialized));
        let result = `${indent}<${elementName}>${value}</${elementName}>`;
        if (this.options.indent) result += '\n';
        return result;
    }

    private escapeXml(unsafe: string): string {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
