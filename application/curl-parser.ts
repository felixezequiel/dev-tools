export interface ParsedCurl {
    request: {
        method: string;
        url: string;
        scheme?: string;
        host?: string;
        path?: string;
        query?: Record<string, string | string[]>;
        headers?: Record<string, string>;
        cookies?: Record<string, string>;
        auth?: { type: 'basic'; user: string; password: string } | { type: 'bearer'; token: string };
        body?: {
            type: 'raw' | 'json' | 'urlencoded' | 'multipart' | 'binary';
            raw?: string;
            json?: any;
            form?: Record<string, string | string[]>;
            parts?: Array<{ name: string; value?: string; filename?: string; contentType?: string }>;
        };
        compressed?: boolean;
    };
}

function tokenize(command: string): string[] {
    // Very simple tokenizer respecting single/double quotes and escapes
    const tokens: string[] = [];
    let current = '';
    let quote: '"' | "'" | null = null;
    for (let i = 0; i < command.length; i++) {
        const ch = command[i];
        if (quote) {
            if (ch === '\\' && i + 1 < command.length) {
                current += command[++i];
                continue;
            }
            if (ch === quote) {
                quote = null;
                continue;
            }
            current += ch;
        } else {
            if (ch === '"' || ch === "'") {
                quote = ch as '"' | "'";
                continue;
            }
            if (/\s/.test(ch)) {
                if (current) {
                    tokens.push(current);
                    current = '';
                }
                continue;
            }
            current += ch;
        }
    }
    if (current) tokens.push(current);
    return tokens;
}

function parseHeaders(values: string[]): Record<string, string> {
    const headers: Record<string, string> = {};
    for (const v of values) {
        const idx = v.indexOf(':');
        if (idx > 0) {
            const name = v.slice(0, idx).trim();
            const value = v.slice(idx + 1).trim();
            headers[name] = value;
        }
    }
    return headers;
}

function parseCookies(headerValue: string | undefined): Record<string, string> | undefined {
    if (!headerValue) return undefined;
    const cookies: Record<string, string> = {};
    headerValue.split(';').forEach(pair => {
        const idx = pair.indexOf('=');
        if (idx > 0) {
            const k = pair.slice(0, idx).trim();
            const v = pair.slice(idx + 1).trim();
            cookies[k] = v;
        }
    });
    return cookies;
}

function parseUrl(url: string): { scheme?: string; host?: string; path?: string; query?: Record<string, string | string[]> } {
    try {
        const u = new URL(url);
        const query: Record<string, string | string[]> = {};
        u.searchParams.forEach((value, key) => {
            if (query[key]) {
                const prev = query[key];
                query[key] = Array.isArray(prev) ? [...prev, value] : [prev as string, value];
            } else {
                query[key] = value;
            }
        });
        return { scheme: u.protocol.replace(':', ''), host: u.host, path: u.pathname, query };
    } catch {
        return {};
    }
}

function tryParseJson(text?: string): any | undefined {
    if (!text) return undefined;
    try {
        return JSON.parse(text);
    } catch {
        return undefined;
    }
}

export function parseCurlToJson(input: string): ParsedCurl {
    const trimmed = input.trim();
    if (!/^curl\b/.test(trimmed)) {
        throw new Error('Entrada cURL deve começar com "curl"');
    }

    const tokens = tokenize(trimmed);
    // Remove initial 'curl'
    if (tokens[0] === 'curl') tokens.shift();

    const headerValues: string[] = [];
    const formParts: Array<{ name: string; value?: string; filename?: string; contentType?: string }> = [];
    let url: string | undefined;
    let method: string | undefined;
    let dataRaw: string | undefined;
    let dataBinary: string | undefined;
    let compressed = false;
    let authUser: string | undefined;
    let authPass: string | undefined;

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        switch (t) {
            case '-X':
            case '--request':
                method = tokens[++i];
                break;
            case '-H':
            case '--header':
                headerValues.push(tokens[++i]);
                break;
            case '-d':
            case '--data':
            case '--data-raw':
                dataRaw = (dataRaw ?? '') + (dataRaw ? '&' : '') + (tokens[++i] ?? '');
                if (!method) method = 'POST';
                break;
            case '--data-binary':
                dataBinary = tokens[++i];
                if (!method) method = 'POST';
                break;
            case '--data-urlencode': {
                const v = tokens[++i] ?? '';
                dataRaw = (dataRaw ?? '') + (dataRaw ? '&' : '') + v;
                if (!method) method = 'POST';
                break;
            }
            case '-F':
            case '--form': {
                const part = tokens[++i] ?? '';
                // name=value or name=@file;type=...;filename=...
                const [name, rest] = part.split('=', 2);
                if (rest && rest.startsWith('@')) {
                    const afterAt = rest.slice(1);
                    const segments = afterAt.split(';');
                    const filename = segments[0];
                    const opts = segments.slice(1);
                    const p: any = { name, filename };
                    opts.forEach(opt => {
                        const [k, v] = opt.split('=', 2);
                        if (k === 'type') p.contentType = v;
                        if (k === 'filename') p.filename = v;
                    });
                    formParts.push(p);
                } else {
                    formParts.push({ name, value: rest });
                }
                if (!method) method = 'POST';
                break;
            }
            case '-u':
            case '--user': {
                const cred = tokens[++i] ?? '';
                const idx = cred.indexOf(':');
                if (idx >= 0) {
                    authUser = cred.slice(0, idx);
                    authPass = cred.slice(idx + 1);
                } else {
                    authUser = cred;
                    authPass = '';
                }
                break;
            }
            case '--compressed':
                compressed = true;
                break;
            default:
                if (!t.startsWith('-')) {
                    url = t;
                }
        }
    }

    const headers = parseHeaders(headerValues);
    const cookies = parseCookies(headers['Cookie'] || headers['cookie']);

    // Determine body type
    let body: ParsedCurl['request']['body'] | undefined;
    if (formParts.length) {
        body = { type: 'multipart', parts: formParts };
    } else if (dataRaw != null) {
        const json = tryParseJson(dataRaw);
        if (json !== undefined) body = { type: 'json', json, raw: dataRaw };
        else {
            // detect urlencoded k=v&k2=v2
            const form: Record<string, string | string[]> = {};
            const pairs = dataRaw.split('&').filter(Boolean);
            if (pairs.length > 0 && pairs.every(p => p.includes('='))) {
                for (const p of pairs) {
                    const [k, v] = p.split('=');
                    const key = decodeURIComponent(k);
                    const val = decodeURIComponent(v ?? '');
                    if (form[key]) {
                        const prev = form[key];
                        form[key] = Array.isArray(prev) ? [...prev, val] : [prev as string, val];
                    } else {
                        form[key] = val;
                    }
                }
                body = { type: 'urlencoded', raw: dataRaw, form };
            } else {
                body = { type: 'raw', raw: dataRaw };
            }
        }
    } else if (dataBinary != null) {
        body = { type: 'binary', raw: dataBinary };
    }

    const methodFinal = (method || (body ? 'POST' : 'GET')).toUpperCase();

    const parsedUrl = url ? parseUrl(url) : {};

    const out: ParsedCurl = {
        request: {
            method: methodFinal,
            url: url || '',
            ...parsedUrl,
            headers: Object.keys(headers).length ? headers : undefined,
            cookies,
            auth: authUser !== undefined ? { type: 'basic', user: authUser!, password: authPass ?? '' } : undefined,
            body,
            compressed: compressed || undefined
        }
    };

    return out;
}


