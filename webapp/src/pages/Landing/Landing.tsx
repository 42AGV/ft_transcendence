import { Icon, IconSize, IconType } from '../../shared/components';
import { Color } from '../../shared/types';
import './Landing.css';

export default function Landing() {
  return (
    <section className="Landing">
      <Icon
        type={IconType.PLAY}
        color={Color.LIGHT}
        size={IconSize.LARGE}
      ></Icon>
      <h1 className="text-style-0-bold">Landing 🚀</h1>
    </section>
  );
}
