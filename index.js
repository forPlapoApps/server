const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`server is running on ${PORT}`))
