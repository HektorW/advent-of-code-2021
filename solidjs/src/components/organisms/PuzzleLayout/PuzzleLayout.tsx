import type { JSX } from 'solid-js'

import styles from './puzzle-layout.module.css'

export interface PuzzleLayoutProps {
  children: JSX.Element
}

export default function PuzzleLayout(props: PuzzleLayoutProps) {
  return <section className={styles.puzzleLayout}>{props.children}</section>
}
