import { DefaultTypeModelBuilder } from '../domain/builders/default-type-model-builder';
import { DefaultTypeScriptEmitter } from '../domain/emitters/typescript-emitter';
import { DefaultZodEmitter } from '../domain/emitters/zod-emitter';
import type { TypeModelBuilderOptions } from '../domain/ports/types-model';

export class TypesGeneratorService {
    private readonly builder = new DefaultTypeModelBuilder();
    private readonly ts = new DefaultTypeScriptEmitter();
    private readonly zod = new DefaultZodEmitter();

    generateAll(sample: unknown, options?: TypeModelBuilderOptions): { ts: string; zod: string } {
        const model = this.builder.buildFromSample(sample, options);
        const ts = this.ts.emit(model, { export: true });
        const zod = this.zod.emit(model, { constName: `${model.rootName}Schema` });
        return { ts, zod };
    }
}


