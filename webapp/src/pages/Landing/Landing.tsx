import { Icon, IconSize, IconType } from '../../shared/components';
import Status from '../../shared/components/Status/Status';
import { Color } from '../../shared/types';
import './Landing.css';

export default function Landing() {
  return (
    <section className="landing">
      <Status playing />
      <Icon type={IconType.PLAY} color={Color.LIGHT} size={IconSize.LARGE} />
      <h1 className="text-style-0-bold">Landing 🚀</h1>
    </section>
  );
}
