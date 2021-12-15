import { Match, Switch } from 'solid-js'
import {
  AppError,
  CalculationError,
  ParsingError,
} from '../../../utils/errorUtils'
import Heading from '../../atoms/Heading'

export interface PuzzleErrorProps {
  error: AppError
}

export default function PuzzleError(props: PuzzleErrorProps) {
  return (
    <div>
      <Switch>
        <Match when={props.error instanceof ParsingError}>
          <Heading tagName="h3" size="m" children="Failed to parse the input" />
          {props.error.message}
        </Match>

        <Match when={props.error instanceof CalculationError}>
          <Heading
            tagName="h3"
            size="m"
            children="Failed when calculating the answer"
          />
          {props.error.message}
        </Match>
      </Switch>
    </div>
  )
}
