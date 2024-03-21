import { MapData } from "../map_data"
import { Room } from "./room"

// First, we will create 10 rooms for testing
const ROOM_COUNT = 10

export class Map {
  private data: MapData
  private rooms: Room[] = []
  private startingRoom: Room
  constructor() {
    // create special starting room
    this.startingRoom = new Room({ x: 0, y: 0, rows: 10, cols: 10 })

    this.data = new MapData({
      roomCount: ROOM_COUNT,
      startingRoom: this.startingRoom.getData(),
      roomCreator: this.roomCreator
    })
  }

  getData() {
    return this.data
  }

  private roomCreator = (x: number, y: number) => {
    const room = new Room({ x, y })
    this.rooms.push(room)
    return room.getData()
  }
}