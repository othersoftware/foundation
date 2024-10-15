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

  if (item instanceof Array) {
    return item.length > 0;
  }

  if (item instanceof Set || item instanceof Map) {
    return item.size > 0;
  }

  return !value;
}

export function filled(value: any) {
  return !blank(value);
}
