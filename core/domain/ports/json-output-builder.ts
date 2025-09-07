// Abstraction: Builds an output type from a JSON object
export interface JsonOutputBuilder<TOutput> {
    build(json: Record<string, any>): TOutput;
}


