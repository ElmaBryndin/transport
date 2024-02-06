require('dotenv').config()
const lib = require('amqplib/callback_api');
var fetch = require('node-fetch');
module.exports = { consumeMessages }

function consumeMessages() {
    lib.connect(process.env.AMQP_URL, (err, connection) => {
        if (err) {
            throw err
        }
        connection.createChannel((err, channel) => {
            if (err) {
                throw (err)
            }
            let queueName = process.env.QUEUE_TO_LISTEN

            channel.assertQueue(queueName, {
                durable: false
            })

            channel.consume(queueName, (msg) => {
                const msgStr = msg.content
                console.log(msgStr)
                //channel.ack(msg)

                fetch(process.env.ENDPOINT, {
                    method: 'POST',
                    body: JSON.stringify(msgStr),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': process.env.TOKEN
                    }
                })
                    .then(res => res.text().then(r => {
                        console.log(r)
                        channel.ack(msg)
                    }))
            })
        })
    })
}