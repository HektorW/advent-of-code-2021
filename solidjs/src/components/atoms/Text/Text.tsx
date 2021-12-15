import { JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import classNames from '../../../utils/classNames'

import styles from './text.module.css'

export type TextProps<TTag extends TextTagName> = BaseTextProps<TTag> &
  NativeElementProps<TTag>

type NativeElementProps<TTag extends TextTagName> = Omit<
  JSX.IntrinsicElements[TTag],
  'size'
>

export interface BaseTextProps<TTag extends TextTagName> {
  tagName: TTag
  size: TextSize
}

export type TextSize = 'xl' | 'l' | 'm' | 's'

export type TextTagName = keyof Pick<
  JSX.IntrinsicElements,
  'p' | 'span' | 'div'
>

export default function Text<TTag extends TextTagName>(props: TextProps<TTag>) {
  return (
    <Dynamic
      component={props.tagName}
      {...props}
      className={classNames(
        styles.text,
        styles[`text_${props.size}`],
        props.className
      )}
    />
  )
}
