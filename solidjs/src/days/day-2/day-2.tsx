import ManagedPuzzle from '../../components/templates/ManagedPuzzle'
import type { CalculationError, ParsingError } from '../../utils/errorUtils'
import { parseInputLineByLine } from '../../utils/inputUtils'
import { isValidNumber } from '../../utils/numberUtils'
import { calculatePuzzlePartResult } from '../../utils/puzzleUtils'
import type { Result } from '../../utils/resultUtils'
import { day2Input } from './day-2.input'

enum Command {
  Forward = 'forward',
  Down = 'down',
  Up = 'up',
}

interface Day2InputLine {
  command: Command
  amount: number
}

type Day2Input = Day2InputLine[]

export default function Day2() {
  return (
    <ManagedPuzzle
      day={2}
      information={{
        name: 'Dive!',
        introduction: `Now, you need to figure out how to pilot this thing.`,
      }}
      input={day2Input}
      inputParser={parseDay2Input}
      part1={{
        question: `Calculate the horizontal position and depth you would have after following the planned course. What do you get if you multiply your final horizontal position by your final depth?`,
      }}
      part1Solver={calculateDay2Part1Answer}
      part2={{
        question: `Using this new interpretation of the commands, calculate the horizontal position and depth you would have after following the planned course. What do you get if you multiply your final horizontal position by your final depth?`,
      }}
      part2Solver={calculateDay2Part2Answer}
    />
  )
}

/**
 * Parses the raw string input into commands.
 */
function parseDay2Input(rawInput: string): Result<Day2Input, ParsingError> {
  const validCommands = Object.values(Command)

  return parseInputLineByLine(rawInput, (line, lineIndex): Day2InputLine => {
    const [rawCommand, rawAmount] = line.split(' ')

    const command = rawCommand as Command
    if (!validCommands.includes(command)) {
      throw `invalid command on line ${lineIndex + 1}: ${line}`
    }

    const amount = Number(rawAmount)
    if (!isValidNumber(amount)) {
      throw `invalid amount on line ${lineIndex + 1}: ${line}`
    }

    return { command, amount }
  })
}

/**
 * Question:
 * Calculate the horizontal position and depth you would have after following the planned course.
 * What do you get if you multiply your final horizontal position by your final depth?
 */
function calculateDay2Part1Answer(
  parsedInput: Day2Input
): Result<number, CalculationError> {
  return calculatePuzzlePartResult(() => {
    let horizontalPosition = 0
    let depth = 0

    parsedInput.forEach((inputLine) => {
      switch (inputLine.command) {
        case Command.Forward:
          horizontalPosition += inputLine.amount
          break

        case Command.Down:
          depth += inputLine.amount
          break

        case Command.Up:
          depth -= inputLine.amount
          break
      }
    })

    return horizontalPosition * depth
  })
}

/**
 * Question:
 * Using this new interpretation of the commands, calculate the horizontal position and depth you would have after following the planned course.
 * What do you get if you multiply your final horizontal position by your final depth?
 */
function calculateDay2Part2Answer(
  parsedInput: Day2Input
): Result<number, CalculationError> {
  return calculatePuzzlePartResult(() => {
    let horizontalPosition = 0
    let depth = 0
    let aim = 0

    parsedInput.forEach((inputLine) => {
      switch (inputLine.command) {
        case Command.Forward:
          horizontalPosition += inputLine.amount
          depth += aim * inputLine.amount
          break

        case Command.Down:
          aim += inputLine.amount
          break

        case Command.Up:
          aim -= inputLine.amount
          break
      }
    })

    return horizontalPosition * depth
  })
}
