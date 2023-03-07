import {
  ButtonVariant,
  Header,
  IconVariant,
  MediumAvatar,
  ScoreRowItem,
  ScoreRowsList,
  SearchForm,
  TextColor,
  TextVariant,
  TextWeight,
  Text,
} from '../../shared/components';
import { AVATAR_EP_URL, USER_URL } from '../../shared/urls';
import { Link, useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { gameApi, usersApi } from '../../shared/services/ApiService';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { Query } from '../../shared/types';
import {
  GameControllerGetUserGamesRequest,
  GameControllerGetUserGamesSortEnum,
  GameWithUsers,
} from '../../shared/generated';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import {
  SearchContextProvider,
  useSearchContext,
} from '../../shared/context/SearchContext';
import LoadingPage from '../LoadingPage/LoadingPage';
import { useData } from '../../shared/hooks/UseData';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

type ScoreRowListTemplateProps<T> = {
  dataMapper: (data: T) => ScoreRowItem;
};

function ScoreRowsListTemplate<T>({
  dataMapper,
}: ScoreRowListTemplateProps<T>) {
  const { result, fetchMoreResults } = useSearchContext();

  const data = ((array: object): ScoreRowItem[] | null => {
    if (!Array.isArray(array)) {
      return null;
    }
    return array.map((el) => dataMapper(el));
  })(result.data);

  if (!data) {
    return <LoadingPage />;
  }

  return (
    <>
      <div className="rows-list-template-search">
        <SearchForm />
      </div>
      <div className="rows-list-template-rows">
        <ScoreRowsList rows={data} onLastRowVisible={fetchMoreResults} />
      </div>
    </>
  );
}

export default function UserMatchHistoryPage() {
  const { username } = useParams();
  const { navigate } = useNavigation();
  const { goBack } = useNavigation();
  const fetchUser = useCallback(
    () =>
      usersApi.userControllerGetUserByUserName({
        userName: username!,
      }),
    [username],
  );
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useData(fetchUser);

  const mapGameToScoreRow = (game: GameWithUsers): ScoreRowItem => {
    const scoreProps = {
      playerOneAvatar: {
        url: `${AVATAR_EP_URL}/${game.playerOne.avatarId}`,
        XCoordinate: game.playerOne.avatarX,
        YCoordinate: game.playerOne.avatarY,
      },
      playerTwoAvatar: {
        url: `${AVATAR_EP_URL}/${game.playerTwo.avatarId}`,
        XCoordinate: game.playerTwo.avatarX,
        YCoordinate: game.playerTwo.avatarY,
      },
      playerOneUserName: game.playerOne.username,
      playerTwoUserName: game.playerTwo.username,
      playerOneScore: game.playerOneScore,
      playerTwoScore: game.playerTwoScore,
    };
    return {
      scoreProps: scoreProps,
      key: game.id,
      gameMode: game.gameMode,
      gameDuration: game.gameDurationInSeconds,
      date: game.createdAt,
    };
  };

  const getUserGames = useCallback(
    <T extends Query>(requestParameters: T) =>
      gameApi.gameControllerGetUserGamesWithUsers({
        ...requestParameters,
        sort: GameControllerGetUserGamesSortEnum.True,
        limit: ENTRIES_LIMIT,
        userName: username!,
      } as GameControllerGetUserGamesRequest),
    [username],
  );

  if (isUserLoading) {
    return <LoadingPage />;
  }

  if (userError) {
    return <NotFoundPage />;
  }

  return (
    <div className="rows-page">
      <Header
        icon={IconVariant.ARROW_BACK}
        onClick={goBack}
        statusVariant="button"
        buttonProps={{
          variant: ButtonVariant.SUBMIT,
          onClick: () => navigate(`${USER_URL}/${username}/stats`),
          iconVariant: IconVariant.STATS,
        }}
      >
        games played
      </Header>
      <div className="rows-page-summary">
        <Link to={`${USER_URL}/${username!}`}>
          <MediumAvatar
            {...{
              url: user ? `${AVATAR_EP_URL}/${user.avatarId}` : '',
              XCoordinate: user ? user.avatarX : 0,
              YCoordinate: user ? user.avatarY : 0,
            }}
          />
        </Link>
        <div className="rows-page-text-info">
          <Text
            variant={TextVariant.SUBHEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.MEDIUM}
          >
            {username!}
          </Text>
          <Text
            variant={TextVariant.PARAGRAPH}
            color={TextColor.LIGHT}
            weight={TextWeight.MEDIUM}
          >
            {`level ${user?.level ?? 1}`}
          </Text>
        </div>
      </div>
      <SearchContextProvider fetchFn={getUserGames} maxEntries={ENTRIES_LIMIT}>
        <ScoreRowsListTemplate dataMapper={mapGameToScoreRow} />
      </SearchContextProvider>
    </div>
  );
}
