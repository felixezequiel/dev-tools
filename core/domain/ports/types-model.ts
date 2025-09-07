export type TypeKind = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' | 'unknown' | 'enum' | 'union';

export interface TypeRefBase {
    kind: TypeKind;
}

export interface ObjectProperty {
    name: string;
    type: TypeRef;
    optional?: boolean;
    readonly?: boolean;
}

export interface ObjectTypeRef extends TypeRefBase {
    kind: 'object';
    properties: ObjectProperty[];
    additionalProperties?: boolean;
}

export interface ArrayTypeRef extends TypeRefBase {
    kind: 'array';
    itemType: TypeRef;
}

export interface StringTypeRef extends TypeRefBase {
    kind: 'string';
    format?: 'email' | 'uri' | 'uuid' | 'date' | 'date-time';
    enumValues?: string[];
}

export interface NumberTypeRef extends TypeRefBase {
    kind: 'number';
}

export interface BooleanTypeRef extends TypeRefBase {
    kind: 'boolean';
}

export interface NullTypeRef extends TypeRefBase {
    kind: 'null';
}

export interface EnumTypeRef extends TypeRefBase {
    kind: 'enum';
    values: Array<string | number | boolean>;
}

export interface UnionTypeRef extends TypeRefBase {
    kind: 'union';
    members: TypeRef[];
}

export type TypeRef =
    | ObjectTypeRef
    | ArrayTypeRef
    | StringTypeRef
    | NumberTypeRef
    | BooleanTypeRef
    | NullTypeRef
    | EnumTypeRef
    | UnionTypeRef
    | ({ kind: 'unknown' });

export interface TypeModel {
    rootName: string;
    root: TypeRef;
}

export interface TypeModelBuilderOptions {
    rootName?: string;
    optionalStrategy?: 'strict' | 'loose';
    readonlyProperties?: boolean;
    additionalProperties?: boolean;
}

export interface TypeModelBuilder {
    buildFromSample(sample: unknown, options?: TypeModelBuilderOptions): TypeModel;
}

export interface TypeScriptEmitterOptions {
    export?: boolean;
}

export interface TypeScriptEmitter {
    emit(model: TypeModel, options?: TypeScriptEmitterOptions): string;
}

export interface ZodEmitterOptions {
    constName?: string; // default: schema name derived from model.rootName
}

export interface ZodEmitter {
    emit(model: TypeModel, options?: ZodEmitterOptions): string;
}


