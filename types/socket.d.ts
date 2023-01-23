interface ClientToServerEvents {
  sendScore: (req: Score) => void;
  logOutRoom: (req: Score) => void;
  openScoreRequest: (req: roomUidType) => void;
  resetScoreRequest: (req: roomUidType) => void;
}

interface ServerToClientEvents {
  receivedScore: (res: Score[]) => void;
  openAllScore: () => void;
  resetAllScore: (res: Score[]) => void;
}

interface InterServerEvents {
  // ping: () => void;
}
