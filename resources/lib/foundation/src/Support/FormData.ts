import { toRaw } from 'vue';

export function buildFormData(data: Record<string, any> | null | undefined) {
  let result = new FormData();

  if (data) {
    attachFields(result, data);
  }

  return result;
}

function attachFields(data: FormData, fields: Record<string, any>) {
  Object.keys(fields).forEach((key) => appendField(data, key, toRaw(fields[key])));
}


function appendField(data: FormData, name: string, value: any, prev?: string) {
  if (prev) {
    name = prev + '[' + name + ']';
  }

  if (value == null) {
    data.set(name, '');
    return data;
  }

  if (value instanceof File) {
    data.set(name, value);
    return data;
  }

  if (Array.isArray(value)) {
    value.forEach((arrValue, arrIndex) => appendField(data, arrIndex.toString(), arrValue, name));
    return data;
  }

  if (typeof value === 'object') {
    Object.keys(value).forEach((key) => appendField(data, key, value[key], name));
    return data;
  }

  if (typeof value === 'boolean') {
    value = Number(value);
  }

  if (value == null) {
    value = '';
  }

  data.set(name, value);

  return data;
}
