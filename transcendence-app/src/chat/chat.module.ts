import { Global, Module } from '@nestjs/common';
import { DbModule } from 'src/shared/db/db.module';
import { LocalFileModule } from 'src/shared/local-file/local-file.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Global()
@Module({
  imports: [DbModule, LocalFileModule],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
