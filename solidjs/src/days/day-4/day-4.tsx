import ManagedPuzzle from '../../components/templates/ManagedPuzzle'
import { CalculationError, ParsingError } from '../../utils/errorUtils'
import {
  parseNumber,
  splitInputIntoLines,
  tryParseInput,
} from '../../utils/inputUtils'
import { calculatePuzzlePartResult } from '../../utils/puzzleUtils'
import { Result } from '../../utils/resultUtils'
import { day4Input, day4TestInput } from './day-4.input'

interface BingoBoard {
  rows: BoardRow[]
}

/** Each item represent a column. */
type BoardRow = number[]

interface Day4Input {
  drawOrder: number[]
  boards: BingoBoard[]
}

export default function Day4() {
  return (
    <ManagedPuzzle
      day={4}
      information={{
        name: 'Gian Squid',
        introduction: `<p>You're already almost 1.5km (almost a mile) below the surface of the ocean, already so deep that you can't see any sunlight. What you can see, however, is a giant squid that has attached itself to the outside of your submarine.
        <p>Maybe it wants to play bingo?`,
      }}
      input={day4Input}
      inputParser={parseDay4Input}
      part1={{}}
      part1Solver={calculateDay4Part1Answer}
      part2={{}}
      part2Solver={calculateDay4Part2Answer}
    />
  )
}

function parseDay4Input(rawInput: string): Result<Day4Input, ParsingError> {
  return tryParseInput<Day4Input>(() => {
    const lines = splitInputIntoLines(rawInput)

    const drawOrderLine = lines[0]
    const drawOrder = drawOrderLine
      .split(',')
      .map((number) => parseNumber(number))

    const boards: BingoBoard[] = []

    // Start at `2` because first row is draw order and second row is empty.
    for (let lineIndex = 2; lineIndex < lines.length; ) {
      const boardLines: string[] = []

      let boardLinesIndex = lineIndex
      boardLoop: for (; boardLinesIndex < lines.length; boardLinesIndex += 1) {
        const line = lines[boardLinesIndex]
        if (line.trim() === '') {
          break boardLoop
        }

        boardLines.push(line)
      }

      lineIndex = boardLinesIndex + 1

      const boardRows = boardLines.map((boardLine) => {
        const columnNumbers = boardLine
          .split(' ')
          // Single digit numbers will have a leading whitespace.
          // So we filter them out.
          .filter((splitItem) => splitItem.trim() !== '')
          .map((numberStr) => parseNumber(numberStr))

        return columnNumbers
      })

      boards.push({ rows: boardRows })
    }

    return {
      drawOrder,
      boards,
    }
  })
}

/**
 * Question:
 * To guarantee victory against the giant squid,
 * figure out which board will win first.
 * What will your final score be if you choose that board?
 */
function calculateDay4Part1Answer(
  input: Day4Input
): Result<number, CalculationError> {
  return calculatePuzzlePartResult(() => {
    const { drawOrder, boards } = input

    let winningBoard: BingoBoard | null = null

    // Start with `5` because that's the smallest amount to get a winning board.
    let pickedNumbers = drawOrder.slice(0, 5)

    pickLoop: while (pickedNumbers.length < drawOrder.length) {
      for (let boardIndex = 0; boardIndex < boards.length; boardIndex += 1) {
        const board = boards[boardIndex]
        if (hasBoardWon(board, pickedNumbers)) {
          winningBoard = board
          break pickLoop
        }
      }

      pickedNumbers.push(drawOrder[pickedNumbers.length])
    }

    if (winningBoard === null) {
      throw 'could not pick a winning board'
    }

    return calculateBoardScore(winningBoard, pickedNumbers)
  })
}

/**
 * Question:
 * Figure out which board will win last.
 * Once it wins, what would its final score be?
 */
function calculateDay4Part2Answer(
  input: Day4Input
): Result<number, CalculationError> {
  return calculatePuzzlePartResult(() => {
    const { drawOrder, boards } = input

    // Copy the board because we will mutate it
    const remainingBoards = boards.slice()

    let pickedNumbers = drawOrder.slice(0, 5)
    let lastBoard: BingoBoard | null = null

    pickLoop: while (pickedNumbers.length < drawOrder.length) {
      for (
        let boardIndex = 0;
        boardIndex < remainingBoards.length;
        boardIndex += 1
      ) {
        const board = remainingBoards[boardIndex]
        if (hasBoardWon(board, pickedNumbers)) {
          lastBoard = board

          // Remove each board until only one remains
          remainingBoards.splice(boardIndex, 1)
          boardIndex -= 1
        }

        if (remainingBoards.length === 0) {
          break pickLoop
        }
      }

      pickedNumbers.push(drawOrder[pickedNumbers.length])
    }

    if (lastBoard === null) {
      throw `failed to find the last winning board`
    }

    return calculateBoardScore(lastBoard, pickedNumbers)
  })
}

function hasBoardWon(board: BingoBoard, pickedNumbers: number[]): boolean {
  return (
    getWinningRowIndexOrNull(board, pickedNumbers) !== null ||
    getWinningColumnIndexOrNull(board, pickedNumbers) !== null
  )
}

/**
 * Will return `null` if no row is filled from the `pickedNumbers`.
 */
function getWinningRowIndexOrNull(
  board: BingoBoard,
  pickedNumbers: number[]
): number | null {
  const boardIndex = board.rows.findIndex((row) =>
    row.every((value) => pickedNumbers.includes(value))
  )

  return boardIndex === -1 ? null : boardIndex
}

/**
 * Will return `null` if no column is filled from the `pickedNumbers`.
 */
function getWinningColumnIndexOrNull(
  board: BingoBoard,
  pickedNumbers: number[]
) {
  const { rows } = board
  const firstRow = rows[0]
  if (!firstRow) {
    return null
  }

  const columnIndex = firstRow.findIndex((_, columnIndex) => {
    return rows.every((_, rowIndex) => {
      const value = rows[rowIndex][columnIndex]
      return pickedNumbers.includes(value)
    })
  })

  return columnIndex === -1 ? null : columnIndex
}

/**
 * Will calculate the sum of all numbers on the board,
 * except for numbers that appear in `pickedNumbers`.
 */
function getSumOfUnmarkedNumbers(
  board: BingoBoard,
  pickedNumbers: number[]
): number {
  return board.rows.reduce(
    (sum, row) =>
      sum +
      row
        .filter((number) => !pickedNumbers.includes(number))
        .reduce((rowSum, number) => rowSum + number, 0),
    0
  )
}

/**
 * Get the score by multiplying:
 *  The final drawn number
 * with
 *  The sum of all unmarked numbers on the winning board.
 */
function calculateBoardScore(
  board: BingoBoard,
  pickedNumbers: number[]
): number {
  const finalNumber = pickedNumbers[pickedNumbers.length - 1]
  return getSumOfUnmarkedNumbers(board, pickedNumbers) * finalNumber
}
