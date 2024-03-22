import { Application } from 'pixi.js'
import { Map } from './map'
import { Player } from './player'
import { Debug } from './debug'
import { BACKGROUND_COLOR } from './config'

export class World {
  private app: Application = new Application()
  private map!: Map
  private player!: Player
  private debug: Debug | null = null
  constructor(container: HTMLElement, isDev: boolean = false) {
    ; (async () => {
      await this.app.init({ background: BACKGROUND_COLOR, resizeTo: container })
      container.appendChild(this.app.canvas)

      this.player = new Player(this.app)
      this.map = new Map(this.player, this.app)
      this.player.map = this.map

      this.player.registerKeyboardEvent()
      if (isDev)
        this.debug = new Debug(this.player, this.app)

      this.app.ticker.add(() => {
        this.update()
      })
    })()
  }

  update() {
    this.map.update()
    this.player.update()
    this.debug?.update()
  }

  destroy() {
    this.app.destroy()
    this.player.unregisterKeyboardEvent()
  }
}
