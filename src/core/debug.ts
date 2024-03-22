import type { Application } from 'pixi.js'
import { Graphics, Text } from 'pixi.js'
import type { Player } from './player'

export class Debug {
  private playerPosText: Text = new Text({
    text: 'x: 0, y: 0',
    style: {
      fill: '#ffffff',
      fontSize: 12,
    },
  })

  private globalAxisGraph: Graphics = new Graphics()

  constructor(private player: Player, private app: Application) {
    this.app.stage.addChild(this.playerPosText)
    this.app.stage.addChild(this.globalAxisGraph)
  }

  update() {
    const controls = this.player.getControls()
    const playerPos = controls.getPlayerPos()
    const viewportPos = controls.getViewportPos()
    // draw player position
    this.playerPosText.text = `x: ${playerPos.x}, y: ${playerPos.y}`
    this.playerPosText.position.set(viewportPos.x + 5, viewportPos.y - 20)

    // draw global axis
    const { x: globalX, y: globalY } = controls.getGlobalSourcePos()
    this.globalAxisGraph.clear()
      .moveTo(globalX, globalY)
      .lineTo(globalX + 20, globalY)
      .stroke('#ef4444')
      .moveTo(globalX, globalY)
      .lineTo(globalX, globalY + 20)
      .stroke('#10b981')
  }
}
