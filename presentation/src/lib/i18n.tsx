import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Translation system for UI
export interface Translations {
    [key: string]: string | Translations;
}

export const translations: Record<string, Translations> = {
    en: {
        // Navigation
        home: 'Home',
        homePage: 'Home Page',
        tools: 'Tools',
        generators: 'Generators',
        dataConverters: 'Data Converters',
        comparators: 'Comparators',
        typesZod: 'Types Zod Generator',
        mockData: 'Mock Data Generator',

        // Mock Data Page
        mockDataTitle: 'Mock Data',
        mockDataDescription: 'Generate fake data from JSON Schema or OpenAPI',
        jsonSchema: 'JSON Schema',
        openApi: 'OpenAPI',
        example: 'Example',
        clear: 'Clear',
        options: 'Options',
        seed: 'Seed',
        seedDescription: 'Used for deterministic generation. Same seed generates same data.',
        quantity: 'Quantity (N)',
        quantityDescription: 'Number of records to generate.',
        batchSize: 'Batch Size (SQL)',
        batchSizeDescription: 'Number of records per batch in SQL INSERT commands.',
        tableName: 'Table Name (SQL)',
        tableNameDescription: 'Name used in generated INSERT commands.',
        locale: 'Locale',
        localeDescription: 'Locale for localized data (names, addresses, etc.).',
        generate: 'Generate',
        generating: 'Generating...',

        // Large dataset warnings
        largeDatasetWarning: '⚠️ Large datasets may affect performance. Consider using smaller values.',

        // Output sections
        json: 'JSON',
        csv: 'CSV',
        sql: 'SQL',
        text: 'Text',
        copyJson: 'Copy JSON',
        copyCsv: 'Copy CSV',
        downloadCsv: 'Download CSV',
        selectFile: 'Select File',
        dropHere: 'Drop the file here',
        unsupportedFile: 'Unsupported file type',
        acceptedTypes: 'Accepted types',
        maxSize: 'Max',
        readFileError: 'Error reading file',
        processingFile: 'Processing file...',
        fileLoadedSuccess: 'File loaded successfully',

        // Error messages
        generationError: 'Error generating data',

        // Common
        copy: 'Copy',
        download: 'Download',
        brandName: 'DevTools',
        theme: 'Theme',
        convertTo: 'Convert to',
        lines: 'lines',

        // Not Found Page
        notFoundTitle: 'Page not found',
        notFoundDescription: 'The page you are looking for does not exist or has been moved.',
        goHome: 'Home Page',
        goBack: 'Back',

        // Tips and hints
        sqlBatchTip: 'Tip: increase batch size to combine INSERT statements',

        // Page titles and descriptions
        typesZodTitle: 'Types Zod Generator',
        typesZodDescription: 'Generate TypeScript types and Zod schemas from JSON',
        jsonInput: 'JSON Input',
        copyTypescript: 'Copy TypeScript',
        copyZod: 'Copy Zod',
        comparatorTitle: 'Comparator',
        comparatorDescription: 'Compare JSON or text data, including invisible characters',
        availableTools: 'Available Tools',
        modernToolsDescription: 'Modern tools for data conversion',
        chooseInputFormat: 'Choose input format (JSON, key-value, CSV)',
        homePageTitle: 'Home Page',

        // Generic converter layout
        inputData: 'Input Data',
        inputSectionDescription: 'Choose the input mode (Type or File) and the format below to insert your data.',
        chooseDataType: 'Choose data type',
        chooseDataTypeDesc: 'Select the format that best represents your data.',
        chooseHowToInsert: 'Choose how to insert',
        chooseHowToInsertDesc: 'Type manually or upload a file.',
        insertData: 'Insert data',
        insertDataDesc: 'Paste or type the data according to the selected format.',
        validFormat: 'Valid format',
        loadExample: 'Load Example',
        conversionError: 'Conversion error',
        insertDataConvertSeeResult: 'Insert data and click "Convert" to see the result',
        fixErrors: 'Fix Errors',
        selectData: 'Select Data',

        // ConverterInfo
        showConverterInfo: 'See what this converter does',
        hideDetails: 'Hide details',
        exampleInputLabel: 'Example input',
        exampleOutputLabel: 'Example output',

        // JSON converter usage content
        json_usage_summary: 'Use when you need to normalize different formats (CSV, YAML, XML, key=value) into a single JSON for integrations and tests.',
        json_usecase_centralize_title: 'Centralize configuration data',
        json_usecase_centralize_desc: 'Transform configuration YAML/XML into JSON for consumption by front-ends and pipelines.',

        // CSV converter usage content
        csv_usage_summary: 'When you need to generate CSV for spreadsheets or BI tools.',
        csv_usecase_export_title: 'Export to Excel/Sheets',
        csv_usecase_export_desc: 'Convert JSON responses to CSV for quick analysis.',

        // FormData converter usage content
        formdata_usage_summary: 'Ideal to simulate form submissions and test multipart/form-data endpoints.',
        formdata_usecase_simulate_title: 'Simulate form submission',
        formdata_usecase_simulate_desc: 'Quickly build FormData from JSON/CSV and preview sent keys and values.',

        // XML converter usage content
        xml_usage_summary: 'Generate XML for legacy integrations, configurations or services.',
        xml_usecase_legacy_title: 'Export to legacy systems',
        xml_usecase_legacy_desc: 'Transform JSON into hierarchical XML for consumption by older services.',

        // YAML converter usage content
        yaml_usage_summary: 'Generate readable YAML config from JSON or key=value.',
        yaml_usecase_configs_title: 'Generate service configs',
        yaml_usecase_configs_desc: 'Convert config JSON into YAML for Kubernetes, GitHub Actions, etc.',

        // JSON Schema usage content
        jsonschema_usage_summary: 'Quickly create a schema to validate payloads and API contracts from examples.',
        jsonschema_usecase_ci_title: 'Validate payloads in pipelines',
        jsonschema_usecase_ci_desc: 'Generate JSON Schema to validate data files in CI/CD.',

        // OpenAPI usage content
        openapi_usage_summary: 'Quickly generate an OpenAPI spec from examples to document and test APIs.',
        openapi_usecase_docs_title: 'Document endpoints',
        openapi_usecase_docs_desc: 'Convert request/response examples into an OpenAPI skeleton.',

        // SQL usage content
        sql_usage_summary: 'Produce INSERT/UPDATE/CREATE TABLE from JSON/CSV to populate DBs or prepare migrations.',
        sql_usecase_seed_title: 'Populate dev environment',
        sql_usecase_seed_desc: 'Generate INSERTs from JSON fixtures.',

        // DB Migration usage content
        dbmig_usage_summary: 'Create UP/DOWN migrations and seed data from examples for rapid prototyping.',
        dbmig_usecase_skeleton_title: 'Quick migration skeleton',
        dbmig_usecase_skeleton_desc: 'Generate CREATE TABLE and initial seeds from JSON.',

        // HomePage specific
        foundProblem: 'Found a problem?',
        reportOnGithub: 'Report directly in our GitHub issues. Your feedback helps improve the tool.',
        openIssues: 'Open Issues',
        howToStart: 'How to start',
        chooseToolDescription: 'Choose a tool below to start converting your data. Each tool is specialized in a specific type of conversion.',
        enterDataValidation: 'Enter the data with real-time validation',
        convertDownloadResult: 'Convert and download the result in the desired format',
        powerfulConversion: 'Powerful Conversion',
        powerfulConversionDesc: 'Full support for DataReBuilder transformers with multiple input formats',
        secureProcessing: 'Secure Processing',
        secureProcessingDesc: 'All processing is done locally using robust domain classes',
        modernInterface: 'Modern Interface',
        modernInterfaceDesc: 'Elegant design with real-time validation and intelligent visual feedback',
        toolsCount: '{{count}} tools',
        acceptedInputTypes: 'Accepted Input Types',
        supportedOutputs: 'Supported Outputs',

        // Common UI states and actions
        success: 'Success',
        updated: 'Updated',
        table: 'Table',
        raw: 'Raw',
        noData: 'No data',
        jsonInvalidError: 'Invalid JSON in one of the inputs',
        noDifferences: 'No differences',
        diffEditor: 'Diff Editor',
        result: 'Result',

        // Tool Names - Converters
        convertToJson: 'Convert to JSON',
        convertToCsv: 'Convert to CSV',
        convertToFormData: 'Convert to FormData',
        convertToXml: 'Convert to XML',
        convertToYaml: 'Convert to YAML',
        convertToJsonSchema: 'Convert to JSON Schema',
        convertToOpenApi: 'Convert to OpenAPI',
        convertToSql: 'Convert to SQL',
        convertToDatabaseMigration: 'Convert to Database Migration',

        // Tool Names - Generators
        typesZodGenerator: 'Types Zod',
        mockDataGenerator: 'Mock Data',

        // Tool Names - Comparators
        dataComparator: 'Data Comparator',

        // Tool Descriptions
        convertToJson_desc: 'Converts structured data (key-value, JSON, CSV) into organized JSON objects with real-time validation.',
        convertToCsv_desc: 'Transforms structured data into CSV files with proper formatting and escaping.',
        convertToFormData_desc: 'Converts structured data into FormData for web form submission with interactive preview.',
        convertToXml_desc: 'Transforms structured data into XML with attributes and hierarchy support.',
        convertToYaml_desc: 'Converts data into readable YAML for configurations and structured data.',
        convertToJsonSchema_desc: 'Automatically generates JSON Schemas for data validation.',
        convertToOpenApi_desc: 'Generates OpenAPI specifications from data examples.',
        convertToSql_desc: 'Generates SQL scripts (INSERT, UPDATE or CREATE TABLE).',
        convertToDatabaseMigration_desc: 'Generates migration scripts (UP/DOWN) with seed data support.',
        typesZodGenerator_desc: 'Generate TS types and Zod schemas from JSON.',
        mockDataGenerator_desc: 'Generate mocks from JSON Schema or OpenAPI in JSON/CSV/SQL.',
        dataComparator_desc: 'Compare JSON and text, detecting invisible characters.',

        // Common UI states and actions
        manual: 'Manual',
        file: 'File',
        dropFileHere: 'Drop the file here, or click to select',
    },
    pt_BR: {
        // Navigation
        home: 'Início',
        homePage: 'Página Inicial',
        tools: 'Ferramentas',
        generators: 'Geradores',
        dataConverters: 'Conversores de Dados',
        comparators: 'Comparadores',
        typesZod: 'Gerador Types Zod',
        mockData: 'Gerador Mock Data',

        // Mock Data Page
        mockDataTitle: 'Mock Data',
        mockDataDescription: 'Gere dados fake a partir de JSON Schema ou OpenAPI',
        jsonSchema: 'JSON Schema',
        openApi: 'OpenAPI',
        example: 'Exemplo',
        clear: 'Limpar',
        options: 'Opções',
        seed: 'Seed',
        seedDescription: 'Usado para geração determinística. Mesmo seed gera os mesmos dados.',
        quantity: 'Quantidade (N)',
        quantityDescription: 'Número de registros a serem gerados.',
        batchSize: 'Tamanho do Batch (SQL)',
        batchSizeDescription: 'Número de registros por batch nos comandos INSERT SQL.',
        tableName: 'Nome da Tabela (SQL)',
        tableNameDescription: 'Nome usado nos comandos INSERT gerados.',
        locale: 'Locale',
        localeDescription: 'Locale para dados localizados (nomes, endereços, etc.).',
        generate: 'Gerar',
        generating: 'Gerando...',

        // Large dataset warnings
        largeDatasetWarning: '⚠️ Datasets grandes podem afetar a performance. Considere usar valores menores.',

        // Output sections
        json: 'JSON',
        csv: 'CSV',
        sql: 'SQL',
        text: 'Texto',
        copyJson: 'Copiar JSON',
        copyCsv: 'Copiar CSV',
        downloadCsv: 'Baixar CSV',
        selectFile: 'Selecionar Arquivo',
        dropHere: 'Solte o arquivo aqui',
        unsupportedFile: 'Tipo de arquivo não suportado',
        acceptedTypes: 'Tipos aceitos',
        maxSize: 'Máximo',
        readFileError: 'Erro ao ler o arquivo',
        processingFile: 'Processando arquivo...',
        fileLoadedSuccess: 'Arquivo carregado com sucesso',

        // Error messages
        generationError: 'Erro ao gerar dados',

        // Common
        copy: 'Copiar',
        download: 'Baixar',
        brandName: 'DevTools',
        theme: 'Tema',
        convertTo: 'Converter para',
        lines: 'linhas',

        // Not Found Page
        notFoundTitle: 'Página não encontrada',
        notFoundDescription: 'A página que você está procurando não existe ou foi movida.',
        goHome: 'Página Inicial',
        goBack: 'Voltar',

        // Tips and hints
        sqlBatchTip: 'Dica: aumente o batch para juntar INSERTs',

        // Page titles and descriptions
        typesZodTitle: 'Gerador Types Zod',
        typesZodDescription: 'Gere tipos TypeScript e schemas Zod a partir de JSON',
        jsonInput: 'Entrada JSON',
        copyTypescript: 'Copiar TypeScript',
        copyZod: 'Copiar Zod',
        comparatorTitle: 'Comparador',
        comparatorDescription: 'Compare dados JSON ou texto, inclusive caracteres invisíveis',
        availableTools: 'Ferramentas Disponíveis',
        modernToolsDescription: 'Ferramentas modernas para conversão de dados',
        chooseInputFormat: 'Escolha o formato de entrada (JSON, chave-valor, CSV)',
        homePageTitle: 'Página Inicial',

        // Generic converter layout
        inputData: 'Dados de Entrada',
        inputSectionDescription: 'Escolha o modo de entrada (Digitar ou Arquivo) e o formato abaixo para inserir seus dados.',
        chooseDataType: 'Escolha o tipo de dados',
        chooseDataTypeDesc: 'Selecione o formato que melhor representa seus dados.',
        chooseHowToInsert: 'Escolha como inserir',
        chooseHowToInsertDesc: 'Digite manualmente ou envie um arquivo.',
        insertData: 'Insira os dados',
        insertDataDesc: 'Cole ou digite os dados conforme o formato selecionado.',
        validFormat: 'Formato válido',
        loadExample: 'Carregar Exemplo',
        conversionError: 'Erro na conversão',
        insertDataConvertSeeResult: 'Insira dados e clique em "Converter" para ver o resultado',
        fixErrors: 'Corrigir Erros',
        selectData: 'Selecione Dados',

        // ConverterInfo
        showConverterInfo: 'Ver para que serve este conversor',
        hideDetails: 'Ocultar detalhes',
        exampleInputLabel: 'Exemplo de entrada',
        exampleOutputLabel: 'Exemplo de saída',

        // JSON converter usage content
        json_usage_summary: 'Use quando precisar normalizar diferentes formatos (CSV, YAML, XML, key=value) para um JSON único para integrações e testes.',
        json_usecase_centralize_title: 'Centralizar dados de configuração',
        json_usecase_centralize_desc: 'Transformar YAML/XML de configuração em JSON para consumo por front-ends e pipelines.',

        // CSV converter usage content
        csv_usage_summary: 'Quando você precisa gerar CSV para planilhas ou ferramentas de BI.',
        csv_usecase_export_title: 'Exportar para Excel/Sheets',
        csv_usecase_export_desc: 'Converter respostas JSON em CSV para análise rápida.',

        // FormData converter usage content
        formdata_usage_summary: 'Ideal para simular envios de formulários e testar endpoints multipart/form-data.',
        formdata_usecase_simulate_title: 'Simular envio de formulário',
        formdata_usecase_simulate_desc: 'Criar rapidamente um FormData a partir de JSON/CSV e visualizar chaves e valores.',

        // XML converter usage content
        xml_usage_summary: 'Gera XML para integrações legadas, configurações ou serviços.',
        xml_usecase_legacy_title: 'Exportar para sistemas legados',
        xml_usecase_legacy_desc: 'Transformar JSON em XML com hierarquia para consumo por serviços antigos.',

        // YAML converter usage content
        yaml_usage_summary: 'Gerar YAML legível a partir de JSON ou chave=valor.',
        yaml_usecase_configs_title: 'Gerar configs de serviços',
        yaml_usecase_configs_desc: 'Converter JSON de configuração em YAML para Kubernetes, GitHub Actions etc.',

        // JSON Schema usage content
        jsonschema_usage_summary: 'Crie rapidamente um schema para validar payloads e contratos de API a partir de exemplos.',
        jsonschema_usecase_ci_title: 'Validar payloads em pipelines',
        jsonschema_usecase_ci_desc: 'Gerar JSON Schema para validar arquivos de dados em CI/CD.',

        // OpenAPI usage content
        openapi_usage_summary: 'Gere rapidamente uma especificação OpenAPI a partir de exemplos para documentar e testar APIs.',
        openapi_usecase_docs_title: 'Documentar endpoints',
        openapi_usecase_docs_desc: 'Converter exemplos de requests/responses em um esqueleto OpenAPI.',

        // SQL usage content
        sql_usage_summary: 'Produza INSERT/UPDATE/CREATE TABLE a partir de JSON/CSV para popular bancos ou preparar migrações.',
        sql_usecase_seed_title: 'Popular ambiente de desenvolvimento',
        sql_usecase_seed_desc: 'Gerar INSERTs a partir de fixtures JSON.',

        // DB Migration usage content
        dbmig_usage_summary: 'Crie migrações UP/DOWN e dados de seed a partir de exemplos, agilizando prototipação.',
        dbmig_usecase_skeleton_title: 'Esqueleto de migração rápida',
        dbmig_usecase_skeleton_desc: 'Gerar CREATE TABLE e seeds iniciais a partir de JSON.',

        // HomePage specific
        foundProblem: 'Encontrou um problema?',
        reportOnGithub: 'Reporte diretamente nas issues do nosso GitHub. Seu feedback ajuda a melhorar a ferramenta.',
        openIssues: 'Abrir Issues',
        howToStart: 'Como começar',
        chooseToolDescription: 'Escolha uma ferramenta abaixo para começar a converter seus dados. Cada ferramenta é especializada em um tipo específico de conversão.',
        enterDataValidation: 'Insira os dados com validação em tempo real',
        convertDownloadResult: 'Converta e baixe o resultado no formato desejado',
        powerfulConversion: 'Conversão Poderosa',
        powerfulConversionDesc: 'Suporte completo aos transformadores do DataReBuilder com múltiplos formatos de entrada',
        secureProcessing: 'Processamento Seguro',
        secureProcessingDesc: 'Todo processamento é feito localmente usando as classes do domínio robustas',
        modernInterface: 'Interface Moderna',
        modernInterfaceDesc: 'Design elegante com validação em tempo real e feedback visual inteligente',
        toolsCount: '{{count}} ferramentas',
        acceptedInputTypes: 'Tipos de Entrada Aceitos',
        supportedOutputs: 'Saídas Suportadas',

        // Common UI states and actions
        success: 'Sucesso',
        updated: 'Atualizado',
        table: 'Tabela',
        raw: 'Bruto',
        noData: 'Sem dados',
        jsonInvalidError: 'JSON inválido em uma das entradas',
        noDifferences: 'Sem diferenças',
        diffEditor: 'Editor com Diff',
        result: 'Resultado',

        // Tool Names - Converters
        convertToJson: 'Converter para JSON',
        convertToCsv: 'Converter para CSV',
        convertToFormData: 'Converter para FormData',
        convertToXml: 'Converter para XML',
        convertToYaml: 'Converter para YAML',
        convertToJsonSchema: 'Converter para JSON Schema',
        convertToOpenApi: 'Converter para OpenAPI',
        convertToSql: 'Converter para SQL',
        convertToDatabaseMigration: 'Converter para Database Migration',

        // Tool Names - Generators
        typesZodGenerator: 'Types Zod',
        mockDataGenerator: 'Mock Data',

        // Tool Names - Comparators
        dataComparator: 'Comparador de Dados',

        // Tool Descriptions
        convertToJson_desc: 'Converte dados estruturados (chave-valor, JSON, CSV) em objetos JSON organizados com validação em tempo real.',
        convertToCsv_desc: 'Transforma dados estruturados em arquivos CSV com formatação adequada e escape de caracteres especiais.',
        convertToFormData_desc: 'Converte dados estruturados em FormData para envio de formulários web com preview interativo.',
        convertToXml_desc: 'Transforma dados estruturados em XML com suporte a atributos e hierarquia.',
        convertToYaml_desc: 'Converte dados para YAML legível para configurações e dados estruturados.',
        convertToJsonSchema_desc: 'Gera schemas JSON automaticamente para validação de dados.',
        convertToOpenApi_desc: 'Gera especificações OpenAPI a partir de exemplos de dados.',
        convertToSql_desc: 'Gera scripts SQL (INSERT, UPDATE ou CREATE TABLE).',
        convertToDatabaseMigration_desc: 'Gera scripts de migração (UP/DOWN) com suporte a seed data.',
        typesZodGenerator_desc: 'Gere tipos TS e schemas Zod a partir de JSON.',
        mockDataGenerator_desc: 'Gere mocks a partir de JSON Schema ou OpenAPI em JSON/CSV/SQL.',
        dataComparator_desc: 'Compare JSON e texto, detectando caracteres invisíveis.',

        // Common UI states and actions
        manual: 'Manual',
        file: 'Arquivo',
        dropFileHere: 'Arraste e solte um arquivo aqui, ou clique para selecionar',
    },
};

