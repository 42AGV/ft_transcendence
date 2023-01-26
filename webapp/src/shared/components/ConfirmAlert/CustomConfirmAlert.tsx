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
        <div className="react-confirm-alert-body">
          <Text variant={TextVariant.SUBHEADING}>{title ?? ''}</Text>
          <Text variant={TextVariant.PARAGRAPH}>{message ?? ''}</Text>
          <div className="react-confirm-alert-button-group">
            {buttons.map((prop, i) => {
              const { onClick, ...restProps } = prop;
              if (i === 0) {
                const newClick: React.MouseEventHandler<HTMLButtonElement> = (
                  e,
                ) => {
                  onClick && onClick(e);
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
            })}
          </div>
        </div>
      );
    },
  });
}
