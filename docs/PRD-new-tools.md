## PRD: Novas Ferramentas DevTools

### Status Atual (Resumo)
- Types/Zod Generator: Domínio, aplicação e UI entregues (/types-zod), com registro centralizado em `presentation/src/config/tools.ts` (Home e Sidebar automáticas).
- Comparadores: JSON/Text com Monaco Diff integrados; CSV com visualização em tabela.
- Centralização de ferramentas: Home, Sidebar e Rotas geradas via `devTools`.
- Mock/Data Generator (v1): Ports, implementações simples e UI entregue (/mock-data) – geração determinística com seed, N itens, CSV multi-linha, SQL com batch automático; ajuda inline para opções.
- Consistência de Resultados: `SqlResult` criado e integrado ao `DataConverterLayout` (evita duplicação de status/ações; usa o mesmo padrão visual de CSV/JSON).

### Objetivo
- Entregar duas novas ferramentas que acelerem o fluxo diário de devs:
  - JSON ↔ Types/Zod Generator
  - Mock/Data Generator (a partir de JSON Schema/OpenAPI)
- Integrar ao padrão atual (DDD, SOLID, testes em tests/, UI/UX e theming existentes).

### Escopo (Fase 1)
- JSON ↔ Types/Zod Generator
  - Entrada: JSON (objeto/array)
  - Saída: TypeScript types/interfaces e schema Zod equivalentes
  - Opções: strict/loose (required/optional), naming strategy (PascalCase/camelCase), readonly, nullable handling, enums/union inferidos
  - Ações: visualizar no Monaco, copiar, download .ts
- Mock/Data Generator
  - Entrada: JSON Schema (2020-12) ou OpenAPI 3.x
  - Saída: JSON (N itens), CSV (N itens), SQL (INSERT com batch)
  - Opções: quantidade (N), seed determinístico, locale (pt-BR/en), coerção de formatos (email, uuid, url, date-time)
  - Ações: visualizar (JSON editor; CSV tabela/Bruto; SQL Monaco), copiar, download

### Métricas de Sucesso
- 95%+ das conversões geram tipos/schemas válidos sem ajustes manuais
- Geração de 1k mocks < 1s em máquina padrão
- Uso recorrente interno (>50% semanal)
- Zero vazamento de dados (processamento local)

### Restrições e Padrões
- Arquitetura DDD: ports no domínio; implementações na infraestrutura; composição na aplicação; UI na presentation
- Testes em tests/ espelhando estrutura; execução com pnpm
- UI consistente com branding atual; Monaco Editor (vs-dark/vs-light)
- Nomes declarativos e claros

### Requisitos Funcionais
- JSON ↔ Types/Zod
  - RF1: Gerar type/interface TS a partir de JSON
  - RF2: Gerar z.object recursivo; arrays; unions; enums por repetição de strings
  - RF3: Flags: optional vs required; readonly; naming strategy; nullable; additionalProperties
  - RF4: Preview em Monaco (TS/Zod) + copiar/baixar
  - RF5: Validar JSON e apontar erros amigáveis
- Mock/Data Generator
  - RF6: Aceitar JSON Schema/OpenAPI; converter OpenAPI → schema interno
  - RF7: Gerar N instâncias (seedável) coerentes com tipos/formatos
  - RF8: Exportar JSON/CSV/SQL (INSERT batchSize configurável)
  - RF9: Preview (JSON editor; CSV tabela/Bruto; SQL editor) + copiar/baixar
  - RF10: Validar schema e exibir mensagens amigáveis

### Requisitos Não Funcionais
- Performance: 1k registros JSON < 1s; CSV/SQL < 2s
- A11y: foco/atalhos/copy; contraste
- I18n: PT-BR (como atual)
- Segurança: offline; sem chamadas externas
- DX: portas bem definidas; cobertura de testes

