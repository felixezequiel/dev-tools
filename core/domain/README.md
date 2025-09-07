# Conversores de Dados Avançados

Este módulo oferece um conjunto completo de conversores de dados projetados para acelerar o trabalho de **desenvolvedores** e **DBAs**. A arquitetura segue os princípios SOLID e permite conversões flexíveis entre diferentes formatos de dados.

## 🚀 Funcionalidades Implementadas

### 1. Conversores SQL
- **INSERT statements**: Geração automática de comandos INSERT com suporte a lotes
- **UPDATE statements**: Updates inteligentes com detecção automática de chaves primárias
- **CREATE TABLE**: Criação automática de tabelas baseada em dados de exemplo

### 2. Conversores para Formatos Modernos
- **XML**: Conversão completa com suporte a atributos e namespaces
- **YAML**: Formatação elegante para configurações e dados estruturados

### 3. Validação e Documentação
- **JSON Schema**: Geração automática de schemas para validação de dados
- **OpenAPI Specification**: Documentação automática de APIs REST

### 4. Migrações de Banco de Dados
- **Scripts de migração**: Geração completa de migrations UP/DOWN
- **Suporte a dados iniciais**: Inclusão automática de seed data

## 📋 Exemplos de Uso

### Para DBAs

```typescript
import { DataReBuilder } from './service';

// Criar migration completa
const migration = dataReBuilder
    .rebuildFrom(userData)
    .toDatabaseMigration({
        tableName: "users",
        includeData: true
    });

console.log(migration.up);   // Script UP
console.log(migration.down); // Script DOWN
```

### Para Desenvolvedores

```typescript
// Gerar documentação OpenAPI
const openApiSpec = dataReBuilder
    .rebuildFrom(userData)
    .toOpenApiSpec({
        title: "User API",
        endpoint: "/api/users",
        method: "POST"
    });

// Gerar schema de validação
const schema = dataReBuilder
    .rebuildFrom(userData)
    .toJsonSchema({
        title: "User Validation Schema",
        strictMode: true
    });
```

## 🏗️ Arquitetura

O sistema segue uma arquitetura limpa baseada em:

- **Ports & Adapters**: Interfaces bem definidas para extensibilidade
- **SOLID Principles**: Código modular e testável
- **Builder Pattern**: Construção fluente de conversores
- **Dependency Injection**: Injeção de dependências para flexibilidade

## 📁 Estrutura de Arquivos

```
application/
├── json-to-sql-insert.ts          # Conversor SQL INSERT
├── json-to-sql-update.ts          # Conversor SQL UPDATE
├── json-to-sql-create-table.ts    # Conversor CREATE TABLE
├── json-to-xml.ts                 # Conversor XML
├── json-to-yaml.ts                # Conversor YAML
├── json-to-json-schema.ts         # Gerador JSON Schema
├── json-to-database-migration.ts  # Gerador migrations
├── json-to-openapi.ts            # Gerador OpenAPI
├── rebuild-pipeline.ts           # Pipeline principal (atualizado)
├── examples.ts                   # Exemplos práticos
└── ports/                        # Interfaces
    ├── json-output-builder.ts
    └── json-serializer.ts
```

## ⚡ Benefícios

### Para Desenvolvedores
- ✅ Geração automática de schemas de validação
- ✅ Documentação OpenAPI instantânea
- ✅ Conversão rápida entre formatos
- ✅ Redução de código boilerplate

### Para DBAs
- ✅ Scripts SQL gerados automaticamente
- ✅ Migrations com dados de exemplo
- ✅ Detecção inteligente de tipos de dados
- ✅ Suporte a operações em lote

## 🔧 Como Usar

1. **Instancie o serviço**:
```typescript
const dataReBuilder = new DataReBuilder();
```

2. **Crie um pipeline**:
```typescript
const pipeline = dataReBuilder.rebuildFrom(yourData);
```

3. **Converta para o formato desejado**:
```typescript
const result = pipeline.toSqlInsert({ tableName: "users" });
```

## 📈 Casos de Uso Reais

- **Importação de dados**: Converter JSON para SQL INSERT em lote
- **Documentação de APIs**: Gerar specs OpenAPI a partir de exemplos
- **Validação de dados**: Criar schemas JSON automaticamente
- **Migrações de banco**: Gerar scripts de migration completos
- **Integrações legadas**: Converter para XML para sistemas antigos
- **Configurações**: Exportar dados como YAML para configs

## 🎯 Próximos Passos

- [ ] Suporte a mais dialetos SQL (PostgreSQL, Oracle)
- [ ] Conversores para GraphQL schemas
- [ ] Geração de testes unitários
- [ ] Suporte a streaming para datasets grandes
- [ ] Interface web para uso interativo

---

**Feito com ❤️ para acelerar o trabalho de desenvolvedores e DBAs brasileiros**
