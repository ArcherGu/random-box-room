import type { RoomDirection } from './helper'

export class RoomData<T = any> {
  surroundings: Map<RoomDirection, RoomData> = new Map()
  // Ending room, only connected to one room
  end = true

  constructor(
    private x: number,
    private y: number,
    private outRef?: T,
  ) {

  }

  getOutRef() {
    return this.outRef
  }

  getDir() {
    return { x: this.x, y: this.y }
  }
}
