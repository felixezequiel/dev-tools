// Polyfill minimal FormData/File for Node using undici
import { FormData, File } from 'undici';

// Only set up polyfills if they don't exist
if (typeof globalThis !== 'undefined') {
    // @ts-ignore
    if (!(globalThis as any).FormData) (globalThis as any).FormData = FormData;
    // @ts-ignore
    if (!(globalThis as any).File) (globalThis as any).File = File as any;
}


