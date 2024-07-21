import { Server } from 'socket.io'
import Redis from 'ioredis'

const pub = new Redis({
  host: 'redis-2307bbeb-gauravrikhari343-003d.i.aivencloud.com',
  port: 21724,
  username: 'default',
  password: 'AVNS_RS6hHu8YHZQ_2ICNIon',
})
const sub = new Redis({
  host: 'redis-2307bbeb-gauravrikhari343-003d.i.aivencloud.com',
  port: 21724,
  username: 'default',
  password: 'AVNS_RS6hHu8YHZQ_2ICNIon',
})

class SocketService {
  private _io: Server

  constructor() {
    console.log('Init Socket Service...')
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*',
      },
    })
    sub.subscribe('MESSAGES')
  }

  public initListener() {
    const io = this.io
    console.log('Init Socket Listener...')

    io.on('connect', (socket) => {
      console.log('Client connected: ', socket.id)

      socket.on('event:message', async ({ message }: { message: string }) => {
        console.log('Message: ', message)

        //publish this message to redis
        await pub.publish('MESSAGES', JSON.stringify({ message }))
      })
    })

    sub.on('message', async (channel, message) => {
      if (channel === 'MESSAGES') {
        console.log('new message from redis', message)
        io.emit('message', message)
        // await produceMessage(message)
        console.log('Message produced to kafka broker')
      }
    })
  }

  get io() {
    return this._io
  }
}

export default SocketService
