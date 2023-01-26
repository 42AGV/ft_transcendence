import { confirmAlert } from 'react-confirm-alert';
import './CustomConfirmAlert.css';
import { Button, ButtonProps, Text, TextVariant } from '../index';

type CustomConfirmAlertProps = {
  title: string;
  message: string;
  buttons: ButtonProps[];
};

export default function CustomConfirmAlert({
  title,
  message,
  buttons,
}: CustomConfirmAlertProps): void {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="popup-overlay">
          <Text variant={TextVariant.SUBHEADING}>{title ?? ''}</Text>
          <Text variant={TextVariant.PARAGRAPH}>{message ?? ''}</Text>
          {buttons.map((prop, i) => {
            const { onClick, ...restProps } = prop;
            if (onClick) {
              if (i !== 0) {
                const newClick: React.MouseEventHandler<HTMLButtonElement> = (
                  e,
                ) => {
                  onClick(e);
                  onClose();
                };
                return (
                  <Button {...{ ...restProps, onClick: newClick }} key={i} />
                );
              } else {
                const newClick: React.MouseEventHandler<
                  HTMLButtonElement
                > = () => {
                  onClose();
                };
                return (
                  <Button {...{ ...restProps, onClick: newClick }} key={i} />
                );
              }
            }
          })}
        </div>
      );
    },
  });
}
