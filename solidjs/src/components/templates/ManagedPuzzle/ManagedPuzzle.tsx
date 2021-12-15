import { createMemo, createSignal, onMount } from 'solid-js'
import { PuzzleInformation, PuzzlePart } from '../../../types/puzzleTypes'
import { CalculationError, ParsingError } from '../../../utils/errorUtils'
import { err, Result } from '../../../utils/resultUtils'
import Puzzle from '../Puzzle'

export interface ManagedPuzzleProps<TParsedInput> {
  day: number
  information: PuzzleInformation

  input: string

  part1: Omit<PuzzlePart, 'result'>
  part2?: Omit<PuzzlePart, 'result'>

  inputParser: (rawInput: string) => Result<TParsedInput, ParsingError>
  part1Solver: (input: TParsedInput) => Result<number, CalculationError>
  part2Solver?: (input: TParsedInput) => Result<number, CalculationError>
}

export default function ManagedPuzzle<TParsedInput>(
  props: ManagedPuzzleProps<TParsedInput>
) {
  const [parsingResult, setParsingResult] = createSignal<Result<
    TParsedInput,
    ParsingError
  > | null>(null)

  const [part1Result, setPart1Result] = createSignal<Result<
    number,
    CalculationError
  > | null>(null)
  const [part2Result, setPart2Result] = createSignal<Result<
    number,
    CalculationError
  > | null>(null)

  const parts = createMemo<PuzzlePart[]>(() => {
    const parts: PuzzlePart[] = [{ result: part1Result(), ...props.part1 }]

    if (props.part2) {
      parts.push({ result: part2Result(), ...props.part2 })
    }

    return parts
  })

  onMount(() => {
    const _parsingResult = props.inputParser(props.input)
    setParsingResult(() => _parsingResult)

    if (_parsingResult.isErr()) {
      return
    }

    setPart1Result(() => props.part1Solver(_parsingResult.value))

    if (props.part2Solver) {
      setPart2Result(() => props.part2Solver!(_parsingResult.value))
    }
  })

  return (
    <Puzzle
      day={props.day}
      information={props.information}
      input={props.input}
      parsingResult={parsingResult()}
      parts={parts()}
    />
  )
}
