import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/user/user.domain';

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
    console.log('Conexión al socket lista');
  }

  handleDisconnect() {
    console.log('ALguien se fue! chao chao');
  }

  @SubscribeMessage('send_message')
  handleIncommingMessage(
    socket: Socket,
    data: { room: string; message: string; userId: string },
  ): void {
    const { message, room, userId } = data;
    console.log({ message: message, userId: userId });
    this.server
      .to(room)
      .emit('new_message', { message: message, userId: userId });
  }
  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
  }
}
