import { describe, it, expect } from 'vitest';
import { parseCurlToJson } from '../../application/curl-parser';

describe('parseCurlToJson', () => {
    it('parses basic GET', () => {
        const out = parseCurlToJson("curl 'https://api.example.com/users?limit=10&active=true'");
        expect(out.request.method).toBe('GET');
        expect(out.request.url).toContain('https://api.example.com/users');
        expect(out.request.query?.limit).toBe('10');
        expect(out.request.query?.active).toBe('true');
    });

    it('parses headers and cookies', () => {
        const out = parseCurlToJson("curl -H 'Accept: application/json' -H 'Cookie: sid=abc; theme=dark' https://example.com");
        expect(out.request.headers?.Accept).toBe('application/json');
        expect(out.request.cookies?.sid).toBe('abc');
        expect(out.request.cookies?.theme).toBe('dark');
    });

    it('parses POST with JSON body', () => {
        const out = parseCurlToJson("curl -X POST -H 'Content-Type: application/json' -d '{\"name\":\"John\"}' https://example.com/users");
        expect(out.request.method).toBe('POST');
        expect(out.request.body?.type).toBe('json');
        expect(out.request.body?.json?.name).toBe('John');
    });

    it('parses POST with urlencoded body', () => {
        const out = parseCurlToJson("curl -d 'name=John&age=30' https://example.com/users");
        expect(out.request.body?.type).toBe('urlencoded');
        expect(out.request.body?.form?.name).toBe('John');
        expect(out.request.body?.form?.age).toBe('30');
    });

    it('parses multipart form', () => {
        const out = parseCurlToJson("curl -F 'name=John' -F 'avatar=@photo.png;type=image/png' https://example.com/upload");
        expect(out.request.body?.type).toBe('multipart');
        expect(out.request.body?.parts?.[0].name).toBe('name');
        expect(out.request.body?.parts?.[1].filename).toBe('photo.png');
    });

    it('parses basic auth', () => {
        const out = parseCurlToJson("curl -u 'user:pass' https://example.com");
        expect(out.request.auth?.type).toBe('basic');
        expect((out.request.auth as any).user).toBe('user');
    });
});


