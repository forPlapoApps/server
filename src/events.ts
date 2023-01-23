import { Socket } from "socket.io";
import { io } from "../app";

let lists: List[] = [];

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
    const preScore = lists.filter(
      (list) => list.userName === res.userName
    );

    socket.join(roomUid);
    lists.push(res);

    if (preScore.length >= 1) {
      lists = lists.filter((list) => {
        return list !== preScore[0];
      });
    }

    io.in(roomUid).emit(
      "receivedScore",
      lists.filter((list) => {
        return list.roomUid == roomUid;
      })
    );
  });

  socket.on("logOutRoom", (res) => {
    const roomUid = res.roomUid;
    lists = lists.filter((list) => list.userName !== res.userName);
    io.in(roomUid).emit(
      "receivedScore",
      lists.filter((list) => {
        return list.roomUid == roomUid;
      })
    );
    socket.leave(roomUid);
  });

  socket.on("openScoreRequest", (res) => {
    const roomUid = res.roomUid;
    io.in(roomUid).emit("openAllScore");
  });

  socket.on("resetScoreRequest", (res) => {
    const roomUid = res.roomUid;
    lists = lists.map((list) => {
      if (list.roomUid === roomUid) {
        return  { roomUid: roomUid, userName: list.userName, value: 0 }
      } else {
        return list;
      }
    });
    io.in(roomUid).emit(
      "resetAllScore",
      lists.filter((list) => list.roomUid === roomUid)
    );
  });

  socket.on("disconnect", (data) => {
    console.log("切断されました");
  });
};
