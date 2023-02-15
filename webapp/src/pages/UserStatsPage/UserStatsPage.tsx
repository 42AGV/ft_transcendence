import { RowItem } from '../../shared/components';
import { AVATAR_EP_URL, USERS_URL } from '../../shared/urls';
import { useParams } from 'react-router-dom';
import React, { useCallback } from 'react';
import { gameApi, usersApi } from '../../shared/services/ApiService';
import { useData } from '../../shared/hooks/UseData';
import { ENTRIES_LIMIT } from '../../shared/constants';
import { Query } from '../../shared/types';
import RowsPageTemplate from '../../shared/components/templates/RowsPageTemplate/RowsPageTemplate';
import {
  Game,
  GameControllerGetUserGamesRequest,
  User,
} from '../../shared/generated';

export default function UserStatsPage() {
  const { username } = useParams();
  const getUser = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user, isLoading: isUserLoading } = useData<User>(getUser);

  const mapGameToRow = (game: Game): RowItem => {
    return {
      title:
        `${game.playerOneScore} ${game.playerOneUsername} VS ` +
        `${game.playerTwoUsername} ${game.playerTwoScore}`,
      subtitle: `a ${game.gameMode} game ran for ${game.gameDurationInSeconds} seconds`,
      key: game.id,
    };
  };

  const getUserGames = useCallback(
    <T extends Query>(requestParameters: T) =>
      gameApi.gameControllerGetUserGames({
        ...requestParameters,
        limit: ENTRIES_LIMIT,
        userName: username!,
      } as GameControllerGetUserGamesRequest),
    [username],
  );

  return (
    <RowsPageTemplate
      title="game stats"
      isLoading={isUserLoading}
      isNotFound={!user}
      fetchFn={getUserGames}
      dataMapper={mapGameToRow}
      avatarProps={{
        url: user ? `${AVATAR_EP_URL}/${user.avatarId}` : '',
        XCoordinate: user ? user.avatarX : 0,
        YCoordinate: user ? user.avatarY : 0,
      }}
      avatarLabel={username!}
      avatarCaption="level x"
      avatarLinkTo={`${USERS_URL}/${username!}`}
    />
  );
}
