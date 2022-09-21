import Text, { TextColor, TextVariant, TextWeight } from '../Text/Text';
import './ToggleSwitch.css';

type ToggleSwitchProps = {
  isToggled: boolean;
  onToggle: React.ChangeEventHandler<HTMLInputElement>;
  label?: string;
};

export default function ToggleSwitch({
  isToggled,
  onToggle,
  label,
}: ToggleSwitchProps) {
  return (
    <div className="toggle-switch">
      <label className="toggle-switch-label">
        <input type="checkbox" checked={isToggled} onChange={onToggle} />
        <span className="switch" />
        {label && (
          <div className="toggle-switch-text">
            <Text
              variant={TextVariant.PARAGRAPH}
              color={TextColor.LIGHT}
              weight={TextWeight.MEDIUM}
            >
              {label}
            </Text>
          </div>
        )}
      </label>
    </div>
  );
}
