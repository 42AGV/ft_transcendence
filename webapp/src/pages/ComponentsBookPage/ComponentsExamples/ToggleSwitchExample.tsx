import { useState } from 'react';
import {
  ToggleSwitch,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../../shared/components';
import { BookSection } from '../BookSection';

export const ToggleSwitchExample = () => {
  const [isToggled, setIsToggled] = useState(false);
  const onToggle = () => setIsToggled(!isToggled);
  const value = isToggled ? 'toggled' : 'not toggled';

  return (
    <BookSection title="Chat Bubble component">
      <ToggleSwitch isToggled={isToggled} onToggle={onToggle} />
      <Text
        variant={TextVariant.HEADING}
        color={TextColor.LIGHT}
        weight={TextWeight.BOLD}
      >
        {value}
      </Text>
    </BookSection>
  );
};
