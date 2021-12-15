import { Accessor, createSignal } from 'solid-js'
import { CalculationError, ParsingError } from './errorUtils'
import { err, ok, Result } from './resultUtils'

/**
 * Wraps the answer in a Result.
 * The solver function can safely throw if it encounters an error.
 */
export function calculatePuzzlePartResult(
  solver: () => number
): Result<number, CalculationError> {
  try {
    return ok(solver())
  } catch (errorMessage) {
    return err(new CalculationError(errorMessage))
  }
}

export function createPuzzlePartsSignals<TParsedInput, TResult>(
  rawInput: string,
  inputParser: (rawInput: string) => Result<TParsedInput, ParsingError>,
  part1Solver: (input: TParsedInput) => Result<TResult, CalculationError>,
  part2Solver?: (input: TParsedInput) => Result<TResult, CalculationError>
): {
  parseInput: () => void
  solvePart1: () => void
  solvePart2: () => void

  parsingResultSignal: Accessor<Result<TParsedInput, ParsingError> | null>
  part1ResultSignal: Accessor<Result<TResult, CalculationError> | null>
  part2ResultSignal: Accessor<Result<TResult, CalculationError> | null>
} {
  const [parsingResult, setParsingResult] = createSignal<Result<
    TParsedInput,
    ParsingError
  > | null>(null)

  const [part1Result, setPart1Result] = createSignal<Result<
    TResult,
    CalculationError
  > | null>(null)
  const [part2Result, setPart2Result] = createSignal<Result<
    TResult,
    CalculationError
  > | null>(null)

  function parseInput() {
    const parsed = inputParser(rawInput)
    setParsingResult(() => parsed)
  }

  function solvePart1() {
    const _parsingResult = parsingResult()
    if (_parsingResult?.isOk()) {
      setPart1Result(() => part1Solver(_parsingResult.value))
    }
  }

  function solvePart2() {
    if (!part2Solver) {
      return
    }

    const _parsingResult = parsingResult()
    if (_parsingResult?.isOk()) {
      setPart2Result(() => part2Solver(_parsingResult.value))
    }
  }

  return {
    parseInput,
    solvePart1,
    solvePart2,

    parsingResultSignal: parsingResult,
    part1ResultSignal: part1Result,
    part2ResultSignal: part2Result,
  }
}
