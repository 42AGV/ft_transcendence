import './NotFoundPage.css';
import {
  Text,
  TextVariant,
  TextWeight,
  Header,
  IconVariant,
} from '../../shared/components';
import { useNavigation } from '../../shared/hooks/UseNavigation';

export default function NotFoundPage() {
  const { goBack } = useNavigation();

  return (
    <div className="not-found-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack()}>
        Oops...
      </Header>
      <div className="not-found-page__message">
        <Text variant={TextVariant.SUBTITLE} weight={TextWeight.BOLD}>
          ⚠️ 404 Not Found
        </Text>
      </div>
    </div>
  );
}
