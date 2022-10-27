import { ChatMember } from '../../chatmember.domain';

export abstract class IChatMemberRepository {
  abstract add(chatMember: ChatMember): Promise<ChatMember | null>;
}
