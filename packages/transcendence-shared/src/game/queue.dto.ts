export type GameChallengeDto = {
  gameRoomId: string;
  from: {
    username: string;
    id: string;
  };
};

export type GameUserChallengeDto = {
  to: {
    id: string;
  };
};

export enum GameChallengeStatus {
  CHALLENGE_DECLINED = 'challengeDeclined',
  CHALLENGE_ACCEPTED = 'challengeAccepted',
}

export enum GameStatus {
  READY = 'ready',
  FINISHED = 'finished',
}

export type GameChallengeResponseDto = {
  status: GameChallengeStatus;
  gameRoomId: string;
};

type GameAcceptedDto = {
  status: GameChallengeStatus.CHALLENGE_ACCEPTED;
  gameRoomId: string;
};

type GameReadyDto = {
  status: GameStatus.READY;
  gameRoomId: string;
};

type GameDeclinedDto = {
  status: GameChallengeStatus.CHALLENGE_DECLINED;
  gameRoomId?: never;
};

type GameFinishedDto = {
  status: GameStatus.FINISHED;
  gameRoomId?: never;
};

export enum gameQueueServerToClientWsEvents {
  gameStatusUpdate = 'gameStatusUpdate',
  gameChallenge = 'gameChallenge',
  gameContextUpdate = 'gameContextUpdate',
}

export enum gameQueueClientToServerWsEvents {
  gameQueueJoin = 'gameQueueJoin',
  gameQuitWaiting = 'gameQuitWaiting',
  gameChallengeResponse = 'gameChallengeResponse',
  gameUserChallenge = 'gameUserChallenge',
  gameQuitPlaying = 'gameQuitPlaying',
}

export type GameStatusUpdateDto =
  | GameAcceptedDto
  | GameReadyDto
  | GameDeclinedDto
  | GameFinishedDto;
