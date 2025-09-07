import { CsvExporter, CsvExportOptions, SqlInsertExporter, SqlInsertExportOptions } from '../../domain/ports/mock-data';
import { DefaultJsonToFormDataSerializer } from '../json/default-json-to-formdata-serializer';
import { DefaultCsvFieldEscaper } from '../csv/csv-escaper';
import { JsonToSqlInsertBuilder } from '../../domain/converters/json-to-sql-insert';

export class SimpleCsvExporter implements CsvExporter {
    export(rows: Record<string, any>[], _options?: CsvExportOptions): string {
        const serializer = new DefaultJsonToFormDataSerializer();
        const escaper = new DefaultCsvFieldEscaper();
        if (!rows || rows.length === 0) return '';

        // Collect headers as union of keys across rows, preserve order (first occurrence wins)
        const headerSet = new Set<string>();
        const headers: string[] = [];
        rows.forEach(r => {
            Object.keys(r).forEach(k => {
                if (!headerSet.has(k)) {
                    headerSet.add(k);
                    headers.push(k);
                }
            });
        });

        const headerLine = headers.map(h => escaper.escape(h)).join(',');
        const valueLines = rows.map(r => headers
            .map(h => {
                const v = (r as any)[h];
                const s = serializer.serialize(v);
                const str = s === null || s === undefined ? '' : (typeof s === 'string' ? s : String(s));
                return escaper.escape(str);
            })
            .join(',')
        );
        return [headerLine, ...valueLines].join('\n');
    }
}

export class SimpleSqlInsertExporter implements SqlInsertExporter {
    export(rows: Record<string, any>[], options: SqlInsertExportOptions): string {
        const builder = new JsonToSqlInsertBuilder({ serializer: new DefaultJsonToFormDataSerializer(), options: { tableName: options.tableName, includeNulls: options.includeNulls, batchSize: options.batchSize } });
        if (rows.length <= 1) {
            return builder.build(rows[0] || {});
        }
        return builder.build(rows);
    }
}


