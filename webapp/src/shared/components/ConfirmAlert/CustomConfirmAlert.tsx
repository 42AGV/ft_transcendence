import { confirmAlert } from 'react-confirm-alert';
import './CustomConfirmAlert.css';
import {
  Button,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  Text,
  TextVariant,
} from '../index';

type CustomConfirmAlertProps = {
  title?: string;
  message: string;
  buttons: Partial<ButtonProps>[];
};

export default function CustomConfirmAlert({
  title,
  message,
  buttons,
}: CustomConfirmAlertProps): void {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="react-confirm-alert-body">
          {title && <Text variant={TextVariant.SUBHEADING}>{title}</Text>}
          <Text variant={TextVariant.PARAGRAPH}>{message ?? ''}</Text>
          <div className="react-confirm-alert-button-group">
            {buttons.map(
              ({ children, variant, buttonSize, onClick, ...restProps }, i) => {
                const newClick: React.MouseEventHandler<HTMLButtonElement> = (
                  e,
                ) => {
                  onClick && onClick(e);
                  onClose();
                };
                if (i === 0) {
                  variant || (variant = ButtonVariant.WARNING);
                  children || (children = 'Yes');
                } else {
                  variant || (variant = ButtonVariant.SUBMIT);
                  children || (children = 'No');
                }
                buttonSize || (buttonSize = ButtonSize.CHIP);
                return (
                  <Button
                    {...{
                      variant,
                      buttonSize,
                      onClick: newClick,
                      children,
                      ...restProps,
                    }}
                    key={i}
                  />
                );
              },
            )}
          </div>
        </div>
      );
    },
  });
}
