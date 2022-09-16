import { ChatBubble, ChatBubbleVariant } from '../../../shared/components';
import { WILDCARD_AVATAR_URL } from '../../../shared/urls';
import { BookSection } from '../BookSection';

const randomAvatar = WILDCARD_AVATAR_URL;

const avProps = { url: randomAvatar };

export const ChatBubbleExample = () => (
  <BookSection title="Chat Bubble component">
    <ChatBubble
      variant={ChatBubbleVariant.SELF}
      avatar={avProps}
      text="Lorem fistrum nisi irure te voy a borrar el cerito elit amatomaa te voy a borrar el cerito. Sed quis amatomaa a peich. Ese hombree esse duis tiene musho peligro esse pupita eiusmod laboris torpedo. Ex consequat tiene musho peligro de la pradera apetecan. Et ese pedazo de mamaar esse. "
    />
    <ChatBubble
      variant={ChatBubbleVariant.OTHER}
      avatar={avProps}
      text="Lorem fistrum nisi irure te voy a borrar el cerito elit amatomaa te voy a borrar el cerito. Sed quis amatomaa a peich. Ese hombree esse duis tiene musho peligro esse pupita eiusmod laboris torpedo. Ex consequat tiene musho peligro de la pradera apetecan. Et ese pedazo de mamaar esse. "
    />

    <ChatBubble
      variant={ChatBubbleVariant.OTHER}
      avatar={avProps}
      text="Lorem fistrum nisi irure te voy a borrar el cerito elit amatomaa te voy a borrar el cerito. Sed quis amatomaa a peich. Ese hombree esse duis tiene musho peligro esse pupita eiusmod laboris torpedo. Ex consequat tiene musho peligro de la pradera apetecan. Et ese pedazo de mamaar esse. "
      name="fportela"
    />
    <ChatBubble
      variant={ChatBubbleVariant.OTHER}
      text="Lorem fistrum nisi irure te voy a borrar el cerito elit amatomaa te voy a borrar el cerito. Sed quis amatomaa a peich. Ese hombree esse duis tiene musho peligro esse pupita eiusmod laboris torpedo. Ex consequat tiene musho peligro de la pradera apetecan. Et ese pedazo de mamaar esse. "
    />
  </BookSection>
);
