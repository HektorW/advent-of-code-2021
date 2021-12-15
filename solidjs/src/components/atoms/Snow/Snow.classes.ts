export default class SnowflakesManager {
  maxSnowflakes: number = 0
  snowflakes: Snowflake[] = []

  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  width: number = 0
  height: number = 0

  lastNow: number = 0
  rafId: number = -1

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    /** Note the **`!`**. We assume it is supported and works. */
    this.ctx = canvas.getContext('2d')!
  }

  start() {
    cancelAnimationFrame(this.rafId)
    this.lastNow = performance.now()
    this.rafId = requestAnimationFrame(this.#render)
  }

  pause() {
    cancelAnimationFrame(this.rafId)
  }

  resize(width: number, height: number) {
    this.width = this.canvas.width = width
    this.height = this.canvas.height = height
  }

  #render = () => {
    this.rafId = requestAnimationFrame(this.#render)

    const now = performance.now()
    const elapsed = now - this.lastNow
    this.lastNow = now

    this.ctx.clearRect(0, 0, this.width, this.height)

    if (this.snowflakes.length < this.maxSnowflakes) {
      this.snowflakes.push(new Snowflake(this))
    }

    this.ctx.fillStyle = this.ctx.strokeStyle = '#fff'

    this.snowflakes.forEach((snowflake) => {
      snowflake.update(elapsed, now)
    })
  }
}

class Snowflake {
  manager: SnowflakesManager

  x: number = 0
  y: number = 0
  xVel: number = 0
  yVel: number = 0
  angle: number = 0
  angleVel: number = 0
  size: number = 0
  sizeOsc: number = 0

  constructor(manager: SnowflakesManager) {
    this.manager = manager

    this.spawn()
  }

  spawn(anyY = false) {
    this.x = rand(0, this.manager.width)
    this.y =
      anyY === true ? rand(-50, this.manager.height + 50) : rand(-50, -10)
    this.xVel = rand(-0.05, 0.05)
    this.yVel = rand(0.02, 0.1)
    this.angle = rand(0, Math.PI * 2)
    this.angleVel = rand(-0.001, 0.001)
    this.size = rand(7, 12)
    this.sizeOsc = rand(0.01, 0.5)
  }

  update(elapsed: number, now: number) {
    const xForce = rand(-0.001, 0.001)

    if (Math.abs(this.xVel + xForce) < 0.075) {
      this.xVel += xForce
    }

    this.x += this.xVel * elapsed
    this.y += this.yVel * elapsed
    this.angle += this.xVel * 0.05 * elapsed //this.angleVel * elapsed

    if (
      this.y - this.size > this.manager.height ||
      this.x + this.size < 0 ||
      this.x - this.size > this.manager.width
    ) {
      this.spawn()
    }

    this.render()
  }

  render() {
    this.manager.ctx.save()
    const { x, y, angle, size } = this
    this.manager.ctx.beginPath()
    this.manager.ctx.arc(x, y, size * 0.2, 0, Math.PI * 2, false)
    this.manager.ctx.fill()
    this.manager.ctx.restore()
  }
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)
