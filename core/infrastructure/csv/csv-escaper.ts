import { CsvFieldEscaper } from '../../domain/ports/csv-field-escaper';

export class DefaultCsvFieldEscaper implements CsvFieldEscaper {
    escape(field: string): string {
        if (/[",\n\r]/.test(field)) {
            return '"' + field.replace(/"/g, '""') + '"';
        }
        return field;
    }
}


