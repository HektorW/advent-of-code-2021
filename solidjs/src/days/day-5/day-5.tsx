import ManagedPuzzle from '../../components/templates/ManagedPuzzle'
import { arrayOfLength } from '../../utils/arrayUtils'
import { parseInputLineByLine, parseNumber } from '../../utils/inputUtils'
import { calculatePuzzlePartResult } from '../../utils/puzzleUtils'
import { day5TestInput } from './day-5.input'

interface Point {
  x: number
  y: number
}

interface Day5InputLine {
  from: Point
  to: Point
}

type Day5Input = Day5InputLine[]

export default function Day5() {
  return (
    <ManagedPuzzle<Day5Input>
      day={5}
      information={{
        name: 'Hydrothermal Venture',
        introduction: `You come across a field of hydrothermal vents on the ocean floor! These vents constantly produce large, opaque clouds, so it would be best to avoid them if possible.`,
      }}
      input={day5TestInput}
      inputParser={parseDay5Input}
      part1={{
        question: `Consider only horizontal and vertical lines. At how many points do at least two lines overlap?`,
      }}
      part1Solver={solveDay5Part1Answer}
    />
  )
}

function parseDay5Input(rawInput: string) {
  return parseInputLineByLine(rawInput, (line): Day5InputLine => {
    const [fromStr, toStr] = line.split(' -> ')
    return { from: parsePoint(fromStr), to: parsePoint(toStr) }
  })

  function parsePoint(pointStr: string): Point {
    const [xStr, yStr] = pointStr.split(',')
    return { x: parseNumber(xStr), y: parseNumber(yStr) }
  }
}

/**
 * Question:
 * Consider only horizontal and vertical lines.
 * At how many points do at least two lines overlap?
 */
function solveDay5Part1Answer(input: Day5Input) {
  return calculatePuzzlePartResult(() => {
    const noneDiagonalLines = input.filter((line) => !isDiagonalLine(line))

    const board: number[][] = []

    noneDiagonalLines.forEach((line) => {})
    /*
0,9 -> 5,9
0,9 -> 2,9


9,4 -> 3,4
3,4 -> 1,4

2,2 -> 2,1
7,0 -> 7,4


7,0 -> 7,4
3,4 -> 9,4 -> 

    */
  })
}

function calculateOverlappingCount(
  lineA: Day5InputLine,
  lineB: Day5InputLine
): number {
  if (isSameRow(lineA, lineB)) {
    // 0,9 -> 5,9
    // 0,9 -> 2,9
    // = 3
    // 2,9 -> 5,9
    // 0,9 -> 2,9
    // = 1
    // 3,9 -> 5,9
    // 0,9 -> 2,9
    // = 0
  }
}

function getAllLinePoints(line: Day5InputLine): Point[] {
  if (isHorizontalLine(line)) {
    // `from.y` and `to.y` are equal so can be either one
    const y = line.from.y
    const length = Math.abs(line.from.x - line.to.x)
    return arrayOfLength(length).map((_, index) => ({
      y,
      x: NaN,
    }))
  }
}

function isDiagonalLine(line: Day5InputLine): boolean {
  return !isHorizontalLine(line) && !isVerticalLine(line)
}

function isHorizontalLine(line: Day5InputLine): boolean {
  return line.from.y === line.to.y
}

function isVerticalLine(line: Day5InputLine): boolean {
  return line.from.x === line.to.x
}

function isSameRow(lineA: Day5InputLine, lineB: Day5InputLine): boolean {
  return (
    lineA.from.y === lineA.to.y &&
    lineB.from.y === lineB.to.y &&
    lineA.from.y === lineB.from.y
  )
}

function isSameColumn(lineA: Day5InputLine, lineB: Day5InputLine): boolean {
  return (
    lineA.from.x === lineA.to.x &&
    lineB.from.x === lineB.to.x &&
    lineA.from.x === lineB.from.x
  )
}
