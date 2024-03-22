import { Graphics } from 'pixi.js'
import { RoomData, RoomDirection } from '../map_data'
import type { Position } from '../types'
import { BACKGROUND_COLOR } from '../config'
import type { Map } from '.'

const ROOM_SIZE = 7
const ONE_GRID_SIZE = 20
const DOOR_WIDTH = 40

export interface RoomOptions {
  x: number
  y: number
}

export class Room {
  private data: RoomData
  private roomGraph: Graphics = new Graphics()
  // room source position is the top-left corner of the room, in canvas
  private roomSourcePos: Position = { x: 0, y: 0 }
  private doorsPos: [Position, Position][] = []

  constructor(private map: Map, x: number, y: number) {
    this.data = new RoomData(x, y, this)
    const app = this.map.getApp()
    app.stage.addChild(this.roomGraph)
  }

  getSize() {
    return ROOM_SIZE * ONE_GRID_SIZE
  }

  getData() {
    return this.data
  }

  getDoorsPos() {
    return this.doorsPos
  }

  get isStartingRoom() {
    const { x, y } = this.data.getDir()
    return x === 0 && y === 0
  }

  update() {
    const controls = this.map.getPlayer().getControls()
    const size = this.getSize()
    const { x, y } = controls.getGlobalSourcePos()
    const { x: xDir, y: yDir } = this.data.getDir()
    this.roomSourcePos = {
      x: x - size / 2 + xDir * size,
      y: y - size / 2 + yDir * size,
    }

    this.roomGraph.clear()
      .moveTo(this.roomSourcePos.x, this.roomSourcePos.y)
      .lineTo(this.roomSourcePos.x + size, this.roomSourcePos.y)
      .lineTo(this.roomSourcePos.x + size, this.roomSourcePos.y + size)
      .lineTo(this.roomSourcePos.x, this.roomSourcePos.y + size)
      .lineTo(this.roomSourcePos.x, this.roomSourcePos.y)
      .stroke({ width: 1, color: 0x000000 })

    // draw doors
    this.doorsPos = []
    const { surroundings } = this.data
    surroundings.forEach((_, dir) => {
      let doorPos: [Position, Position] | null = null
      if (dir === RoomDirection.Top) {
        doorPos = [
          {
            x: this.roomSourcePos.x + size / 2 - (DOOR_WIDTH / 2),
            y: this.roomSourcePos.y,
          },
          {
            x: this.roomSourcePos.x + size / 2 + (DOOR_WIDTH / 2),
            y: this.roomSourcePos.y,
          },
        ]
      }
      else if (dir === RoomDirection.Bottom) {
        doorPos = [
          {
            x: this.roomSourcePos.x + size / 2 - (DOOR_WIDTH / 2),
            y: this.roomSourcePos.y + size,
          },
          {
            x: this.roomSourcePos.x + size / 2 + (DOOR_WIDTH / 2),
            y: this.roomSourcePos.y + size,
          },
        ]
      }
      else if (dir === RoomDirection.Left) {
        doorPos = [
          {
            x: this.roomSourcePos.x,
            y: this.roomSourcePos.y + size / 2 - (DOOR_WIDTH / 2),
          },
          {
            x: this.roomSourcePos.x,
            y: this.roomSourcePos.y + size / 2 + (DOOR_WIDTH / 2),
          },
        ]
      }
      else if (dir === RoomDirection.Right) {
        doorPos = [
          {
            x: this.roomSourcePos.x + size,
            y: this.roomSourcePos.y + size / 2 - (DOOR_WIDTH / 2),
          },
          {
            x: this.roomSourcePos.x + size,
            y: this.roomSourcePos.y + size / 2 + (DOOR_WIDTH / 2),
          },
        ]
      }

      if (doorPos) {
        this.roomGraph.moveTo(doorPos[0].x, doorPos[0].y)
          .lineTo(doorPos[1].x, doorPos[1].y)
          .stroke({ width: 1, color: BACKGROUND_COLOR })
        this.doorsPos.push(doorPos)
      }
    })
  }

  getRoomBoundsInGlobal() {
    const { x: globalX, y: globalY } = this.map.getPlayer().getControls().getGlobalSourcePos()

    return {
      x: this.roomSourcePos.x - globalX,
      y: this.roomSourcePos.y - globalY,
      width: this.getSize(),
      height: this.getSize(),
    }
  }
}
