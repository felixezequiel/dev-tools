// Domain Abstraction: Source of entries (adapter for input types)
export interface EntrySource<TKey, TValue> {
    entries(): Iterable<[TKey, TValue]>;
}


