import type { JSX } from 'solid-js'

export interface ExternalLinkProps {
  href: string
  target?: string
  text: JSX.Element
}

export default function ExternalLink(props: ExternalLinkProps) {
  const defaultTarget = '_blank'

  return (
    <a href={props.href} target={props.target ?? defaultTarget}>
      {props.text}
    </a>
  )
}
