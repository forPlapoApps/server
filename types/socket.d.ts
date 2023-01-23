interface ClientToServerEvents {
  sendScore: (req: List) => void;
  logOutRoom: (req: List) => void;
  openScoreRequest: (req: roomUidType) => void;
  resetScoreRequest: (req: roomUidType) => void;
}

interface ServerToClientEvents {
  receivedScore: (res: List[]) => void;
  openAllScore: () => void;
  resetAllScore: (res: List[]) => void;
}

interface InterServerEvents {
  ping: () => void;
}
