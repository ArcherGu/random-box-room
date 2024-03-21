import { RoomDirection, RoomPath, getOppositeRoomDir, getRoomSurroundings } from "./helper"
import { RoomData } from "./room_data"

export interface MapDataOptions {
  roomCount: number
  roomCreator?: (x: number, y: number) => RoomData
  startingRoom?: RoomData
}

export class MapData {
  private rooms: Map<string, RoomData> = new Map()
  constructor(private opts: MapDataOptions) {
    const { roomCount, startingRoom } = opts
    if (roomCount < 1) {
      throw new Error('Map must have at least one room')
    }

    if (startingRoom) {
      const { x, y } = startingRoom.getPos()
      if (x !== 0 || y !== 0) {
        throw new Error('Starting room must be at 0,0')
      }
    }

    this.initRooms()
  }

  private initRooms() {
    const roomCreator = this.opts.roomCreator || ((x, y) => new RoomData(x, y))
    this.opts.startingRoom = this.opts.startingRoom || roomCreator(0, 0)
    const { startingRoom, roomCount } = this.opts
    this.rooms.set('0,0', startingRoom)

    const paths: RoomPath[] = [
      [0, 1, startingRoom, RoomDirection.Top],
      [1, 0, startingRoom, RoomDirection.Left],
      [0, -1, startingRoom, RoomDirection.Bottom],
      [-1, 0, startingRoom, RoomDirection.Right]
    ]

    const restRoomCount = roomCount - 1
    for (let i = 0; i < restRoomCount; i++) {
      const temp = paths.splice(Math.floor(Math.random() * paths.length), 1)[0]
      const newRoomKey = `${temp[0]},${temp[1]}`
      if (!this.rooms.has(newRoomKey)) {
        // create new room
        const newRoom = roomCreator(temp[0], temp[1])
        this.rooms.set(newRoomKey, newRoom)

        // new room's this direction will point to current room
        newRoom.surroundings.set(temp[3], temp[2])
        // current room's this direction's opposite direction will point to new room
        temp[2].surroundings.set(getOppositeRoomDir(temp[3]), newRoom)

        // get new room's surroundings paths, if path's room is not exist, add to paths for next room
        const newRoomPaths = getRoomSurroundings(newRoom)
        for (const newPath of newRoomPaths) {
          const roomKey = `${newPath[0]},${newPath[1]}`
          if (!this.rooms.has(roomKey)) {
            paths.push(newPath)
          }
        }
      } else {
        i -= 1
      }
    }
  }
}