/**
 * Created by kdev on 3/29/18.
 */

let amqp    = require('amqplib/callback_api');
let helpers = require('../helpers');

amqp.connect('amqp://localhost', (error, connection) => {
    connection.createChannel((error, channel) => {
        channel.assertQueue('', {exclusive: true}, (error, queue) => {

            let block         = "send dummy data";
            let queueDesc     = 'sha-generator-rpc';
            let correlationID = helpers.generateUuid();

            console.log('request sha for block %s', block);

            channel.consume(queue.queue, (message) => {

                console.log(message.properties.correlationId);
                if (message.properties.correlationId === correlationID) {
                    console.log('Got hash %s', message.content.toString());
                    setTimeout(function() { connection.close(); process.exit(0) }, 500);
                }
            }, {noAck: true});

            console.log(JSON.stringify({
                correlationID: correlationID,
                replyTO: queue.queue
            } ));


            channel.sendToQueue(
                queueDesc,
                new Buffer(block.toString()),
                {
                    correlationId: correlationID,
                    replyTo: queue.queue
                }
            )
        });
    })
});