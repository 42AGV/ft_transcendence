import './EditableAvatar.css';
import { AvatarProps } from './Avatar';
import useDrag from '../../hooks/UseDrag';
import { Text, TextColor, TextVariant, TextWeight } from '../index';
import { useRef } from 'react';

export function EditableAvatar({ url }: AvatarProps) {
  const { picturePosition, handleMouseDown, handleMouseMove, handleMouseUp } =
    useDrag({ x: 0, y: 0 });
  const ref = useRef<HTMLImageElement>(null);
  const factor = 0.6896;
  const FormatNumber = (value: number) => Math.round(value * factor);
  const position = {
    objectPosition: `${FormatNumber(picturePosition.x)}px ${FormatNumber(
      picturePosition.y,
    )}px`,
  };
  /* TODO: implement this: upload position, preferentially with decimals, on submit, to DB
  // useEffect(()=> {
     fetch(/api/v1/users/${uuid}/ ... , {
      method: 'PUT',
    })
  // }, [position]); */
  ref?.current?.addEventListener('dragstart', (e) => e.preventDefault());
  return (
    <div className="editable-avatar">
      <Text
        variant={TextVariant.SUBHEADING}
        color={TextColor.LIGHT}
        weight={TextWeight.BOLD}
      >
        Edit visible area
      </Text>
      <figure
        className="editable-avatar-wrapper"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseMove}
        onMouseOut={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        <img
          ref={ref}
          src={url}
          alt={url}
          className="editable-avatar__image"
          style={position}
        />
      </figure>
    </div>
  );
}
