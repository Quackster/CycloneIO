import SocketIO from 'socket.io'
import Room from '../../hotel/rooms/room'
import RoomPlayer from '../../hotel/rooms/player'

/**
 * EventManager class
 */
export default class EventManager {

    private socket: SocketIO.Socket

    /**
     * @param {SocketIO} socket - The socket connection
     */
    public constructor(socket: SocketIO.Socket) 
    {
        this.socket = socket

        this.registerRooms()
        this.registerPlayers()
    }

    /**
     * Registers rooms events
     */
    public registerRooms(): void 
    {
        this.socket.on('newRoom', id => {
            Room.load(this.socket, id)
        })
    }

    /**
     * Registers player events
     */
    public registerPlayers(): void 
    {
        this.socket.on('disconnect', () => {
            RoomPlayer.disconnect(this.socket.id)
        })
    }
}