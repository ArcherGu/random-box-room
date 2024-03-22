import type { RoomData } from './room_data'

/**
 * x,y: current room's opposite direction's room's coordinates
 * RoomData: current room
 * RoomDirection: new room's this direction will point to current room
 */
export type RoomPath = [number, number, RoomData, RoomDirection]

export enum RoomDirection {
  Top = 'top',
  Left = 'left',
  Bottom = 'bottom',
  Right = 'right',
}

export function getOppositeRoomDir(dir: RoomDirection) {
  switch (dir) {
    case RoomDirection.Top:
      return RoomDirection.Bottom
    case RoomDirection.Bottom:
      return RoomDirection.Top
    case RoomDirection.Left:
      return RoomDirection.Right
    case RoomDirection.Right:
      return RoomDirection.Left
  }
}

export function getRoomSurroundings(room: RoomData): RoomPath[] {
  const { x, y } = room.getDir()
  return [
    [x, y + 1, room, RoomDirection.Top],
    [x + 1, y, room, RoomDirection.Left],
    [x, y - 1, room, RoomDirection.Bottom],
    [x - 1, y, room, RoomDirection.Right],
  ]
}
