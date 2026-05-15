export function generateSmsCode(seed: number): string {
  let value = Math.abs(Math.floor(seed)) || 1;
  value = (value * 9301 + 49297) % 233280;
  const code = String(value % 1_000_000).padStart(6, "0");
  return code;
}

export function digitSum(code: string): number {
  return code.split("").reduce((total, char) => total + Number(char), 0);
}

export function hasConsecutivePairFromCode(value: string, code: string): boolean {
  const pairs = Array.from({ length: Math.max(code.length - 1, 0) }, (_, index) =>
    code.slice(index, index + 2),
  );
  return pairs.some((pair) => value.includes(pair));
}