### Domínio (Ports/Contratos)
- JSON ↔ Types/Zod
  - TypeModelBuilder (AST de tipos a partir de JSON)
  - ZodSchemaBuilder (AST de zod)
  - TypeScriptEmitter (AST → string .ts)
  - ZodEmitter (AST → string .ts)
- Mock/Data
  - SchemaLoader (JsonSchema/OpenAPI → InternalSchema)
  - DataFaker (InternalSchema, seed, locale → objetos)
  - CsvExporter (objs → CSV)
  - SqlInsertExporter (objs → SQL; options)

### Aplicação
- Services/fachadas:
  - TypesGeneratorService (TypeModelBuilder + Emitters)
  - MockDataService (SchemaLoader + DataFaker + Exporters)

### Infraestrutura
- Implementações:
  - DefaultTypeModelBuilder, DefaultZodSchemaBuilder
  - DefaultTypeScriptEmitter, DefaultZodEmitter
  - OpenApiToSchemaConverter, JsonSchemaValidator
  - FakerDataGenerator (faker-js/seed)
  - DefaultCsvExporter, DefaultSqlInsertExporter

### Presentation (UX)
- Rotas
  - /types-zod: Editor JSON (esq.), opções (meio), saída (tabs TS/Zod) em Monaco
  - /mock-data: Editor schema/import (esq.), opções (meio), saída (tabs JSON/CSV/SQL) com tabela para CSV
- Sidebar
  - Seção “Geradores”: “Types/Zod”, “Mock Data”

### Modelagem (alto nível)
- InternalSchema: type, properties, format, enum, items, nullable, constraints
- TypeModel AST: object/interface, property, array, union, enum
- Zod AST: z.object/z.string/z.number/z.union/z.enum etc.

### Casos de Borda
- JSON heterogêneo (unions)
- Arrays vazios (inferência desconhecida)
- Strings date vs texto livre
- OpenAPI com $ref/anyOf/allOf (resolver refs; simplificar v1)

### Telemetria (opcional v1)
- Eventos locais: generate_success/fail, copy, download, N, seed, duração

### Plano de Entrega
- Semana 1: Domínio/ports + impl mínima Types/Zod; UI básica /types-zod; testes [CONCLUÍDO]
- Semana 2: Mock/Data domínio + faker infra + exporters; UI /mock-data; CSV tabela; testes [EM ANDAMENTO]
- Semana 3: Refinos (enums/union heurísticas), performance, documentação

### Semana 2 – Mock/Data Generator (Detalhamento)

#### Requisitos Funcionais (RF)
- RF-M1: Importar JSON Schema 2020-12 (arquivo/cola) e validar schema (feedback inline).
- RF-M2: Importar OpenAPI 3.x (arquivo/cola) e converter para InternalSchema.
- RF-M3: Gerar N itens determinísticos (seed) com coerção por format (email, uuid, url, date, date-time) e locale.
- RF-M4: Saídas suportadas: JSON (array), CSV (tabela/monaco bruto), SQL INSERT (batchSize, tableName); copiar/baixar.
- RF-M5: Opções: seed, N (limite sugerido 5000 com aviso), locale, batchSize, tableName, includeNulls.
- RF-M6: UI com 3 áreas: Schema/Spec (esq), Opções (meio), Saída (dir) com tabs JSON/CSV/SQL.

#### Domínio (Ports/Contratos)
- `SchemaLoader`:
  - `loadFromJsonSchema(input: unknown): InternalSchema`
  - `loadFromOpenApi(spec: unknown): InternalSchema`
- `DataFaker`:
  - `generate(schema: InternalSchema, options: { count: number; seed?: string; locale?: string }): any[]`
- `CsvExporter`:
  - `export(rows: Record<string, any>[], options?: { delimiter?: string; header?: boolean }): string`
- `SqlInsertExporter`:
  - `export(rows: Record<string, any>[], options: { tableName: string; includeNulls?: boolean; batchSize?: number }): string`

