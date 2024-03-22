import type { Application } from 'pixi.js'
import { Graphics } from 'pixi.js'
import type { Map } from '../map'
import type { Size } from '../types'
import { Controls } from './controls'

const PLAY_SIZE = 5

export class Player {
  map!: Map
  private controls: Controls
  private playerGraph: Graphics = new Graphics()

  public idle = true
  constructor(private app: Application) {
    this.controls = new Controls(this, app)
    this.app.stage.addChild(this.playerGraph)
    this.draw()
  }

  update() {
    this.controls.update()
    this.draw()
  }

  draw() {
    // draw player
    const { x, y } = this.controls.getViewportPos()
    this.playerGraph.clear()
    this.playerGraph.circle(x, y, PLAY_SIZE)
    this.playerGraph.fill(0xFF0000)
  }

  getSize(): Size {
    return {
      width: PLAY_SIZE * 2,
      height: PLAY_SIZE * 2,
    }
  }

  getControls() {
    return this.controls
  }

  registerKeyboardEvent() {
    document.addEventListener('keydown', this.controls.onKeydown)
    document.addEventListener('keyup', this.controls.onKeyup)
  }

  unregisterKeyboardEvent() {
    document.removeEventListener('keydown', this.controls.onKeydown)
    document.removeEventListener('keyup', this.controls.onKeyup)
  }
}
