import type { Application } from 'pixi.js'
import type { Position } from '../types'
import type { Room } from '../map'
import type { Player } from '.'

const SPEED = 5
const WALL_PADDING = 5

export class Controls {
  /**
   * global source position in canvas
   */
  private globalSourcePos: Position = { x: 0, y: 0 }

  /**
   * viewport position, always at the center of the canvas
   */
  private viewportPos: Position = { x: 0, y: 0 }

  /**
   * global source position to viewport position offset
   */
  private globalSourcePosOffset: Position = { x: 0, y: 0 }

  private keyboards = {
    left: false,
    right: false,
    up: false,
    down: false,
  }

  constructor(private player: Player, private app: Application) {
    this.updateViewportPos()

    // on init, global source position is the same as viewport position
    this.globalSourcePos.x = this.viewportPos.x
    this.globalSourcePos.y = this.viewportPos.y
    this.saveGlobalSourcePosOffset()

    this.app.renderer.on('resize', () => {
      this.updateViewportPos()
      this.globalSourcePos.x = this.viewportPos.x + this.globalSourcePosOffset.x
      this.globalSourcePos.y = this.viewportPos.y + this.globalSourcePosOffset.y
    })
  }

  private saveGlobalSourcePosOffset() {
    this.globalSourcePosOffset = {
      x: this.globalSourcePos.x - this.viewportPos.x,
      y: this.globalSourcePos.y - this.viewportPos.y,
    }
  }

