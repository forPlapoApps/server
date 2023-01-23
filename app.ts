// @ts-nocheck
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
  res.send("Welcome to forPlapoApps's server!")
})


io.on("connection", (socket) => {
  console.log('接続しました')

  socket.on("sendScore", (res) => {
    const roomUid = res.data.roomUid
    const preScore = lists.filter((list) => list.data.userName === res.data.userName)
  
    socket.join(roomUid)
    lists.push(res)

    if (preScore.length >= 1) {
      lists = lists.filter((list) => { return list !== preScore[0] })
    }

    io.in(roomUid).emit("receivedScore", lists.filter((list) => {
      return list.data.roomUid == roomUid
    }))
  })

  socket.on("logOutRoom", (res) => {
    const roomUid = res.data.roomUid
    lists = lists.filter((list) => list.data.userName !== res.data.userName)
    io.in(roomUid).emit("receivedScore", lists.filter((list) => {
      return list.data.roomUid == roomUid
    }))
    socket.leave(roomUid)
  })

  socket.on("openScoreRequest", (res) => {
    const roomUid = res.data.roomUid
    io.in(roomUid).emit("openAllScore")
  })

  socket.on("resetScoreRequest", (res) => {
    const roomUid = res.data.roomUid
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
