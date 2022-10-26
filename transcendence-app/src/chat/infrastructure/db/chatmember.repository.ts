import { ChatMember } from '../../chatmember.domain';
// import { UpdateChatMemberDto } from '../../dto/update-chatmember.dto';

export abstract class IChatMemberRepository {
  // abstract getByChatId(chatId: string): Promise<ChatMember[] | null>;
  // abstract getByUserId(userId: string): Promise<ChatMember[] | null>;
  // abstract updateByChatIdAndUserId(
  //   chatId: string,
  //   userId: string,
  //   updateChatMemberDto: UpdateChatMemberDto,
  // ): Promise<ChatMember | null>;
  abstract add(chatMember: ChatMember): Promise<ChatMember | null>;
}
