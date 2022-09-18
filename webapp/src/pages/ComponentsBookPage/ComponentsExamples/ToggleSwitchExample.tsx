import { useState } from 'react';
import { ToggleSwitch } from '../../../shared/components';
import { BookSection } from '../BookSection';

export const ToggleSwitchExample = () => {
  const [isToggled, setIsToggled] = useState(false);
  const onToggle = () => setIsToggled(!isToggled);
  return (
    <BookSection title="Chat Bubble component">
      <ToggleSwitch value="value" isToggled={false} onToggle={onToggle} />
      {/* <ToggleSwitch value="value" /> */}
    </BookSection>
  );
};
