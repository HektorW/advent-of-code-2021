export function isValidNumber(input: unknown): input is number {
  return typeof input === 'number' && !Number.isNaN(input)
}
