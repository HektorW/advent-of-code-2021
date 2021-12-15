import { JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import classNames from '../../../utils/classNames'

import styles from './heading.module.css'

export interface HeadingProps {
  tagName: HeadingTagName
  size: HeadingSize

  className?: string
  children: JSX.Element
}

export type HeadingSize = 'huge' | 'xl' | 'l' | 'm' | 's'

export type HeadingTagName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

export default function Heading(props: HeadingProps) {
  return (
    <Dynamic
      component={props.tagName}
      className={classNames(
        styles.heading,
        styles[`heading_${props.size}`],
        props.className
      )}
    >
      {props.children}
    </Dynamic>
  )
}
