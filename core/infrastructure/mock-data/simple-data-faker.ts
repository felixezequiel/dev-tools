import { DataFaker, DataFakerOptions, InternalArraySchema, InternalBooleanSchema, InternalNullSchema, InternalNumberSchema, InternalObjectSchema, InternalSchema, InternalStringSchema, InternalUnionSchema } from '../../domain/ports/mock-data';
import { faker } from '@faker-js/faker';
import { Faker, allFakers } from '@faker-js/faker';

function seededRandom(seed: string | undefined) {
    let h = 2166136261 >>> 0;
    const s = seed || 'seed';
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return () => {
        h += 0x6D2B79F5;
        let t = Math.imul(h ^ (h >>> 15), 1 | h);
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Type-safe function to get faker for locale
function getFakerForLocale(locale?: string): Faker {
    if (!locale || locale === 'en') {
        return faker;
    }

    // Safe lookup using the exact keys from allFakers
    switch (locale) {
        case 'af_ZA': return allFakers.af_ZA;
        case 'ar': return allFakers.ar;
        case 'az': return allFakers.az;
        case 'base': return allFakers.base;
        case 'bn_BD': return allFakers.bn_BD;
        case 'cs_CZ': return allFakers.cs_CZ;
        case 'cy': return allFakers.cy;
        case 'da': return allFakers.da;
        case 'de': return allFakers.de;
        case 'de_AT': return allFakers.de_AT;
        case 'de_CH': return allFakers.de_CH;
        case 'dv': return allFakers.dv;
        case 'el': return allFakers.el;
        case 'en': return allFakers.en;
        case 'en_AU': return allFakers.en_AU;
        case 'en_CA': return allFakers.en_CA;
        case 'en_GB': return allFakers.en_GB;
        case 'en_IE': return allFakers.en_IE;
        case 'en_IN': return allFakers.en_IN;
        case 'en_US': return allFakers.en_US;
        case 'es': return allFakers.es;
        case 'es_MX': return allFakers.es_MX;
        case 'fa': return allFakers.fa;
        case 'fi': return allFakers.fi;
        case 'fr': return allFakers.fr;
        case 'fr_BE': return allFakers.fr_BE;
        case 'fr_CA': return allFakers.fr_CA;
        case 'fr_CH': return allFakers.fr_CH;
        case 'he': return allFakers.he;
        case 'hr': return allFakers.hr;
        case 'hu': return allFakers.hu;
        case 'hy': return allFakers.hy;
        case 'id_ID': return allFakers.id_ID;
        case 'it': return allFakers.it;
        case 'ja': return allFakers.ja;
        case 'ka_GE': return allFakers.ka_GE;
        case 'ko': return allFakers.ko;
        case 'lv': return allFakers.lv;
        case 'mk': return allFakers.mk;
        case 'nb_NO': return allFakers.nb_NO;
        case 'ne': return allFakers.ne;
        case 'nl': return allFakers.nl;
        case 'nl_BE': return allFakers.nl_BE;
        case 'pl': return allFakers.pl;
        case 'pt_BR': return allFakers.pt_BR;
        case 'pt_PT': return allFakers.pt_PT;
        case 'ro': return allFakers.ro;
        case 'ro_MD': return allFakers.ro_MD;
        case 'ru': return allFakers.ru;
        case 'sk': return allFakers.sk;
        case 'sv': return allFakers.sv;
        case 'th': return allFakers.th;
        case 'tr': return allFakers.tr;
        case 'uk': return allFakers.uk;
        case 'ur': return allFakers.ur;
        case 'vi': return allFakers.vi;
        case 'zh_CN': return allFakers.zh_CN;
        case 'zh_TW': return allFakers.zh_TW;
        case 'zu_ZA': return allFakers.zu_ZA;
        default:
            // Fallback to English if locale is not available
            console.warn(`Locale '${locale}' not available, falling back to English`);
            return faker;
    }
}

export class SimpleDataFaker implements DataFaker {
    generate(schema: InternalSchema, options: DataFakerOptions): any[] {
        const rand = seededRandom(options.seed);
        const count = Math.max(1, options.count);

        // Get the appropriate faker instance for the locale
        const fakerInstance = getFakerForLocale(options.locale);

        // Set faker seed for deterministic results
        if (options.seed) {
            fakerInstance.seed(this.hashString(options.seed));
        }

        // For large datasets (> 5000), generate in batches to avoid memory issues
        const result: any[] = [];
        const batchSize = count > 5000 ? Math.min(1000, Math.ceil(count / 10)) : count;

        for (let i = 0; i < count; i++) {
            result.push(this.fakeValue(schema, rand, fakerInstance));

            // Yield control every batchSize items for large datasets
            if (count > 5000 && i > 0 && i % batchSize === 0) {
                // Allow event loop to process other tasks
                if (typeof setImmediate !== 'undefined') {
                    setImmediate(() => { });
                }
            }
        }

        return result;
    }

    private hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    private fakeValue(schema: InternalSchema, rand: () => number, fakerInstance: Faker): any {
        switch (schema.type) {
            case 'object':
                return this.fakeObject(schema as InternalObjectSchema, rand, fakerInstance);
            case 'array':
                return this.fakeArray(schema as InternalArraySchema, rand, fakerInstance);
            case 'string':
                return this.fakeString(schema as InternalStringSchema, fakerInstance);
            case 'number':
                return this.fakeNumber(schema as InternalNumberSchema, rand);
            case 'boolean':
                return this.fakeBoolean(schema as InternalBooleanSchema, rand);
            case 'null':
                return this.fakeNull(schema as InternalNullSchema);
            case 'union':
                return this.fakeUnion(schema as InternalUnionSchema, rand, fakerInstance);
        }
    }

    private fakeObject(schema: InternalObjectSchema, rand: () => number, fakerInstance: Faker): Record<string, any> {
        const out: Record<string, any> = {};
        for (const [key, child] of Object.entries(schema.properties)) {
            // Use more realistic data for common field names
            if (child.type === 'string' && !child.format && !child.enum) {
                switch (key.toLowerCase()) {
                    case 'name':
                    case 'firstname':
                    case 'first_name':
                        out[key] = fakerInstance.person.firstName();
                        break;
                    case 'lastname':
                    case 'last_name':
                    case 'surname':
                        out[key] = fakerInstance.person.lastName();
                        break;
                    case 'fullname':
                    case 'full_name':
                        out[key] = fakerInstance.person.fullName();
                        break;
                    case 'email':
                        out[key] = fakerInstance.internet.email();
                        break;
                    case 'phone':
                    case 'phonenumber':
                    case 'phone_number':
                        out[key] = fakerInstance.phone.number();
                        break;
                    case 'address':
                        out[key] = fakerInstance.location.streetAddress();
                        break;
                    case 'city':
                        out[key] = fakerInstance.location.city();
                        break;
                    case 'country':
                        out[key] = fakerInstance.location.country();
                        break;
                    case 'company':
                    case 'companyname':
                    case 'company_name':
                        out[key] = fakerInstance.company.name();
                        break;
                    case 'description':
                        out[key] = fakerInstance.lorem.sentence();
                        break;
                    default:
                        out[key] = this.fakeValue(child, rand, fakerInstance);
                }
            } else {
                out[key] = this.fakeValue(child, rand, fakerInstance);
            }
        }
        return out;
    }

    private fakeArray(schema: InternalArraySchema, rand: () => number, fakerInstance: Faker): any[] {
        const min = schema.minItems ?? 1;
        const max = schema.maxItems ?? 3;
        const n = Math.max(min, Math.floor(rand() * (max - min + 1)) + min);
        const arr: any[] = [];
        for (let i = 0; i < n; i++) arr.push(this.fakeValue(schema.items, rand, fakerInstance));
        return arr;
    }

    private fakeString(schema: InternalStringSchema, fakerInstance: Faker): string {
        if (schema.enum && schema.enum.length) {
            return schema.enum[Math.floor(Math.random() * schema.enum.length)];
        }
        switch (schema.format) {
            case 'email':
                return fakerInstance.internet.email();
            case 'uri':
                return fakerInstance.internet.url();
            case 'uuid':
                return fakerInstance.string.uuid();
            case 'date':
                return fakerInstance.date.recent().toISOString().split('T')[0];
            case 'date-time':
                return fakerInstance.date.recent().toISOString();
            case 'phone':
                return fakerInstance.phone.number();
            case 'address':
                return fakerInstance.location.streetAddress();
            case 'company':
                return fakerInstance.company.name();
            case 'credit-card':
                return fakerInstance.finance.creditCardNumber();
            case 'first-name':
                return fakerInstance.person.firstName();
            case 'last-name':
                return fakerInstance.person.lastName();
            case 'full-name':
                return fakerInstance.person.fullName();
            case 'job-title':
                return fakerInstance.person.jobTitle();
            case 'country':
                return fakerInstance.location.country();
            case 'city':
                return fakerInstance.location.city();
            case 'zip-code':
                return fakerInstance.location.zipCode();
            default:
                return fakerInstance.lorem.words(3);
        }
    }

    private fakeNumber(_schema: InternalNumberSchema, rand: () => number): number {
        return Math.floor(rand() * 1000);
    }

    private fakeBoolean(_schema: InternalBooleanSchema, rand: () => number): boolean {
        return rand() > 0.5;
    }

    private fakeNull(_schema: InternalNullSchema): null {
        return null;
    }

    private fakeUnion(schema: InternalUnionSchema, rand: () => number, fakerInstance: Faker): any {
        if (schema.variants.length === 0) {
            return null; // fallback
        }

        // Randomly select one of the variants
        const index = Math.floor(rand() * schema.variants.length);
        const selectedVariant = schema.variants[index];
        return this.fakeValue(selectedVariant, rand, fakerInstance);
    }
}


