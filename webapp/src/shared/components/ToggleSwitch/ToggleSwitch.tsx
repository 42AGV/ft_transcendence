import { useState } from 'react';
import Text, { TextColor, TextVariant, TextWeight } from '../Text/Text';
import './ToggleSwitch.css';

type ToggleSwitchProps = {
  value?: string;
  isToggled: boolean;
  onToggle: React.ChangeEventHandler<HTMLInputElement>;
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
      <div className="toggle-switch-text">
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

// This version works
// type ToggleSwitchProps = {
//   value?: string;
// };

// export default function ToggleSwitch({ value }: ToggleSwitchProps) {
//   const [isToggled, setIsToggled] = useState(false);
//   const onToggle = () => setIsToggled(!isToggled);
//   return (
//     <div className="toggle-switch">
//       <label className="toggle-switch-label">
//         <input type="checkbox" checked={isToggled} onChange={onToggle} />
//         <span className="switch" />
//       </label>
//       <span className="toggle-switch-text">
//         {value && (
//           <Text
//             variant={TextVariant.HEADING}
//             color={TextColor.LIGHT}
//             weight={TextWeight.BOLD}
//           >
//             {value}
//           </Text>
//         )}
//       </span>
//     </div>
//   );
// }
