// Leve formatador de SQL para visualização e cópia/download
// Não cobre todos os casos, mas melhora legibilidade (linhas/chaves/indentação)

const KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
    'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT', 'UNIQUE', 'NOT NULL', 'DEFAULT'
]

function safeUpper(text: string): string {
    return KEYWORDS.reduce((acc, kw) => {
        const re = new RegExp(`\\b${kw.replace(/ /g, '\\s+')}\\b`, 'ig')
        return acc.replace(re, kw)
    }, text)
}

function insertLineBreaks(sql: string): string {
    let out = sql
    // Linha antes dos principais blocos
    KEYWORDS.forEach((kw) => {
        const re = new RegExp(`(?!^)\\b${kw.replace(/ /g, '\\s+')}\\b`, 'ig')
        out = out.replace(re, `\n${kw}`)
    })
    // Quebra após vírgulas em CREATE TABLE
    out = out.replace(/,\s*(?![^()]*\))/g, ',\n')
    // Condensa múltiplas quebras
    out = out.replace(/\n{3,}/g, '\n\n')
    return out.trim()
}

export function formatSql(input: unknown): string {
    if (input == null) return ''
    let sql = String(input)
    if (!sql.trim()) return ''
    // Normaliza espaços e padroniza palavras-chave
    sql = safeUpper(sql)
    sql = insertLineBreaks(sql)

    // Indentação simples baseada em parênteses
    const lines = sql.split(/\n/)
    let depth = 0
    const indented = lines.map((line) => {
        const trimmed = line.trim()
        // Diminui antes se a linha começa com ) ou termina com ) ;
        const closeCount = (trimmed.match(/^\)/g) || []).length
        const currentDepth = Math.max(0, depth - closeCount)
        const ind = '    '.repeat(currentDepth)
        // Ajusta depth para próxima linha
        const opens = (trimmed.match(/\(/g) || []).length
        const closes = (trimmed.match(/\)/g) || []).length
        depth = Math.max(0, currentDepth + opens - closes)
        return ind + trimmed
    })
    return indented.join('\n').trim() + (/(;|\n)$/.test(sql) ? '' : ';')
}

export function formatDbMigrationText(text: string): { up: string; down: string } {
    // Aceita texto com possíveis marcadores -- up / -- down
    const upMatch = text.match(/--\s*up[\s\S]*?(?=--\s*down|$)/i)
    const downMatch = text.match(/--\s*down[\s\S]*?$/i)
    const up = upMatch ? upMatch[0].replace(/--\s*up\s*/i, '') : text
    const down = downMatch ? downMatch[0].replace(/--\s*down\s*/i, '') : ''
    return { up: formatSql(up), down: formatSql(down) }
}


