import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'localhost:3000' },
  namespace: 'api',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  afterInit() {
    console.log('Al iniciar');
  }

  handleConnection() {
    console.log('Conexión al sochet hecha');
  }

  handleDisconnect() {
    console.log('ALguien se fue! chao chao');
  }

  @SubscribeMessage('send_message')
  handleIncommingMessage(@MessageBody() message: string): void {
    console.log(message);
    this.server.emit('new_message', message);
  }
}
