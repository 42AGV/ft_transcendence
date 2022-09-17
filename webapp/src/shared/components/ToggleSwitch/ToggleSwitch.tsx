import Text, { TextColor, TextVariant, TextWeight } from '../Text/Text';
import './ToggleSwitch.css';

type ToggleSwitchProps = {
  value?: string;
  isToggled: boolean;
  onToggle: any;
};

export default function ToggleSwitch({
  value,
  isToggled,
  onToggle,
}: ToggleSwitchProps) {
  return (
    <div className="toggle-switch">
      <label className="toggle-switch-label">
        <input type="checkbox" checked={isToggled} onChange={onToggle} />
        <span className="switch" />
      </label>
      <div>
        {value && (
          <Text
            variant={TextVariant.HEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.BOLD}
          >
            {value}
          </Text>
        )}
      </div>
    </div>
  );
}
