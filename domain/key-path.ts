// Domain Value Object: KeyPath
export class KeyPath {
    private readonly _segments: string[];

    constructor(segments: string[]) {
        this._segments = segments;
    }

    get segments(): readonly string[] {
        return this._segments;
    }

    get length(): number {
        return this._segments.length;
    }

    first(): string | undefined {
        return this._segments[0];
    }

    segmentAt(index: number): string | undefined {
        return this._segments[index];
    }

    static isIndexSegment(segment: string | undefined): boolean {
        return segment !== undefined && /^\d+$/.test(segment);
    }
}


