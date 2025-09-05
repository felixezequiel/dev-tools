export interface CsvParser {
    parse(input: string): string[][];
}

export class DefaultCsvParser implements CsvParser {
    parse(input: string): string[][] {
        const rows: string[][] = [];
        let current: string[] = [];
        let field = '';
        let inQuotes = false;
        for (let i = 0; i < input.length; i++) {
            const ch = input[i];
            if (inQuotes) {
                if (ch === '"') {
                    if (input[i + 1] === '"') {
                        field += '"';
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    field += ch;
                }
            } else {
                if (ch === '"') {
                    inQuotes = true;
                } else if (ch === ',') {
                    current.push(field);
                    field = '';
                } else if (ch === '\n') {
                    current.push(field);
                    rows.push(current);
                    current = [];
                    field = '';
                } else if (ch === '\r') {
                    // ignore CR
                } else {
                    field += ch;
                }
            }
        }
        current.push(field);
        rows.push(current);
        return rows.filter(r => r.length > 0 && !(r.length === 1 && r[0] === ''));
    }
}


