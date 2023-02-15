import './RowsPageTemplate.css';
import {
  Header,
  IconVariant,
  MediumAvatar,
  RowItem,
  RowsListTemplate,
  TextColor,
  TextVariant,
  TextWeight,
  Text,
  ButtonProps,
  AvatarProps,
} from '../..';
import { Link } from 'react-router-dom';
import { useNavigation } from '../../../hooks/UseNavigation';
import React from 'react';
import './RowsPageTemplate.css';
import { ENTRIES_LIMIT } from '../../../constants';
import { SearchContextProvider } from '../../../context/SearchContext';
import { Query } from '../../../types';
import { LoadingPage } from '../../../../pages';
import NotFoundPage from '../../../../pages/NotFoundPage/NotFoundPage';

type RowsTemplatePageProps<T> = {
  title: string;
  avatarProps: AvatarProps;
  avatarLabel: string;
  avatarCaption: string;
  avatarLinkTo: string;
  isLoading: boolean;
  isNotFound: boolean;
  fetchFn: <RequestType extends Query>(
    requestParams: RequestType,
  ) => Promise<T[]>;
  dataMapper: (item: T) => RowItem;
  button?: ButtonProps;
};

export default function RowsPageTemplate<T>({
  title,
  avatarProps,
  avatarLabel,
  avatarCaption,
  isLoading,
  isNotFound,
  fetchFn,
  dataMapper,
  button,
  avatarLinkTo,
}: RowsTemplatePageProps<T>) {
  const { goBack } = useNavigation();

  if (isLoading) {
    return <LoadingPage />;
  }
  if (isNotFound) {
    return <NotFoundPage />;
  }
  return (
    <div className="rows-page">
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={goBack}
        statusVariant="button"
        buttonProps={button}
      >
        {title}
      </Header>
      <div className="rows-page-summary">
        <Link to={avatarLinkTo}>
          <MediumAvatar {...avatarProps} />
        </Link>
        <div className="rows-page-text-info">
          <Text
            variant={TextVariant.SUBHEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.MEDIUM}
          >
            {avatarLabel}
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.MEDIUM}
          >
            {avatarCaption}
          </Text>
        </div>
      </div>
      <SearchContextProvider fetchFn={fetchFn} maxEntries={ENTRIES_LIMIT}>
        <RowsListTemplate dataMapper={dataMapper} />
      </SearchContextProvider>
    </div>
  );
}
