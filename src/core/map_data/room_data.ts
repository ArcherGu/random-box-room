import { RoomDirection } from "./helper"

export class RoomData<T = any> {
  surroundings: Map<RoomDirection, RoomData> = new Map()

  constructor(
    private x: number,
    private y: number, private outRef?: T) {

  }

  getOutRef() {
    return this.outRef
  }

  getPos() {
    return { x: this.x, y: this.y }
  }
}