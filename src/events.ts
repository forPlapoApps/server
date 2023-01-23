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
    const roomUid = res.data.roomUid;
    const preScore = lists.filter(
      (list) => list.data.userName === res.data.userName
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
        return list.data.roomUid == roomUid;
      })
    );
  });

  socket.on("logOutRoom", (res) => {
    const roomUid = res.data.roomUid;
    lists = lists.filter((list) => list.data.userName !== res.data.userName);
    io.in(roomUid).emit(
      "receivedScore",
      lists.filter((list) => {
        return list.data.roomUid == roomUid;
      })
    );
    socket.leave(roomUid);
  });

  socket.on("openScoreRequest", (res) => {
    const roomUid = res.data.roomUid;
    io.in(roomUid).emit("openAllScore");
  });

  socket.on("resetScoreRequest", (res) => {
    const roomUid = res.data.roomUid;
    lists = lists.map((list) => {
      if (list.data.roomUid === roomUid) {
        return {
          data: { roomUid: roomUid, userName: list.data.userName, value: 0 },
        };
      } else {
        return list;
      }
    });
    io.in(roomUid).emit(
      "resetAllScore",
      lists.filter((list) => list.data.roomUid === roomUid)
    );
  });

  socket.on("disconnect", (data) => {
    console.log("切断されました");
  });
};
