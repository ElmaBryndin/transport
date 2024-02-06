require('dotenv').config()
const express = require('express')
const app = express();
const PORT = 8080;
const publisher = require("./publisher.js")
const consumer = require("./consumer.js")

app.use(express.json())

app.listen(
    PORT,
    () => console.log("YEYEYEYAHH!")
)

consumer.consumeMessages()

app.get('/info', (req, res) => {
    res.status(200).send({
        message: "Hello world!"
    })
})

app.post('/upload/:queue', (req, res) => {
    const { queue } = req.params
    const { message } = req.body

    publisher.sendAmqp(queue, message).then(() => { res.status(200).send({ message: `The message ${message} for ${queue} is queued!` }) })
})