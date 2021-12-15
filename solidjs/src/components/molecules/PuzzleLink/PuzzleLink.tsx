import { createMemo } from 'solid-js'
import ExternalLink from '../../atoms/ExternalLink'

export interface PuzzleLinkProps {
  day: number
}

export default function PuzzleLink(props: PuzzleLinkProps) {
  const href = createMemo(
    () => `https://adventofcode.com/2021/day/${props.day}`
  )

  return <ExternalLink href={href()} text="Go to Puzzle" />
}
