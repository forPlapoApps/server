import { Socket } from "socket.io";
import { io } from "../app";

let lists: List[] = [];

const listsAt = (roomUid: string) => {
  return lists.filter((list) => list.roomUid == roomUid);
};

const listsExcluded = (wastedScore: List) => {
  return lists.filter((list) => list !== wastedScore)
}

module.exports = (
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    List
  >
) => {
  socket.on("sendScore", (res) => {
    const roomUid = res.roomUid;
    const preScore = lists.filter((list) => list.userName === res.userName)[0];

    socket.join(roomUid);
    lists.push(res);

    if (preScore) {
      lists = listsExcluded(preScore);
    }

    io.in(roomUid).emit("receivedScore", listsAt(roomUid));
  });

  socket.on("logOutRoom", ({ roomUid, userName }) => {
    lists = lists.filter((list) => list.userName !== userName);
    io.in(roomUid).emit("receivedScore", listsAt(roomUid));
    socket.leave(roomUid);
  });

  socket.on("openScoreRequest", ({ roomUid }) => {
    io.in(roomUid).emit("openAllScore");
  });

  socket.on("resetScoreRequest", ({ roomUid }) => {
    lists = lists.map((list) => {
      return list.roomUid === roomUid
        ? { roomUid, userName: list.userName, value: 0 }
        : list;
    });
    io.in(roomUid).emit("resetAllScore", listsAt(roomUid));
  });

  socket.on("disconnect", (data) => {
    console.log("切断されました");
  });
};
