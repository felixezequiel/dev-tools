import { EntrySource } from '../../domain/entry-source';
import { CsvParser, DefaultCsvParser } from '../parsers/csv-parser';

export class CsvDataEntrySource implements EntrySource<string, string> {
    private readonly csv: string;
    private readonly parser: CsvParser;

    constructor(csv: string, parser: CsvParser = new DefaultCsvParser()) {
        this.csv = csv;
        this.parser = parser;
    }

    entries(): Iterable<[string, string]> {
        const rows = this.parser.parse(this.csv.trim());
        if (rows.length < 2) return [];
        const headers = rows[0];
        const data = rows[1];
        const out: Array<[string, string]> = [];
        for (let i = 0; i < headers.length; i++) {
            const key = headers[i]?.trim();
            if (!key) continue;
            const value = data[i] ?? '';
            out.push([key, value]);
        }
        return out;
    }
}


