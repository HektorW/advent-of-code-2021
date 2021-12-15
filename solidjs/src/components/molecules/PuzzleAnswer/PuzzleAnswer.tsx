import classNames from '../../../utils/classNames'
import styles from './puzzle-answer.module.css'

export interface PuzzleAnswerProps {
  answer: unknown

  className?: string
}

export default function PuzzleAnswer(props: PuzzleAnswerProps) {
  return (
    <output className={classNames(styles.output, props.className)}>
      <span className={styles.text}>Answer:</span>{' '}
      <span className={styles.value}>{String(props.answer)}</span>
    </output>
  )
}
