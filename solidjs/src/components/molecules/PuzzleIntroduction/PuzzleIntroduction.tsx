import Text from '../../atoms/Text'

export interface PuzzleIntroductionProps {
  text: string

  className?: string
}

export default function PuzzleIntroduction(props: PuzzleIntroductionProps) {
  return (
    <Text
      className={props.className}
      tagName="div"
      size="m"
      innerHTML={props.text}
    />
  )
}
