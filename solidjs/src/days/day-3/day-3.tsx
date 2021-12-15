import ManagedPuzzle from '../../components/templates/ManagedPuzzle'
import type { ParsingError } from '../../utils/errorUtils'
import { parseInputLineByLine } from '../../utils/inputUtils'
import { isValidNumber } from '../../utils/numberUtils'
import { calculatePuzzlePartResult } from '../../utils/puzzleUtils'
import type { Result } from '../../utils/resultUtils'
import { day3Input, day3Part1Question } from './day-3.input'

type Bit = '1' | '0'
type EquallyCommon = 'equal'
type MostCommonBit = Bit | EquallyCommon

interface Day3InputLine {
  bits: Bit[]
  number: number
}

type Day3Input = Day3InputLine[]

export default function Day3() {
  return (
    <ManagedPuzzle
      day={3}
      information={{
        name: 'Binary Diagnostic',
        introduction: `<p>The submarine has been making some odd creaking noises, so you ask it to produce a diagnostic report just in case.
        <p>The diagnostic report (your puzzle input) consists of a list of binary numbers which, when decoded properly, can tell you many useful things about the conditions of the submarine.`,
      }}
      input={day3Input}
      inputParser={parseDay3Input}
      part1={{ question: day3Part1Question }}
      part1Solver={calculateDay3Part1Answer}
      part2={{
        question: `Use the binary numbers in your diagnostic report to calculate the oxygen generator rating and CO2 scrubber rating, then multiply them together. What is the life support rating of the submarine?`,
      }}
      part2Solver={calculateDay3Part2Answer}
    />
  )
}

function parseDay3Input(rawInput: string): Result<Day3Input, ParsingError> {
  return parseInputLineByLine(rawInput, (line, index): Day3InputLine => {
    const bits = line.split('') as Bit[]
    const number = bitsToNumber(bits)
    if (!isValidNumber(number)) {
      throw `invalid input: could not parse row ${index + 1} "${line}"`
    }

    return { bits, number }
  })
}

/**
 * Question:
 * Use the binary numbers in your diagnostic report to calculate the gamma rate and epsilon rate,
 * then multiply them together.
 * What is the power consumption of the submarine?
 */
function calculateDay3Part1Answer(input: Day3Input) {
  return calculatePuzzlePartResult(() => {
    const bitCount = getBitCount(input)
    const allMostCommonBits = calculateAllMostCommonBits(input)

    const gamma = bitsToNumber(allMostCommonBits)

    const epsilon = gamma ^ bitsToNumber(getStringBitsOfLength(bitCount))

    return gamma * epsilon
  })
}

/**
 * Question:
 * Use the binary numbers in your diagnostic report to calculate the oxygen generator rating and CO2 scrubber rating,
 * then multiply them together.
 * What is the life support rating of the submarine?
 */
function calculateDay3Part2Answer(input: Day3Input) {
  return calculatePuzzlePartResult(() => {
    const oxygenGeneratorRatingLine = findRatingFromBitCriteria(
      input,
      /**
       * To find oxygen generator rating,
       * determine the most common value (0 or 1) in the current bit position,
       * and keep only numbers with that bit in that position.
       * If 0 and 1 are equally common,
       * keep values with a 1 in the position being considered.
       */
      (mostCommonBit, comparisonBit) => {
        if (mostCommonBit === 'equal') {
          return comparisonBit === '1'
        }

        return mostCommonBit === comparisonBit
      }
    )

    const co2ScrubberRatingLine = findRatingFromBitCriteria(
      input,
      /**
       * To find CO2 scrubber rating,
       * determine the least common value (0 or 1) in the current bit position,
       * and keep only numbers with that bit in that position.
       * If 0 and 1 are equally common,
       * keep values with a 0 in the position being considered.
       */
      (mostCommonBit, comparisonBit) => {
        if (mostCommonBit === 'equal') {
          return comparisonBit === '0'
        }

        return mostCommonBit !== comparisonBit
      }
    )

    return oxygenGeneratorRatingLine.number * co2ScrubberRatingLine.number
  })
}

/**
 * - Before searching for either rating value,
 *   start with the full list of binary numbers from your diagnostic report and
 *   consider just the first bit of those numbers. Then:
 * - Keep only numbers selected by the bit criteria for the type of rating value for which you are searching.
 *   Discard numbers which do not match the bit criteria.
 * - If you only have one number left, stop;
 *   this is the rating value for which you are searching.
 * - Otherwise, repeat the process, considering the next bit to the right.
 *
 * @throws {string} if calculations don't even out to a single line.
 */
function findRatingFromBitCriteria(
  input: Day3Input,
  bitCriteriaSolver: (bitWeight: MostCommonBit, comparisonBit: Bit) => boolean
): Day3InputLine {
  const bitCount = getBitCount(input)
  let remainingLines = input

  for (let bitIndex = 0; bitIndex < bitCount; bitIndex += 1) {
    if (remainingLines.length <= 1) {
      break
    }

    const mostCommonBit = calculateMostCommonBitAtBitIndex(
      remainingLines,
      bitIndex
    )

    remainingLines = remainingLines.filter((line) => {
      const lineBitAtIndex = line.bits[bitIndex]
      return bitCriteriaSolver(mostCommonBit, lineBitAtIndex)
    })
  }

  if (remainingLines.length === 0) {
    throw 'got no lines left'
  }

  if (remainingLines.length > 1) {
    throw 'got too many lines left'
  }

  return remainingLines[0]
}

/**
 * Calculates the most common bit for all input lines for each bit positions.
 */
function calculateAllMostCommonBits(input: Day3Input): MostCommonBit[] {
  const bitCount = getBitCount(input)
  const allMostCommonBits = [...new Array(bitCount)].map((_, index) =>
    calculateMostCommonBitAtBitIndex(input, index)
  )

  return allMostCommonBits
}

/**
 * Goes through all lines and calculates which bit ('0' or '1')
 * appears most time at the `bitIndex`.
 */
function calculateMostCommonBitAtBitIndex(
  inputLines: Day3InputLine[],
  bitIndex: number
): MostCommonBit {
  const bitWeight = inputLines.reduce((weight, inputLine) => {
    const lineBitAtIndex = inputLine.bits[bitIndex]
    return weight + (lineBitAtIndex === '1' ? 1 : -1)
  }, 0)

  if (bitWeight > 0) {
    return '1'
  }

  if (bitWeight < 0) {
    return '0'
  }

  return 'equal'
}

/** Assumes all lines have the same amount of bits. */
function getBitCount(input: Day3Input): number {
  return input[0]?.bits.length ?? 0
}

/**
 * Generates a string with `length` number of bits.
 * Each bit will have the value of `bitToFill`.
 */
function getStringBitsOfLength(length: number, bitToFill: Bit = '1') {
  return new Array(length).fill(bitToFill)
}

/**
 * Converts a series of binary values (each character is '0' or '1') into a number.
 * The string should **only** contain '0' or '1'.
 */
function binaryStringToNumber(binaryString: string): number {
  return Number(`0b${binaryString}`)
}

/**
 * Converts an array of bits (each character is '0' or '1') into a number.
 * Each entry in the array should **only** be either '0' or '1'.
 */
function bitsToNumber(bits: (string | number)[]): number {
  return binaryStringToNumber(bits.join(''))
}
