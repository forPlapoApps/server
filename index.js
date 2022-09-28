const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, {
  // cors: { origin: ["http://localhost:3000", "https://for-plapo-apps-client.vercel.app"] }
  cors: { origin: "*" }
})

let lists = []

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/pages/index.html')
})


io.on("connection", (socket) => {
  console.log('接続しました')

  socket.on("sendScore", ({ data: res }) => {
    const roomUid = res.roomUid
    const preScore = lists.filter(({ data }) => data.userName === res.userName)
  
    socket.join(roomUid)
    lists.push(res)

    if (preScore.length >= 1) {
      lists = lists.filter((list) => { return list !== preScore[0] })
    }

    io.in(roomUid).emit("receivedScore", lists.filter(({ data }) => {
      return data.roomUid == roomUid
    }))
  })

  socket.on("logOutRoom", ({ data: res }) => {
    const roomUid = res.roomUid
    lists = lists.filter(({ data }) => data.userName !== res.userName)
    io.in(roomUid).emit("receivedScore", lists.filter(({ data }) => {
      return data.roomUid == roomUid
    }))
    socket.leave(roomUid)
  })

  socket.on("openScoreRequest", ({ data: res }) => {
    const roomUid = res.roomUid
    io.in(roomUid).emit("openAllScore")
  })

  socket.on("resetScoreRequest", ({ data: res }) => {
    const roomUid = res.roomUid
    lists = lists.map((list) => {
      if (list.data.roomUid === roomUid) {
        return { data: { roomUid: roomUid, userName: list.data.userName, value: 0 }}
      } else {
        return list
      }
    })
    io.in(roomUid).emit("resetAllScore", lists.filter((list) => list.data.roomUid === roomUid))
  })

  socket.on("disconnect", (data) => {
    console.log('切断されました')
  })
})

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`server is running on ${PORT}`))
