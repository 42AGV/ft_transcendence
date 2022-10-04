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
};

export default function ChatBubble({
  variant,
  avatar,
  text,
  name,
}: ChatBubbleProps) {
  return (
    <div className={`chat-bubble chat-bubble-${variant}`}>
      {avatar && <SmallAvatar {...avatar} />}
      <div
        className={`chat-bubble-text-container chat-bubble-text-container-${variant}`}
      >
        <div className={'chat-bubble-text-author'}>
          {name && (
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
