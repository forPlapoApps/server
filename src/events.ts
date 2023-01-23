import { Socket } from "socket.io";
import { io } from "../app";

let scores: Score[] = [];

const scoresAt = (roomUid: string) => {
  return scores.filter((score) => score.roomUid == roomUid);
};

const scoresExcluded = (wastedScore: Score) => {
  return scores.filter((score) => score !== wastedScore)
}

module.exports = (
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    Score
  >
) => {
  socket.on("sendScore", (res) => {
    const roomUid = res.roomUid;
    const preScore = scores.filter((score) => score.userName === res.userName)[0];

    socket.join(roomUid);
    scores.push(res);

    if (preScore) {
      scores = scoresExcluded(preScore);
    }

    io.in(roomUid).emit("receivedScore", scoresAt(roomUid));
  });

  socket.on("logOutRoom", ({ roomUid, userName }) => {
    scores = scores.filter((score) => score.userName !== userName);
    io.in(roomUid).emit("receivedScore", scoresAt(roomUid));
    socket.leave(roomUid);
  });

  socket.on("openScoreRequest", ({ roomUid }) => {
    io.in(roomUid).emit("openAllScore");
  });

  socket.on("resetScoreRequest", ({ roomUid }) => {
    scores = scores.map((score) => {
      return score.roomUid === roomUid
        ? { roomUid, userName: score.userName, value: 0 }
        : score;
    });
    io.in(roomUid).emit("resetAllScore", scoresAt(roomUid));
  });

  socket.on("disconnect", (data) => {
    console.log("切断されました");
  });
};
