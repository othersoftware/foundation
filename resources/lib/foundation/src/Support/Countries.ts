export function isCountryImplicit(country: string | null | undefined) {
  if (country) {
    return APP_COUNTRIES_IMPLICITLY_ADDRESSES.includes(country);
  }

  return false;
}

export function isCountryExplicit(country: string | null | undefined) {
  return !isCountryImplicit(country);
}
