import { useState } from 'react';
import { ToggleSwitch } from '../../../shared/components';
import { BookSection } from '../BookSection';

export const ToggleSwitchExample = () => {
  const [isToggled, setIsToggled] = useState(false);
  const onToggle = () => setIsToggled(!isToggled);

  return (
    <BookSection title="Toggle switch component" displayVertical>
      <ToggleSwitch isToggled={isToggled} onToggle={onToggle} label="ReactJS" />
      <ToggleSwitch isToggled={isToggled} onToggle={onToggle} label="NestJS" />
      <ToggleSwitch
        isToggled={isToggled}
        onToggle={onToggle}
        label=" I read and agree with the terms and conditions."
      />
    </BookSection>
  );
};
