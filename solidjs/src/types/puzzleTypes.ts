import type { AppError } from '../utils/errorUtils'
import type { Err, Ok, Result } from '../utils/resultUtils'

export type PuzzleOk = Ok<unknown, AppError>
export type PuzzleErr = Err<unknown, AppError>
export type PuzzleResult = Result<unknown, AppError>

/** Used to indicate a string that will be add as `innerHTML` on an element. */
export type HtmlString = string

export interface PuzzlePart {
  /**
   * `null` indicates loading.
   */
  result: PuzzleResult | null

  /**
   * Question stated above the input where answer is given at https://adventofcode.com/.
   */
  question?: HtmlString

  /**
   * Longer description of the question from https://adventofcode.com/.
   */
  description?: HtmlString
}

export interface PuzzleInformation {
  name?: string
  /** Usuallly just the first paragraph of a puzzle. */
  introduction?: HtmlString
  explanation?: HtmlString
}
