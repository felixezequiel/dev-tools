export interface CsvFieldEscaper {
    escape(field: string): string;
}

export class DefaultCsvFieldEscaper implements CsvFieldEscaper {
    escape(field: string): string {
        if (/[",\n\r]/.test(field)) {
            return '"' + field.replace(/"/g, '""') + '"';
        }
        return field;
    }
}


