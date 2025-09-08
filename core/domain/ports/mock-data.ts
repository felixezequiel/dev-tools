export type InternalSchemaType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' | 'union';

export interface InternalSchemaBase {
    type: InternalSchemaType;
    nullable?: boolean;
}

export interface InternalObjectSchema extends InternalSchemaBase {
    type: 'object';
    properties: Record<string, InternalSchema>;
    required?: string[];
}

export interface InternalArraySchema extends InternalSchemaBase {
    type: 'array';
    items: InternalSchema;
    minItems?: number;
    maxItems?: number;
}

export interface InternalStringSchema extends InternalSchemaBase {
    type: 'string';
    enum?: string[];
    format?: 'email' | 'uri' | 'uuid' | 'date' | 'date-time' | 'phone' | 'address' | 'company' | 'credit-card' | 'first-name' | 'last-name' | 'full-name' | 'job-title' | 'country' | 'city' | 'zip-code';
    pattern?: string;
}

export interface InternalNumberSchema extends InternalSchemaBase {
    type: 'number';
    enum?: number[];
}

export interface InternalBooleanSchema extends InternalSchemaBase {
    type: 'boolean';
}

export interface InternalNullSchema extends InternalSchemaBase {
    type: 'null';
}

export interface InternalUnionSchema extends InternalSchemaBase {
    type: 'union';
    variants: InternalSchema[];
}

export type InternalSchema =
    | InternalObjectSchema
    | InternalArraySchema
    | InternalStringSchema
    | InternalNumberSchema
    | InternalBooleanSchema
    | InternalNullSchema
    | InternalUnionSchema;

export interface SchemaLoader {
    loadFromJsonSchema(input: unknown): InternalSchema;
    loadFromOpenApi(spec: unknown): InternalSchema;
}

export interface DataFakerOptions {
    count: number;
    seed?: string;
    locale?: string;
}

export interface DataFaker {
    generate(schema: InternalSchema, options: DataFakerOptions): any[];
}

export interface CsvExportOptions {
    delimiter?: string; // default ,
    header?: boolean;   // default true
}

export interface CsvExporter {
    export(rows: Record<string, any>[], options?: CsvExportOptions): string;
}

export interface SqlInsertExportOptions {
    tableName: string;
    includeNulls?: boolean;
    batchSize?: number;
}

export interface SqlInsertExporter {
    export(rows: Record<string, any>[], options: SqlInsertExportOptions): string;
}


