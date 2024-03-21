import { RoomData } from "../map_data"


const ONE_GRID_SIZE = 10

export interface RoomOptions {
  x: number
  y: number
  rows?: number
  cols?: number
}

export class Room {
  private data: RoomData
  constructor(private opts: RoomOptions) {
    const { x, y } = opts
    this.data = new RoomData(x, y, this)
  }

  public getData() {
    return this.data
  }
}