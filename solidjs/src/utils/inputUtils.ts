import { ParsingError } from './errorUtils'
import { isValidNumber } from './numberUtils'
import { err, ok, Result } from './resultUtils'

/**
 * Removes empty lines if they appear **first** or **last**.
 */
export function splitInputIntoLines(input: string): string[] {
  const lines = input.split('\n')

  if (lines[0] === '') {
    lines.splice(0, 1)
  }

  if (lines[lines.length - 1] === '') {
    lines.splice(lines.length - 1, 1)
  }

  return lines
}

/**
 * Will fail if any line is invalid.
 */
export function parseInputIntoNumbers(
  rawInput: string
): Result<number[], ParsingError> {
  return parseInputLineByLine(rawInput, (line) => parseNumber(line))
}

/**
 * Will split `rawInput` into lines and call `parseLine` for each line.
 */
export function parseInputLineByLine<TParsed>(
  rawInput: string,
  parseLine: (line: string, index: number) => TParsed
): Result<TParsed[], ParsingError> {
  return tryParseInput(() => {
    const lines = splitInputIntoLines(rawInput)
    return lines.map((line, index) => parseLine(line, index))
  })
}

/**
 * `parser` can safely throw an error message if it encounters any error.
 * It will be convert into a Result<TParsed, ParsingError>.
 */
export function tryParseInput<TParsed>(
  parser: () => TParsed
): Result<TParsed, ParsingError> {
  try {
    return ok(parser())
  } catch (errorMessage) {
    return err(new ParsingError(errorMessage))
  }
}

/**
 * @throws {string} if not able to parse into a valid number
 */
export function parseNumber(numberStr: string): number {
  if (numberStr === '') {
    throw 'invalid input: empty input'
  }

  const number = Number(numberStr)
  if (!isValidNumber(number)) {
    throw `invalid input: could not parse "${numberStr}" as a number`
  }

  return number
}
