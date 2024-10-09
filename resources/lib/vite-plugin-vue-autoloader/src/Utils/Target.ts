type Local = string;
type Vendor = string | null | undefined;
type Config = Record<Local, Vendor> | Local[] | Local;

export function resolveTargetDirectory(target: Config): [Local, Vendor] {
  if (Array.isArray(target)) {
    return [target.at(0), undefined];
  }

  if (typeof target === 'string') {
    return [target, undefined];
  }

  return Object.entries(target).at(0);
}
