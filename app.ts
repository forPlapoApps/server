import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  // cors: { origin: ["http://localhost:3000", "https://for-plapo-apps-client.vercel.app"] }
  cors: { origin: "*" }
})
const events = require('./src/events')

let lists: List[] = []

app.get("/", (req, res) => {
  res.send("Welcome to forPlapoApps's server!")
})

io.on("connection", (socket) => {
  console.log('接続しました')
  events(socket, lists)
})

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`server is running on ${PORT}`))

export { io }
