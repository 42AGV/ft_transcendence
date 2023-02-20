import { ButtonVariant, IconVariant, RowItem } from '../../shared/components';
import { AVATAR_EP_URL, USER_URL } from '../../shared/urls';
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
  UserResponseDto,
} from '../../shared/generated';
import { useNavigation } from '../../shared/hooks/UseNavigation';

export default function UserMatchHistoryPage() {
  const { username } = useParams();
  const { navigate } = useNavigation();
  const getUser = useCallback(
    () => usersApi.userControllerGetUserByUserName({ userName: username! }),
    [username],
  );
  const { data: user, isLoading: isUserLoading } =
    useData<UserResponseDto>(getUser);

  const mapGameToRow = (game: Game): RowItem => {
    const self: { username?: string; score: number } = {
      username: username,
      score:
        username === game.playerOneUsername
          ? game.playerOneScore
          : game.playerTwoScore,
    };
    const other: { username?: string; score: number } = {
      username:
        username === game.playerOneUsername
          ? game.playerTwoUsername
          : game.playerOneUsername,
      score:
        username === game.playerOneUsername
          ? game.playerTwoScore
          : game.playerOneScore,
    };
    const getStringResult = () => {
      return self.score < other.score
        ? 'losing'
        : self.score === other.score
        ? 'tying'
        : 'winning';
    };
    return {
      title:
        `'${self.username}' scored ${self.score} points VS ` +
        `'${other.username}' that scored ${
          other.score
        } points, ${getStringResult()} the game`,
      subtitle: `a ${game.gameMode} game ran for ${game.gameDurationInSeconds} seconds`,
      key: game.id,
      altText: `Game started on ${game.createdAt}`,
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
      title="games played"
      isLoading={isUserLoading}
      isNotFound={!user}
      fetchFn={getUserGames}
      dataMapper={mapGameToRow}
      avatarProps={{
        url: user ? `${AVATAR_EP_URL}/${user.avatarId}` : '',
        XCoordinate: user ? user.avatarX : 0,
        YCoordinate: user ? user.avatarY : 0,
      }}
      button={{
        variant: ButtonVariant.SUBMIT,
        onClick: () => navigate(`${USER_URL}/${username}/stats`),
        iconVariant: IconVariant.ARROW_FORWARD,
      }}
      avatarLabel={username!}
      avatarCaption={`level ${user?.level ?? 1}`}
      avatarLinkTo={`${USER_URL}/${username!}`}
    />
  );
}
