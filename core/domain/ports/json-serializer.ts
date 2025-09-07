// Domain Abstraction: Serializes arbitrary JSON values into other formats
export interface JsonSerializer {
    serialize(value: unknown): any;
}