export type SupportedLanguage = keyof typeof translations;

// Translation function
function getNestedValue(obj: any, path: string[]): string {
    return path.reduce((current, key) => current?.[key], obj) as string;
}

// Context for internationalization
interface I18nContextType {
    language: SupportedLanguage;
    setLanguage: (lang: SupportedLanguage) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Hook for translations
export function useTranslation() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useTranslation must be used within an I18nProvider');
    }
    return context;
}

// Provider component
interface I18nProviderProps {
    children: ReactNode;
    defaultLanguage?: SupportedLanguage;
}

export function I18nProvider({ children, defaultLanguage = 'en' }: I18nProviderProps) {
    const [language, setLanguage] = useState<SupportedLanguage>(() => {
        // Try to get language from localStorage, fallback to browser language, then default
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('language') as SupportedLanguage;

            if (stored && translations[stored]) {
                return stored;
            }

            // Check browser language
            const browserLang = navigator.language.replace('-', '_');

            if (browserLang === 'pt_BR' || browserLang.startsWith('pt')) {
                return 'pt_BR';
            }
        }
        return defaultLanguage;
    });

    // Save language to localStorage when it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', language);
        }
    }, [language]);

    const t = (key: string): string => {
        const keys = key.split('.');
        const translation = getNestedValue(translations[language], keys);

        if (translation && typeof translation === 'string') {
            return translation;
        }

        // Fallback to English if translation not found
        const englishTranslation = getNestedValue(translations.en, keys);
        if (englishTranslation && typeof englishTranslation === 'string') {
            return englishTranslation;
        }

        // Fallback to key if no translation found
        return key;
    };

    const value = {
        language,
        setLanguage,
        t,
    };

    return <I18nContext.Provider value={value}> {children} </I18nContext.Provider>;
}
