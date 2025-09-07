import type { InputType } from '@/config/data-support'
import type { DataConverterConfig } from '@/types/converter'
import { FormDataResult } from '@/components/common/results/FormDataResult'
import { CsvResult } from '@/components/common/results/CsvResult'
import { DBMigrationResult } from '@/components/common/results/DBMigrationResult'
import { FileText, Table, Database, FileCode, FileJson, FileSpreadsheet } from 'lucide-react'

export const converterConfigs: Record<string, DataConverterConfig> = {
    json: {
        title: 'Converter para JSON',
        description: 'Converte dados estruturados (chave-valor, JSON, CSV) em objetos JSON organizados com validação em tempo real',
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'json',
        outputDescription: 'JSON estruturado gerado a partir dos dados de entrada',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'Arraste um arquivo JSON, CSV, YAML, XML, SQL ou TXT aqui',
        icon: FileText,
        usage: {
            summary: 'Use quando precisar normalizar diferentes formatos (CSV, YAML, XML, key=value) para um JSON único para integrações e testes.',
            useCases: [
                {
                    title: 'Centralizar dados de configuração',
                    description: 'Transformar YAML/XML de configuração em JSON para consumo por front-ends e pipelines.',
                    exampleInput: 'user.name=John\nuser.age=30',
                    exampleOutput: '{\n  "user.name": "John",\n  "user.age": "30"\n}'
                }
            ]
        }
    },
    csv: {
        title: 'Converter para CSV',
        description: 'Transforma dados estruturados em arquivos CSV com formatação adequada e escape de caracteres especiais',
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'csv',
        outputDescription: 'CSV estruturado gerado a partir dos dados de entrada',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'Arraste um arquivo JSON, CSV, YAML, XML, SQL ou TXT aqui',
        icon: Table,
        ResultComponent: CsvResult as any,
        usage: {
            summary: 'Quando você precisa gerar CSV para importar em planilhas ou ferramentas de BI a partir de dados variados.',
            useCases: [
                {
                    title: 'Exportar para Excel/Sheets',
                    description: 'Converter respostas JSON em CSV para análise rápida.',
                    exampleInput: '{"name":"John","age":30}',
                    exampleOutput: 'name,age\nJohn,30'
                }
            ]
        }
    },
    formdata: {
        title: 'Converter para FormData',
        description: 'Converte dados estruturados em FormData para envio de formulários web com preview interativo',
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'formdata',
        outputDescription: 'FormData estruturado gerado a partir dos dados de entrada',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'Arraste um arquivo JSON, CSV, YAML, XML, SQL ou TXT aqui',
        icon: Database,
        ResultComponent: FormDataResult,
        usage: {
            summary: 'Ideal para simular envios de formulários e testar endpoints que recebem multipart/form-data.',
            useCases: [
                {
                    title: 'Simular envio de formulário',
                    description: 'Crie rapidamente um FormData a partir de JSON/CSV e visualize as chaves e valores enviados.',
                    exampleInput: '{"user.name":"John","user.age":30}',
                    exampleOutput: 'user.name=John\nuser.age=30'
                }
            ]
        }
    },
    xml: {
        title: 'Converter para XML',
        description: 'Transforma dados estruturados em XML com suporte a atributos e hierarquia',
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'xml',
        outputDescription: 'XML gerado a partir dos dados de entrada',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'Arraste um arquivo JSON, CSV, YAML, XML, SQL ou TXT aqui',
        icon: FileCode,
        usage: {
            summary: 'Gera XML para integrações legadas, configurações ou serviços que exigem este formato.',
            useCases: [
                {
                    title: 'Exportar para sistemas legados',
                    description: 'Transformar JSON em XML com hierarquia para consumo por serviços antigos.',
                    exampleInput: '{"user":{"name":"John","age":30}}',
                    exampleOutput: '<user>\n  <name>John</name>\n  <age>30</age>\n</user>'
                }
            ]
        }
    },
    yaml: {
        title: 'Converter para YAML',
        description: 'Converte dados para YAML legível para configurações e dados estruturados',
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'yaml',
        outputDescription: 'YAML gerado a partir dos dados de entrada',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'Arraste um arquivo JSON, CSV, YAML, XML, SQL ou TXT aqui',
        icon: FileCode,
        usage: {
            summary: 'Ideal para gerar arquivos de configuração YAML a partir de dados JSON ou chave=valor.',
            useCases: [
                {
                    title: 'Gerar configs de serviços',
                    description: 'Converter JSON de configuração em YAML para Kubernetes, GitHub Actions, etc.',
                    exampleInput: '{"service":{"replicas":2}}',
                    exampleOutput: 'service:\n  replicas: 2'
                }
            ]
        }
    },
    'json-schema': {
        title: 'Converter para JSON Schema',
        description: 'Gera schemas JSON automaticamente para validação de dados',
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'json-schema',
        outputDescription: 'JSON Schema baseado nos dados de entrada',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'Arraste um arquivo JSON, CSV, YAML, XML, SQL ou TXT aqui',
        icon: FileJson,
        usage: {
            summary: 'Crie rapidamente um schema para validar payloads e contratos de API a partir de exemplos.',
            useCases: [
                {
                    title: 'Validar payloads em pipelines',
                    description: 'Gerar JSON Schema para validar arquivos de dados em CI/CD.',
                    exampleInput: '{"id": 1, "name": "John"}',
                    exampleOutput: '{\n  "$schema": "https://json-schema.org/draft/2020-12/schema",\n  "type": "object",\n  "properties": {"id": {"type": "number"}, "name": {"type": "string"}}\n}'
                }
            ]
        }
    },
    openapi: {
        title: 'Converter para OpenAPI',
        description: 'Gera especificações OpenAPI a partir de exemplos de dados',
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'openapi',
        outputDescription: 'OpenAPI Specification (JSON) gerada a partir dos dados',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'Arraste um arquivo JSON, CSV, YAML, XML, SQL ou TXT aqui',
        icon: FileJson,
        usage: {
            summary: 'Gere rapidamente uma especificação OpenAPI a partir de exemplos para documentar e testar APIs.',
            useCases: [
                {
                    title: 'Documentar endpoints',
                    description: 'Converter exemplos de requests/responses em um esqueleto OpenAPI.',
                    exampleInput: '{"GET /users": {"200": [{"id":1}]}}',
                    exampleOutput: '{"openapi":"3.0.0","paths":{"/users":{"get":{"responses":{"200":{"content":{"application/json":{"schema":{"type":"array"}}}}}}}}}'
                }
            ]
        }
    },
    sql: {
        title: 'Converter para SQL',
        description: 'Gera scripts SQL (INSERT, UPDATE ou CREATE TABLE)',
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'sql',
        outputDescription: 'Script SQL gerado a partir dos dados',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'Arraste um arquivo JSON, CSV, YAML, XML, SQL ou TXT aqui',
        icon: FileSpreadsheet,
        usage: {
            summary: 'Produza INSERT/UPDATE/CREATE TABLE para popular bancos ou preparar migrações a partir de JSON/CSV.',
            useCases: [
                {
                    title: 'Popular ambiente de desenvolvimento',
                    description: 'Gerar INSERTs a partir de fixtures JSON.',
                    exampleInput: '{"users":[{"id":1,"name":"John"}]}',
                    exampleOutput: 'INSERT INTO users (id,name) VALUES (1,\'John\');'
                }
            ]
        }
    },
    'database-migration': {
        title: 'Converter para Database Migration',
        description: 'Gera scripts de migração (UP/DOWN) com suporte a seed data',
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'db-migration',
        outputDescription: 'Scripts de migração gerados a partir dos dados',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'Arraste um arquivo JSON, CSV, YAML, XML, SQL ou TXT aqui',
        icon: Database,
        ResultComponent: DBMigrationResult,
        usage: {
            summary: 'Crie migrações UP/DOWN e dados de seed a partir de exemplos, agilizando prototipação.',
            useCases: [
                {
                    title: 'Esqueleto de migração rápida',
                    description: 'Gerar CREATE TABLE e seeds iniciais a partir de JSON.',
                    exampleInput: '{"users":[{"id":1,"name":"John"}]}',
                    exampleOutput: '-- up\nCREATE TABLE users (id INT, name TEXT);\n-- down\nDROP TABLE users;'
                }
            ]
        }
    }
}

export const getConverterConfig = (type: keyof typeof converterConfigs): DataConverterConfig => {
    return converterConfigs[type]
}
