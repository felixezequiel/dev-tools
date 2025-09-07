import { EntrySource } from '../../interfaces/entry-source';

export class FormDataEntrySource implements EntrySource<string, FormDataEntryValue> {
    private readonly formData: FormData;

    constructor(formData: FormData) {
        this.formData = formData;
    }

    entries(): Iterable<[string, FormDataEntryValue]> {
        return this.formData.entries();
    }
}


