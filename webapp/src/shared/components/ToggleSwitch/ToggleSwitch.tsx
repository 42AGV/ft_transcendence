import './ToggleSwitch.css';

type ToggleSwitchProps = {
  isToggled: boolean;
  onToggle: React.ChangeEventHandler<HTMLInputElement>;
};

export default function ToggleSwitch({
  isToggled,
  onToggle,
}: ToggleSwitchProps) {
  return (
    <div className="toggle-switch">
      <label className="toggle-switch-label">
        <input type="checkbox" checked={isToggled} onChange={onToggle} />
        <span className="switch" />
      </label>
    </div>
  );
}
