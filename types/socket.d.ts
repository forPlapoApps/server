interface ClientToServerEvents {
  // これresじゃなくてreqでは。？？？
  sendScore: (res: List) => void;
  logOutRoom: (res: List) => void;
  openScoreRequest: (res: List) => void;
  resetScoreRequest: (res: List) => void;
}

interface ServerToClientEvents {
  receivedScore: (lists: List[]) => void;
  openAllScore: () => void;
  resetAllScore: (lists: List[]) => void;
}

interface InterServerEvents {
  ping: () => void;
}
