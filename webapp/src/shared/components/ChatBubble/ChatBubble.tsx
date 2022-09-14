import { AvatarProps, XSAvatar } from '../Avatar/Avatar';
import Text, { TextColor, TextVariant, TextWeight } from '../Text/Text';
import './ChatBubble.css';

export enum ChatBubbleVariant {
  SELF = 'self',
  OTHER = 'other',
}

type ChatBubbleProps = {
  variant: ChatBubbleVariant;
  avatar: AvatarProps;
  text: string;
  name?: string;
};

export default function ChatBubble({
  variant,
  avatar,
  text,
  name,
}: ChatBubbleProps) {
  return (
    <div className={`chat-bubble chat-bubble-${variant}`}>
      <XSAvatar {...avatar} />
      <div className={`chat-bubble-text chat-bubble-text-${variant}`}>
        {name && (
          <Text
            variant={TextVariant.CAPTION}
            color={TextColor.LIGHT}
            weight={TextWeight.REGULAR}
            children={`${name}:`}
          />
        )}
        <Text
          variant={TextVariant.CAPTION}
          color={TextColor.LIGHT}
          weight={TextWeight.REGULAR}
          children={text}
        />
      </div>
    </div>
  );
}
