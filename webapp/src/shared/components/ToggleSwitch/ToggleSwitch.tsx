import { useState } from 'react';
import './ToggleSwitch.css';

export default function ToggleSwitch() {
  const [isToggled, setIsToggled] = useState(false);
  const onToggle = () => setIsToggled(!isToggled);
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isToggled} onChange={onToggle} />
      <span className="switch" />
    </label>
  );
}
