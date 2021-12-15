import { Show } from 'solid-js'
import Heading from '../../atoms/Heading'
import Text from '../../atoms/Text'

import styles from './puzzle-title.module.css'

export interface PuzzleTitleProps {
  day: number
  title?: string
}

export default function PuzzleTitle(props: PuzzleTitleProps) {
  return (
    <div>
      <Heading className={styles.day} tagName="h1" size="huge">
        <span className={styles.dayText}>day</span>
        <span className={styles.dayNumber}>{props.day}</span>
      </Heading>

      <Show when={props.title}>
        <Text className={styles.title} tagName="div" size="l">
          {props.title}
        </Text>
      </Show>
    </div>
  )
}
