import { ChatMember } from '../../chat.domain';

export abstract class IChatMemberRepository {
  abstract add(chatMember: ChatMember): Promise<ChatMember | null>;
}