`InternalSchema` (alto nível): `{ type: 'object'|'array'|'string'|'number'|'boolean'|'null'; properties?; items?; enum?; format?; required?; nullable? }`

#### Infraestrutura (Implementações)
- `OpenApiToSchemaConverter`: resolve $ref locais, simplifica anyOf/allOf/oneOf (v1: prioriza o primeiro válido), extrai component schemas.
- `JsonSchemaValidator`: valida entrada e gera erros amigáveis (linha/coluna quando possível).
- `FakerDataGenerator`: usa faker-js (locale), seedrandom (seed), e heurísticas por format; objetos recursivos, arrays com tamanho padrão (ex.: 1-3) configurável.
- `DefaultCsvExporter`: reaproveita `JsonToCsvBuilder` quando possível; aceita delimitador ',' e header on/off.
- `DefaultSqlInsertExporter`: reaproveita `JsonToSqlInsertBuilder` com normalização de linhas/batches.

#### Aplicação
- `MockDataService`
  - `generateFromJsonSchema(schema: unknown, options): { json: any[]; csv: string; sql: string }`
  - `generateFromOpenApi(spec: unknown, options): idem`
  - Composição de loaders + faker + exporters; tratamento central de erros.

#### UI/UX (Presentation)
- Rota: `/mock-data` registrada via `devTools`.
- Coluna esquerda: Monaco editor com seletor (JSON Schema | OpenAPI) e botões “Exemplo”/“Limpar”.
- Abaixo do editor: Opções (seed com dica de determinismo, N com dica de quantidade, tableName com dica de uso no INSERT). Batch padrão = N.
- Coluna direita: JSON (editor), CSV (`CsvResult` tabela/bruto), SQL (`SqlResult` com copiar/baixar). Dica para batch no cabeçalho de SQL.
- Mensagens de erro compactas sob cada área.

#### Aceitação/Qualidade
- AC-M1: Dado um schema simples, gerar 1000 itens em < 1s (máquina padrão local).
- AC-M2: Alterando seed, trocam os valores; com mesma seed, reprodutível.
- AC-M3: CSV primeira linha = cabeçalho, com delimitador ",", escapando campos.
- AC-M4: SQL respeita `batchSize` e `includeNulls`, com escaping de aspas.
- AC-M5: OpenAPI mínima com schema de request/response gera `InternalSchema` válido.

#### Testes (tests/)
- `tests/domain/mock-data/`:
  - loader-json-schema: propriedades básicas, enum, required, nullable.
  - loader-openapi: components simples, $ref local, formatos comuns.
  - data-faker: seed/locale, formatos, arrays/objetos aninhados.
  - exporters: CSV com header/escape, SQL com batch/identificadores.

#### Tarefas (Implementação v1)
1) Domínio: criar ports `SchemaLoader`, `DataFaker`, `CsvExporter`, `SqlInsertExporter`.
2) Infra: `OpenApiToSchemaConverter`, `JsonSchemaValidator`, `FakerDataGenerator`, `DefaultCsvExporter`, `DefaultSqlInsertExporter`.
3) Aplicação: `MockDataService` (composição e orquestração).
4) Presentation: página `/mock-data`, registro em `devTools`, UI com editor + opções, integração com `CsvResult` e `SqlResult`.
5) Testes: cobrir casos descritos; smoke de performance (tempo medido em teste não-bloqueante).
6) Documentação: ajuda inline (tooltips) e exemplos de schema/spec.

#### Riscos e Mitigações Específicas
- Esquemas OpenAPI complexos: limitar v1 a refs locais e objetos planos/moderadamente aninhados; logar limitações.
- Geração muito grande (N alto): exibir aviso e paginar/streamar quando N > 5000.
- Locale/faker: fallback para en caso de locale inválido.

### Riscos/Mitigação
- Inferência ambígua → flags/overrides na UI
- OpenAPI complexo → reduzir escopo v1; priorizar schemas simples
- Performance para N grande → paginação/streaming e batchSize

