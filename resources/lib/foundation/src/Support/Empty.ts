export function blank(value: any) {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (value instanceof Array) {
    return value.length > 0;
  }

  if (value instanceof Set || value instanceof Map) {
    return value.size > 0;
  }

  return !value;
}

export function filled(value: any) {
  return !blank(value);
}
