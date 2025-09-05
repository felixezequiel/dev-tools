import { FormDataEntrySource } from "./infrastructure/entry-sources/formdata-entry-source";
import { JsonDataEntrySource } from "./infrastructure/entry-sources/json-data-entry-source";
import { CsvDataEntrySource } from "./infrastructure/entry-sources/csv-data-entry-source";
import { DataReBuilder } from "./application/service";

const formData = new FormData();
const json = {
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
    address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345"
    }
}
const csv = `name,age,email,address.street,address.city,address.state,address.zip
John Doe,30,john.doe@example.com,123 Main St,Anytown,CA,12345`

const service = new DataReBuilder();
const formDataToJson = service.rebuildFrom(new FormDataEntrySource(formData)).toJSON();
const jsonToFormData = service.rebuildFrom(new JsonDataEntrySource(json)).toFormData();
const jsonToCsv = service.rebuildFrom(new JsonDataEntrySource(json)).toCsv();
const csvToFormData = service.rebuildFrom(new CsvDataEntrySource(csv)).toFormData();
const csvToJson = service.rebuildFrom(new CsvDataEntrySource(csv)).toJSON();


console.log({ formDataToJson, jsonToFormData, jsonToCsv, csvToFormData, csvToJson });