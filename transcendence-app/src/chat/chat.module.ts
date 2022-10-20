import { Global, Module } from '@nestjs/common';
import { DbModule } from 'src/shared/db/db.module';
import { LocalFileModule } from 'src/shared/local-file/local-file.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Global()
@Module({
  imports: [DbModule, LocalFileModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
