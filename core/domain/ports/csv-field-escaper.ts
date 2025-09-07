// Domain Port: Escapes CSV fields according to the chosen rules
export interface CsvFieldEscaper {
    escape(field: string): string;
}


