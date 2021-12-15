import ManagedPuzzle from '../../components/templates/ManagedPuzzle'

import type { AppError, CalculationError } from '../../utils/errorUtils'
import { parseInputIntoNumbers } from '../../utils/inputUtils'
import { calculatePuzzlePartResult } from '../../utils/puzzleUtils'
import type { Result } from '../../utils/resultUtils'
import { day1Input } from './day-1.input'

export type Day1Result = Result<number, AppError>

export default function Day1() {
  return (
    <ManagedPuzzle
      day={1}
      information={{
        name: 'Sonar Sweep',
        introduction: `As the submarine drops below the surface of the ocean, it automatically performs a sonar sweep of the nearby sea floor. On a small screen, the sonar sweep report appears: each line is a measurement of the sea floor depth as the sweep looks further and further away from the submarine.`,
        explanation: `<p>For example, suppose you had the following report:
     
<code><pre>
199
200
208
210
200
207
240
269
260
263
</pre></code>

<p>This report indicates that, scanning outward from the submarine, the sonar sweep found depths of 199, 200, 208, 210, and so on.
<p>The first order of business is to figure out how quickly the depth increases, just so you know what you're dealing with - you never know if the keys will get carried into deeper water by an ocean current or a fish or something.
`,
      }}
      input={day1Input}
      inputParser={parseInputIntoNumbers}
      part1={{
        question: `How many measurements are larger than the previous measurement?`,
      }}
      part1Solver={calculateDay1Answer}
      part2={{
        question: `Consider sums of a three-measurement sliding window. How many sums are larger than the previous sum?`,
      }}
      part2Solver={calculateDay1AnswerPartTwo}
    />
  )
}

/**
 * Question:
 * How many measurements are larger than the previous measurement?
 */
function calculateDay1Answer(
  parsedInput: number[]
): Result<number, CalculationError> {
  return calculatePuzzlePartResult(() => {
    let largerMeasurementsCount = 0
    let previousMeasurement = Infinity

    parsedInput.forEach((measurement) => {
      if (measurement > previousMeasurement) {
        largerMeasurementsCount += 1
      }

      previousMeasurement = measurement
    })

    return largerMeasurementsCount
  })
}

/**
 * Question:
 * Consider sums of a three-measurement sliding window. How many sums are larger than the previous sum?
 */
function calculateDay1AnswerPartTwo(
  parsedInput: number[]
): Result<number, CalculationError> {
  return calculatePuzzlePartResult(() => {
    // Starting all windows at Infinity ensures all first comparisons are false
    const slidingWindows = [Infinity, Infinity, Infinity]

    const slidingWindowSize = slidingWindows.length

    let largerSumsCount = 0

    parsedInput.forEach((measurement, index) => {
      const slidingWindowIndex = index % slidingWindowSize

      // Add ourselves as last entry to sliding window at index
      slidingWindows[slidingWindowIndex] += measurement

      // Compare the newly closed window to previous window
      if (
        slidingWindows[slidingWindowIndex] >
        slidingWindows[getRelativeIndex(slidingWindowIndex - 1)]
      ) {
        largerSumsCount += 1
      }

      // Reset previous window because we have just compared against it
      slidingWindows[getRelativeIndex(slidingWindowIndex - 1)] = measurement

      // Add our measurement to next window
      slidingWindows[getRelativeIndex(slidingWindowIndex + 1)] += measurement
    })

    function getRelativeIndex(index: number): number {
      return (slidingWindowSize + index) % slidingWindowSize
    }

    return largerSumsCount
  })
}
