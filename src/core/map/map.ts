import type { Application } from 'pixi.js'
import { MapData } from '../map_data'
import type { Player } from '../player'
import { Room } from './room'

// First, we will create 10 rooms for testing
const ROOM_COUNT = 10

export class Map {
  private data: MapData
  private rooms: Room[] = []

  constructor(private player: Player, private app: Application) {
    this.data = new MapData()
    this.initMap()
  }

  initMap() {
    this.rooms.length = 0
    const startingRoom = new Room(this, 0, 0)
    this.rooms.push(startingRoom)
    this.data.initRoomsData(ROOM_COUNT, {
      // create special starting room
      startingRoom: startingRoom.getData(),
      roomCreator: (x: number, y: number) => {
        const room = new Room(this, x, y)
        this.rooms.push(room)
        return room.getData()
      },
    })
  }

  update() {
    this.rooms.forEach(room => room.update())
  }

  getData() {
    return this.data
  }

  getPlayer() {
    return this.player
  }

  getApp() {
    return this.app
  }

  getRooms() {
    return this.rooms
  }
}
