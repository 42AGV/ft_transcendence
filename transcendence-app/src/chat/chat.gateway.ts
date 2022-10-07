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
import { Console } from 'console';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

type Message = {
  messageId: string;
  message: string;
  userId: string;
};

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
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { message: string; room: string; myId: string },
  ): void {
    const newMessage: Message = {
      messageId: uuidv4(),
      message: data.message,
      userId: data.myId,
    };
    console.log({ newMessage });
    this.server.to(data.room).emit('new_message', newMessage);
  }
  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('room:', room);
    client.join(room);
  }
  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(room);
  }
}
