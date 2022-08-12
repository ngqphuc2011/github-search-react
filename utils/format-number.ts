export function formatNumber(number: number) {
  if (!number) return `${0}`;
  return number > 1000 ? `${Number(number / 1000).toFixed(1)}K` : `${number}`;
}
