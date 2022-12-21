import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ChatroomMember } from '../infrastructure/db/chatroom-member.entity';
import { IChatroomMemberRepository } from '../infrastructure/db/chatroom-member.repository';

@Injectable()
export class DestChatroomMemberPipe
  implements
    PipeTransform<Partial<ChatroomMember>, Promise<ChatroomMember | null>>
{
  constructor(private chatroomMemberRepository: IChatroomMemberRepository) {}

  transform(
    data: Partial<ChatroomMember>,
    metadata: ArgumentMetadata,
  ): Promise<ChatroomMember | null> {
    void metadata;
    if (!data?.chatId || !data?.userId) return new Promise(() => null);
    return this.chatroomMemberRepository.getById(data.chatId, data.userId);
  }
}
