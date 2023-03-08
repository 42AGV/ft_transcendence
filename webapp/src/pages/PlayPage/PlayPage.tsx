import './PlayPage.css';
import * as React from 'react';
import {
  ButtonProps,
  ButtonVariant,
  IconVariant,
  Input,
  InputVariant,
  MediumAvatar,
  NavigationBar,
  ReactiveButton,
  ScoreRowItem,
  ScoreRowsList,
} from '../../shared/components';
import { useNavigate } from 'react-router-dom';
import {
  AVATAR_EP_URL,
  PLAY_GAME_URL,
  PLAY_RULES_URL,
  USER_ME_URL,
} from '../../shared/urls';
import socket from '../../shared/socket';
import { useGamePairing } from '../../shared/hooks/UseGamePairing';
import { gameQueueClientToServerWsEvents } from 'transcendence-shared';
import {
  GamePairingStatusDtoGameQueueStatusEnum,
  User,
} from '../../shared/generated';
import { Link } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/UseAuth';
import { LandingPage } from '..';

type GameWithPlayers = {
  gameId: string;
  playerOne: User;
  playerTwo: User;
};

export default function PlayPage() {
  const { gameQueueStatus } = useGamePairing();
  const navigate = useNavigate();
  const [ongoingGames, setOngoingGames] = React.useState<GameWithPlayers[]>([]);
  const { authUser } = useAuth();
  const [search, setSearch] = React.useState('');

  function gameMapper(): ScoreRowItem[] {
    return ongoingGames.reduce<ScoreRowItem[]>((rowItems, currentGame) => {
      if (
        currentGame.playerOne.username.includes(search) ||
        currentGame.playerTwo.username.includes(search)
      ) {
        const scoreProps = {
          playerOneAvatar: {
            url: `${AVATAR_EP_URL}/${currentGame.playerOne.avatarId}`,
            XCoordinate: currentGame.playerOne.avatarX,
            YCoordinate: currentGame.playerOne.avatarY,
          },
          playerTwoAvatar: {
            url: `${AVATAR_EP_URL}/${currentGame.playerTwo.avatarId}`,
            XCoordinate: currentGame.playerTwo.avatarX,
            YCoordinate: currentGame.playerTwo.avatarY,
          },
          playerOneUserName: currentGame.playerOne.username,
          playerTwoUserName: currentGame.playerTwo.username,
        };
        const rowItem = {
          key: currentGame.gameId,
          url: `${PLAY_GAME_URL}/${currentGame.gameId}`,
          scoreProps: scoreProps,
        };
        return [...rowItems, rowItem];
      }
      return rowItems;
    }, []);
  }

  let buttons = [
    {
      variant: ButtonVariant.SUBMIT,
      iconVariant: IconVariant.INFO,
      onClick: () => navigate(PLAY_RULES_URL),
      children: 'Read game rules',
    },
  ];

  React.useEffect(() => {
    function ongoingGamesListener(games: GameWithPlayers[]) {
      setOngoingGames(games);
    }

    function addGameListener(game: GameWithPlayers) {
      setOngoingGames((prevOngoingGames) => [...prevOngoingGames, game]);
    }

    function removeGameListener(gameId: string) {
      setOngoingGames((prevOngoingGames) =>
        prevOngoingGames.filter((ongoingGame) => gameId !== ongoingGame.gameId),
      );
    }

    socket.on('ongoingGames', ongoingGamesListener);
    socket.on('addGame', addGameListener);
    socket.on('removeGame', removeGameListener);
    socket.emit('getOngoingGames');

    return () => {
      socket.off('ongoingGames');
      socket.off('addGame');
      socket.off('removeGame');
    };
  }, []);

  if (gameQueueStatus === GamePairingStatusDtoGameQueueStatusEnum.None) {
    buttons.push({
      variant: ButtonVariant.SUBMIT,
      iconVariant: IconVariant.ADD,
      onClick: () => {
        socket.emit(gameQueueClientToServerWsEvents.gameQueueJoin);
      },
      children: 'Join game queue',
    });
  }

  if (!authUser) {
    return <LandingPage />;
  }

  return (
    <div className="play-page">
      <div className="play-page-avatar">
        <Link to={`${USER_ME_URL}`}>
          <MediumAvatar
            url={`${AVATAR_EP_URL}/${authUser.avatarId}`}
            XCoordinate={authUser.avatarX}
            YCoordinate={authUser.avatarY}
          />
        </Link>
      </div>
      <div className="play-page-search">
        <div className="play-page-search-form">
          <Input
            variant={InputVariant.DARK}
            iconVariant={IconVariant.SEARCH}
            placeholder="search"
            value={search}
            name="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="play-page-games">
        <ScoreRowsList rows={gameMapper()} />
      </div>
      <div className="play-page-navigation">
        <NavigationBar />
      </div>
      {buttons && (
        <div className="play-page-buttons">
          {buttons.map((buttonProp: ButtonProps, idx) => (
            <ReactiveButton key={idx} {...buttonProp} />
          ))}
        </div>
      )}
    </div>
  );
}
