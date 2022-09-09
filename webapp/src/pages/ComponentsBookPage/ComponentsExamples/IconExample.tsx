import { Icon, IconVariant, IconSize } from '../../../shared/components';
import { Color } from '../../../shared/types';
import { BookSection } from '../BookSection';

export const IconExample = () => (
  <BookSection title="Icon component">
    <Icon
      variant={IconVariant.PLAY}
      color={Color.LIGHT}
      size={IconSize.LARGE}
    />
    <Icon
      variant={IconVariant.CHAT}
      color={Color.LIGHT}
      size={IconSize.LARGE}
    />
    <Icon
      variant={IconVariant.FILE}
      color={Color.LIGHT}
      size={IconSize.LARGE}
    />
    <Icon
      variant={IconVariant.LOGIN}
      color={Color.LIGHT}
      size={IconSize.LARGE}
    />
    <Icon
      variant={IconVariant.SEARCH}
      color={Color.LIGHT}
      size={IconSize.LARGE}
    />
  </BookSection>
);
