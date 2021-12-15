import { createEffect, onCleanup, onMount } from 'solid-js'
import SnowflakesManager from './Snow.classes'

import styles from './snow.module.css'

export interface SnowProps {
  maxSnowflakes?: number
}

export default function Snow(props: SnowProps) {
  const defaultMaxSnowflakes = 100

  let canvas: HTMLCanvasElement | undefined

  let snowflakesManager: SnowflakesManager | null = null

  onMount(() => {
    if (!canvas) {
      return
    }

    snowflakesManager = new SnowflakesManager(canvas)
    setCanvasSize()
    snowflakesManager.start()

    window.addEventListener('resize', onWindowResize)
    window.addEventListener('blur', onWindowBlur)
    window.addEventListener('focus', onWindowFocus)
  })

  onCleanup(() => {
    window.removeEventListener('resize', onWindowResize)
    window.removeEventListener('blur', onWindowBlur)
    window.removeEventListener('focus', onWindowFocus)
  })

  createEffect(() => {
    if (snowflakesManager) {
      snowflakesManager.maxSnowflakes =
        props.maxSnowflakes ?? defaultMaxSnowflakes
    }
  })

  function setCanvasSize() {
    if (canvas && snowflakesManager) {
      snowflakesManager.resize(canvas.clientWidth, canvas.clientHeight)
    }
  }

  function onWindowResize() {
    setCanvasSize()
  }

  function onWindowBlur() {
    if (snowflakesManager) {
      snowflakesManager.pause()
    }
  }

  function onWindowFocus() {
    if (snowflakesManager) {
      snowflakesManager.start()
    }
  }

  return <canvas className={styles.canvas} ref={canvas} />
}
