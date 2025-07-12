export function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "..." : str;
}