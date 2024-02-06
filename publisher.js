const lib = require('amqplib/callback_api');
module.exports = { sendAmqp }

require('dotenv').config()
async function sendAmqp(queue, mess) {
    lib.connect(process.env.AMQP_URL, (err, connection) => {
        if (err) {
            throw err
        }
        connection.createChannel((err, channel) => {
            if (err) {
                throw (err)
            }
            let queueName = queue
            let message = mess
            channel.assertQueue(queueName, {
                durable: false
            })
            channel.sendToQueue(queueName, Buffer.from(message))
            setTimeout(() => {
                connection.close()
            }, 1000)
        })
    })
}

