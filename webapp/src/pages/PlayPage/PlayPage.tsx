import { Game, Header, IconVariant } from '../../shared/components';
import { useNavigation } from '../../shared/hooks/UseNavigation';

import './PlayPage.css';

export default function PlayPage() {
  const { goBack } = useNavigation();

  return (
    <div className="play-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        Hit the brick!
      </Header>
      <Game />
    </div>
  );
}
