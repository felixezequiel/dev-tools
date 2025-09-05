# Data ReBuilder – Padrões e Extensões

Este módulo centraliza reconstrução de dados entre formatos (FormData, JSON, etc.) seguindo princípios de SOLID e DDD.

## Visão Geral
- `DataReBuilder` (service): serviço central com API fluente `rebuildFrom(source).toJSON() | toFormData() | toCsv()`.
- Value Objects e Estratégias:
  - `KeyPath`: representa o caminho de chaves.
  - `KeyPathParser` (`DotBracketKeyPathParser`): converte string em `KeyPath` (dot + [index]).
  - `ValueCoercer` (`LiteralStringValueCoercer`): converte valores de entrada (FormData) para tipos do domínio.
  - `StructureMutator` (`NestedPathStructureMutator`): aplica valores em objeto/array no caminho informado.
- Adapters/Fonte:
  - `EntrySource` (contrato)
  - `FormDataEntrySource`, `JsonDataEntrySource`, `CsvDataEntrySource`
- Direção inversa:
  - `JsonToFormDataBuilder`: constrói `FormData` a partir de JSON.
  - `JsonToCsvBuilder`: constrói CSV a partir de JSON.
  - `KeyPathFormatter` (`DotBracketKeyPathFormatter`): formata segmentos em chave.
  - `JsonSerializer` (`DefaultJsonToFormDataSerializer`): serializa valores para `FormDataEntryValue`.

## Regras de Design (para novas transformações)
1. Uma classe por arquivo. Nomeie pelo comportamento (declarativo e compreensível).
2. Dependa de interfaces (DIP). Injete implementações via construtor.
3. Separe responsabilidades:
   - Parse/format do caminho (parser/formatter)
   - Coerção/serialização de valores (coercer/serializer)
   - Mutação da estrutura (mutator)
   - Fontes/destinos (adapters, ex.: `EntrySource`)
4. Não codifique regras de domínio na infraestrutura. Forneça implementações padrão e permita customização.
5. Preserve contratos (interfaces) e retrocompatibilidade em APIs públicas.

## Como adicionar uma nova transformação
- Nova fonte (ex.: QueryString):
  1. Crie `XxxEntrySource` que implementa `EntrySource<TKey, TValue>` e exponha `entries()`.
  2. Use `new DataReBuilder().rebuildFrom(new XxxEntrySource(...))`.
- Nova sintaxe de caminho:
  1. Crie `XxxKeyPathParser` e injete no `DataReBuilder`.
- Novas regras de tipos (datas/números/enums):
  1. Crie `XxxValueCoercer` para FormData -> JSON.
  2. Crie `XxxJsonSerializer` para JSON -> FormData.
- Estrutura destino diferente (ex.: Map/Set):
  1. Crie `XxxStructureMutator` que materializa e aplica valores.
- JSON -> Outro formato:
  1. Crie `JsonToXxxBuilder` com `KeyPathFormatter` e `JsonSerializer` adequados.

## Exemplos
```ts
// API fluente
const service = new DataReBuilder();

// FormData -> JSON
const json = service.rebuildFrom(new FormDataEntrySource(formData)).toJSON();

// JSON -> FormData
const fd = service.rebuildFrom(new JsonDataEntrySource(json)).toFormData();

// JSON -> CSV
const csv = service.rebuildFrom(new JsonDataEntrySource(json)).toCsv();

// CSV -> JSON
const backToJson = service.rebuildFrom(new CsvDataEntrySource(csv)).toJSON();

// Customizando estratégias
const custom = new DataReBuilder({
  parser: new MyParser(),
  coercer: new MyCoercer(),
  mutator: new MyMutator(),
});
```

## Convenções de Nomes
- `XxxEntrySource` para fontes de entrada.
- `XxxKeyPathParser` / `XxxKeyPathFormatter` para caminho.
- `XxxValueCoercer` (FormData -> JSON) e `XxxJsonSerializer` (JSON -> FormData).
- `XxxStructureMutator` para aplicação de valores na estrutura destino.
- `JsonToXxxBuilder` para construtores de saída.

## Como estender com um novo formato (ex.: XML)
- Crie `XmlDataEntrySource` implementando `EntrySource<string, string>` ou adequado.
- Crie `JsonToXmlBuilder` se desejar saída XML a partir de JSON.
- Opcional: novos `KeyPathParser`/`Formatter` e `JsonSerializer`/`ValueCoercer` específicos.
- Uso:
```ts
const xmlToJson = new DataReBuilder()
  .rebuildFrom(new XmlDataEntrySource(xmlString))
  .toJSON();

const jsonToXml = new JsonToXmlBuilder().build(json);
```
