import { Application } from "pixi.js"

export class World {
  private app: Application = new Application()
  constructor(container: HTMLElement) {
    ; (async () => {
      await this.app.init({ background: '#1099bb', resizeTo: container })
      container.appendChild(this.app.canvas)
    })()
  }

  destroy() {
    this.app.destroy()
  }
}