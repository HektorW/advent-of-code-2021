import { Match, Show, Switch } from 'solid-js'
import type {
  PuzzleErr,
  PuzzleOk,
  PuzzlePart as PuzzlePartType,
} from '../../../types/puzzleTypes'
import Heading from '../../atoms/Heading'
import Text from '../../atoms/Text'
import PuzzleAnswer from '../../molecules/PuzzleAnswer'
import PuzzleError from '../../molecules/PuzzleError'
import PuzzleLoading from '../../molecules/PuzzleLoading'

export interface PuzzlePartProps {
  number: number
  part: PuzzlePartType
}

export default function PuzzlePart(props: PuzzlePartProps) {
  return (
    <section>
      <Heading tagName="h2" size="s">
        Part {props.number}
      </Heading>

      <Show when={props.part.question}>
        {(question) => <Text tagName="div" size="m" innerHTML={question} />}
      </Show>

      <Switch fallback={<PuzzleLoading partNumber={props.number} />}>
        <Match when={props.part.result?.isOk()}>
          <PuzzleAnswer answer={(props.part.result as PuzzleOk).value} />
        </Match>

        <Match when={props.part.result?.isErr()}>
          <PuzzleError error={(props.part.result as PuzzleErr).error} />
        </Match>
      </Switch>
    </section>
  )
}
