import { AvatarProps, SmallAvatar } from '../Avatar/Avatar';
import Text, { TextColor, TextVariant, TextWeight } from '../Text/Text';
import './ChatBubble.css';

export enum ChatBubbleVariant {
  SELF = 'self',
  OTHER = 'other',
}

type ChatBubbleProps = {
  variant: ChatBubbleVariant;
  avatar?: AvatarProps;
  text: string;
  name?: string;
  isConsecutive?: boolean;
  isFirst?: boolean;
};

export default function ChatBubble({
  variant,
  avatar,
  text,
  name,
  isConsecutive = false,
  isFirst = true,
}: ChatBubbleProps) {
  return (
    <div className={`chat-bubble chat-bubble-${variant}`}>
      <div className="chat-bubble-avatar">
        {avatar && !isConsecutive && <SmallAvatar {...avatar} />}
      </div>
      <div
        className={`chat-bubble-text-container chat-bubble-text-container-${variant}`}
      >
        <div className={'chat-bubble-text-author'}>
          {name && isFirst && (
            <Text
              variant={TextVariant.CAPTION}
              color={TextColor.LIGHT}
              weight={TextWeight.MEDIUM}
              children={name}
            />
          )}
        </div>
        <div className={`chat-bubble-text chat-bubble-text-${variant}`}>
          <Text
            variant={TextVariant.CAPTION}
            color={TextColor.LIGHT}
            weight={TextWeight.REGULAR}
            children={text}
          />
        </div>
      </div>
    </div>
  );
}
