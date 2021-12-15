import { Index, Show } from 'solid-js'
import type {
  PuzzleErr,
  PuzzleInformation,
  PuzzlePart as PuzzlePartType,
} from '../../../types/puzzleTypes'
import { ParsingError } from '../../../utils/errorUtils'
import { Result } from '../../../utils/resultUtils'
import PuzzleError from '../../molecules/PuzzleError'

import PuzzleInput from '../../molecules/PuzzleInput'
import PuzzleIntroduction from '../../molecules/PuzzleIntroduction'
import PuzzleLink from '../../molecules/PuzzleLink'

import PuzzleTitle from '../../molecules/PuzzleTitle'
import PuzzleLayout from '../../organisms/PuzzleLayout'
import PuzzlePart from '../../organisms/PuzzlePart'

export interface PuzzleProps {
  day: number
  information: PuzzleInformation

  input: string

  parsingResult?: Result<unknown, ParsingError> | null

  parts: PuzzlePartType[]
}

/**
 * Renders a whole Puzzle.
 * Should be the rendered component for each day.
 */
export default function Puzzle(props: PuzzleProps) {
  return (
    <PuzzleLayout>
      <PuzzleTitle day={props.day} title={props.information.name} />

      <Show when={props.information.introduction}>
        {(introduction) => <PuzzleIntroduction text={introduction} />}
      </Show>

      <Show when={props.parsingResult?.isErr()}>
        <PuzzleError error={(props.parsingResult as PuzzleErr).error} />
      </Show>

      <Show when={props.parsingResult?.isOk()}>
        <Index each={props.parts}>
          {(puzzlePart, index) => (
            <PuzzlePart number={index + 1} part={puzzlePart()} />
          )}
        </Index>
      </Show>

      <PuzzleInput input={props.input} />

      <PuzzleLink day={props.day} />
    </PuzzleLayout>
  )
}
