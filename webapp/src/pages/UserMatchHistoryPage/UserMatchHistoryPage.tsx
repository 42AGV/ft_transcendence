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
import React, { useCallback } from 'react';
import { gameApi, usersApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { Query } from '../../shared/types';
import RowsPageTemplate from '../../shared/components/templates/RowsPageTemplate/RowsPageTemplate';
import {
  Game,
  GameControllerGetUserGamesRequest,
  UserResponseDto,
  GameControllerGetUserGamesSortEnum,
} from '../../shared/generated';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import LoadingPage from '../LoadingPage/LoadingPage';
import {
  SearchContextProvider,
  useSearchContext,
} from '../../shared/context/SearchContext';

export default function UserMatchHistoryPage() {
  const { username } = useParams();
  const { navigate } = useNavigation();
  const { goBack } = useNavigation();
  const { result, fetchMoreResults } = useSearchContext();
  const getSelf = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: self, isLoading: isSelfLoading } =
    useData<UserResponseDto>(getSelf);

  const mapGameToScoreRow = (game: Game): ScoreRowItem => {
    const getOther = useCallback(
      () =>
        usersApi.userControllerGetUserByUserName({
          userName:
            username === game.playerOneUsername
              ? game.playerTwoUsername
              : game.playerOneUsername,
        }),
      [username],
    );
    const { data: other, isLoading: isOtherLoading } =
      useData<UserResponseDto>(getOther);
    const playerOne = self!.username === game.playerOneUsername ? self : other;
    const playerTwo = self!.username === game.playerOneUsername ? other : self;
    const scoreProps = {
      playerOneAvatar: {
        url: `${AVATAR_EP_URL}/${playerOne!.avatarId}`,
        XCoordinate: playerOne!.avatarX,
        YCoordinate: playerOne!.avatarY,
      },
      playerTwoAvatar: {
        url: `${AVATAR_EP_URL}/${playerTwo!.avatarId}`,
        XCoordinate: playerTwo!.avatarX,
        YCoordinate: playerTwo!.avatarY,
      },
      playerOneUserName: playerOne!.username,
      playerTwoUserName: playerTwo!.username,
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

  const data = ((array: object): ScoreRowItem[] | null => {
    if (!Array.isArray(array)) {
      return null;
    }
    return array.map((el) => mapGameToScoreRow(el));
  })(result.data);

  const getUserGames = useCallback(
    <T extends Query>(requestParameters: T) =>
      gameApi.gameControllerGetUserGames({
        ...requestParameters,
        sort: GameControllerGetUserGamesSortEnum.True,
        limit: ENTRIES_LIMIT,
        userName: username!,
      } as GameControllerGetUserGamesRequest),
    [username],
  );
  if (isSelfLoading) {
    return <LoadingPage />;
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
              url: self ? `${AVATAR_EP_URL}/${self.avatarId}` : '',
              XCoordinate: self ? self.avatarX : 0,
              YCoordinate: self ? self.avatarY : 0,
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
            {`level ${self?.level ?? 1}`}
          </Text>
        </div>
      </div>
      <SearchContextProvider fetchFn={getUserGames} maxEntries={ENTRIES_LIMIT}>
        <>
          <div className="rows-list-template-search">
            <SearchForm />
          </div>
          <div className="rows-list-template-rows">
            <ScoreRowsList rows={data!} onLastRowVisible={fetchMoreResults} />
          </div>
        </>
      </SearchContextProvider>
    </div>
  );
}