### Perguntas em Aberto
- Suporte “TS → Zod” na v1?
- Limite máximo de N (sugerido: 5000 com aviso)?
- Padrões de nomes (prefixos/sufixos) e zip multi-arquivos no download?

---

## Ferramentas Futuras (Backlog Detalhado)

### 1) JWT/Encoding Toolkit
Objetivo: inspecionar/validar tokens e realizar encodes/decodes comuns do dia a dia.

- Funcionalidades
  - Decoder/inspector de JWT (header/payload/assinatura), verificação HS/RS (chave/PEM fornecidos localmente)
  - Base64/Base64Url encode/decode; URL encode/decode; Hex/Binary
  - UUID/ULID gerar/validar
- Domínio (ports)
  - JwtVerifier (verify/decode)
  - EncoderDecoder (string ↔ encodes)
  - IdGenerator (uuid/ulid)
- UI/UX
  - Monaco para JSON do payload, feedback de validade, alertas de expiração/nbf/iat
  - Botões copiar/baixar; nada sai do client

### 2) Regex Lab
Objetivo: testar regex rapidamente com visualização de matches e groups.

- Funcionalidades
  - Suporte a flags (g,i,m,s,u)
  - Destaque de matches e capture groups no texto
  - “Explicar regex” curta (heurística) e snippets comuns
- Domínio (ports)
  - RegexEngine (match, groups, replace preview)
- UI/UX
  - Editor de padrão e texto (Monaco); painel com matches/gps; copiar resultado

### 3) .env Manager
Objetivo: ajudar a padronizar e auditar arquivos .env.

- Funcionalidades
  - Diff/merge entre 2+.env; detectar duplicatas/ausentes; normalizar ordem e comentários
  - Detecção de possíveis segredos expostos (heurística) e dicas de boas práticas
- Domínio (ports)
  - EnvParser (parse/serialize)
  - EnvDiffer (diff/merge rules)
- UI/UX
  - Tabela de chaves/valores (com alerta), exportar .env normalizado, copiar

### 4) JSON Patch Lab
Objetivo: gerar/aplicar patches (RFC 6902) e merge patch, com visualização.

- Funcionalidades
  - Gerar JSON Patch entre A e B
  - Aplicar patch e visualizar resultado e erros por operação
- Domínio (ports)
  - JsonPatchGenerator (diff → ops)
  - JsonPatchApplier (apply)
- UI/UX
  - Três editores: origem, patch/gerado, destino; diff inline opcional

### 5) Datas/Timezone/Cron
Objetivo: utilitários comuns de datas e agendamento.

- Funcionalidades
  - Conversor epoch ↔ humana (com TZ)
  - Conversor de timezones (exibir múltiplas TZ lado a lado)
  - Parser de cron (próximas N execuções + timeline)
- Domínio (ports)
  - TimeConverter (epoch/TZ)
  - CronParser (next runs)
- UI/UX
  - Pequenos widgets com copy; escolha de locale/TZ

### 6) SQL Formatter/Beautifier (Observação de Integração)
Objetivo: padronizar formatação SQL e concentrar a lógica em um único ponto do sistema.

- Diretriz de Integração
  - Centralizar o formatador SQL em um serviço compartilhado, reutilizado por:
    - Conversor para SQL (INSERT/UPDATE/CREATE TABLE)
    - Mock/Data Generator (saída SQL)
    - Ferramenta dedicada de “SQL Formatter”
  - Isso evita divergência de estilos e mantém a experiência consistente
- Funcionalidades
  - Formatador com opções (quote identifiers, upper/lower keywords, indent size)
  - Linter básico (quebras de linha, trailing commas conforme dialeto suportado)
- Domínio (ports)
  - SqlFormatter (format(sql, options))
- UI/UX
  - Editor Monaco com preview e copiar/baixar; pode conviver dentro das telas que já exibem SQL



