import { createMemo, Index } from 'solid-js'
import { splitInputIntoLines } from '../../../utils/inputUtils'

export interface PuzzleInputProps {
  input: string
}

export default function PuzzleInput(props: PuzzleInputProps) {
  const inputLines = createMemo(() => splitInputIntoLines(props.input))

  return (
    <details>
      <summary>Puzzle input</summary>

      <Index each={inputLines()}>{(line) => <div>{line}</div>}</Index>
    </details>
  )
}