  onKeydown = (e: KeyboardEvent) => {
    // w,a,s,d or arrow keys
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        this.keyboards.up = true
        break
      case 'a':
      case 'ArrowLeft':
        this.keyboards.left = true
        break
      case 's':
      case 'ArrowDown':
        this.keyboards.down = true
        break
      case 'd':
      case 'ArrowRight':
        this.keyboards.right = true
        break
    }
  }

  onKeyup = (e: KeyboardEvent) => {
    // w,a,s,d or arrow keys
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        this.keyboards.up = false
        break
      case 'a':
      case 'ArrowLeft':
        this.keyboards.left = false
        break
      case 's':
      case 'ArrowDown':
        this.keyboards.down = false
        break
      case 'd':
      case 'ArrowRight':
        this.keyboards.right = false
        break
    }
  }

  update() {
    const nextGlobalSourcePos = { ...this.globalSourcePos }

    if (this.keyboards.left || this.keyboards.right || this.keyboards.up || this.keyboards.down) {
      this.player.idle = false

      // horizontal movement
      if (this.keyboards.left)
        nextGlobalSourcePos.x += SPEED
      else if (this.keyboards.right)
        nextGlobalSourcePos.x -= SPEED

      // vertical movement
      if (this.keyboards.up)
        nextGlobalSourcePos.y += SPEED
      else if (this.keyboards.down)
        nextGlobalSourcePos.y -= SPEED

      const nextPlayerPos = this.getPlayerPos(nextGlobalSourcePos)

      const rooms = this.player.map.getRooms()
      let result: boolean | Position = false
      for (const room of rooms) {
        result = this.checkCollision(room, nextPlayerPos)
        if (result !== false)
          break
      }

      if (result === false)
        return

      if (result === true) {
        this.globalSourcePos.x = nextGlobalSourcePos.x
        this.globalSourcePos.y = nextGlobalSourcePos.y
      }
      else {
        this.globalSourcePos = {
          x: this.viewportPos.x - result.x,
          y: this.viewportPos.y - result.y,
        }
      }
      this.saveGlobalSourcePosOffset()
    }
    else {
      this.player.idle = true
    }
  }

  /**
   * Check if the player is colliding with the room
   * false: player is not in the room
   * true: player is in the room, and nextPos is not colliding with the room
   * Position: player is in the room, and nextPos is colliding with the room, return the corrected position
   */
  private checkCollision(room: Room, nextPos: Position) {
    const playerPos = this.getPlayerPos()
    const playSize = this.player.getSize()

    const bounds = room.getRoomBoundsInGlobal()
    // player is not in the room
    if (
      playerPos.x < bounds.x
      || playerPos.x >= (bounds.x + bounds.width)
      || playerPos.y < bounds.y
      || playerPos.y >= (bounds.y + bounds.height)
    )
      return false

    const doorsPos = room.getDoorsPos()

    // player is colliding with the room left wall
    if (nextPos.x - playSize.width / 2 - WALL_PADDING < bounds.x) {
      const x = bounds.x + playSize.width / 2 + WALL_PADDING
      let y = nextPos.y
      if (nextPos.y - playSize.height / 2 - WALL_PADDING < bounds.y) {
        y = bounds.y + playSize.height / 2 + WALL_PADDING
      }
      else if (nextPos.y + playSize.height / 2 + WALL_PADDING > bounds.y + bounds.height) {
        y = bounds.y + bounds.height - playSize.height / 2 - WALL_PADDING
      }
      else {
        for (const [doorStart, doorEnd] of doorsPos) {
          const doorX = doorStart.x - this.globalSourcePos.x

          if (doorStart.x === doorEnd.x && doorX === bounds.x) {
            const doorStartY = doorStart.y - this.globalSourcePos.y
            const doorEndY = doorEnd.y - this.globalSourcePos.y
            if (nextPos.y - playSize.height / 2 > doorStartY && nextPos.y + playSize.height / 2 < doorEndY)
              return true
          }
        }
      }
      return { x, y }
    }

    // player is colliding with the room right wall
    if (nextPos.x + playSize.width / 2 + WALL_PADDING > bounds.x + bounds.width) {
      const x = bounds.x + bounds.width - playSize.width / 2 - WALL_PADDING
      let y = nextPos.y
      if (nextPos.y - playSize.height / 2 - WALL_PADDING < bounds.y) {
        y = bounds.y + playSize.height / 2 + WALL_PADDING
      }
      else if (nextPos.y + playSize.height / 2 + WALL_PADDING > bounds.y + bounds.height) {
        y = bounds.y + bounds.height - playSize.height / 2 - WALL_PADDING
      }
      else {
        for (const [doorStart, doorEnd] of doorsPos) {
          const doorX = doorStart.x - this.globalSourcePos.x

          if (doorStart.x === doorEnd.x && doorX === bounds.x + bounds.width) {
            const doorStartY = doorStart.y - this.globalSourcePos.y
            const doorEndY = doorEnd.y - this.globalSourcePos.y
            if (nextPos.y - playSize.height / 2 > doorStartY && nextPos.y + playSize.height / 2 < doorEndY)
              return true
          }
        }
      }
      return { x, y }
    }

    // player is colliding with the room top wall
    if (nextPos.y - playSize.height / 2 - WALL_PADDING < bounds.y) {
      let x = nextPos.x
      const y = bounds.y + playSize.height / 2 + WALL_PADDING
      if (nextPos.x - playSize.width / 2 - WALL_PADDING < bounds.x) {
        x = bounds.x + playSize.width / 2 + WALL_PADDING
      }
      else if (nextPos.x + playSize.width / 2 + WALL_PADDING > bounds.x + bounds.width) {
        x = bounds.x + bounds.width - playSize.width / 2 - WALL_PADDING
      }
      else {
        for (const [doorStart, doorEnd] of doorsPos) {
          const doorY = doorStart.y - this.globalSourcePos.y

          if (doorStart.y === doorEnd.y && doorY === bounds.y) {
            const doorStartX = doorStart.x - this.globalSourcePos.x
            const doorEndX = doorEnd.x - this.globalSourcePos.x
            if (nextPos.x - playSize.width / 2 > doorStartX && nextPos.x + playSize.width / 2 < doorEndX)
              return true
          }
        }
      }
      return { x, y }
    }

    // player is colliding with the room bottom wall
    if (nextPos.y + playSize.height / 2 + WALL_PADDING > bounds.y + bounds.height) {
      let x = nextPos.x
      const y = bounds.y + bounds.height - playSize.height / 2 - WALL_PADDING
      if (nextPos.x - playSize.width / 2 - WALL_PADDING < bounds.x) {
        x = bounds.x + playSize.width / 2 + WALL_PADDING
      }
      else if (nextPos.x + playSize.width / 2 + WALL_PADDING > bounds.x + bounds.width) {
        x = bounds.x + bounds.width - playSize.width / 2 - WALL_PADDING
      }
      else {
        for (const [doorStart, doorEnd] of doorsPos) {
          const doorY = doorStart.y - this.globalSourcePos.y

          if (doorStart.y === doorEnd.y && doorY === bounds.y + bounds.height) {
            const doorStartX = doorStart.x - this.globalSourcePos.x
            const doorEndX = doorEnd.x - this.globalSourcePos.x
            if (nextPos.x - playSize.width / 2 > doorStartX && nextPos.x + playSize.width / 2 < doorEndX)
              return true
          }
        }
      }
      return { x, y }
    }

    return true
  }

  private updateViewportPos() {
    this.viewportPos = {
      x: this.app.renderer.width / 2,
      y: this.app.renderer.height / 2,
    }
  }

  getGlobalSourcePos() {
    return this.globalSourcePos
  }

  getViewportPos() {
    return this.viewportPos
  }

  /**
   * player position in global
   */
  getPlayerPos(globalSourcePos = this.globalSourcePos) {
    const { x, y } = globalSourcePos
    return {
      x: this.viewportPos.x - x,
      y: this.viewportPos.y - y,
    }
  }
}
