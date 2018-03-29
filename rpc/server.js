/**
 * Created by kdev on 3/29/18.
 */

let amqp = require('amqplib/callback_api');
let helpers = require('../helpers');

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        let queue = 'sha-generator-rpc';
        let msg   = 'SHA generation done';

        ch.assertQueue(queue, {durable: false});
        ch.prefetch(1);

        console.log('Wait for request');
        ch.consume(queue, (message) => {

            let hash = helpers.generateHash(message.content.toString());

            console.log(message);
            console.log('ID');



            ch.sendToQueue(
                message.properties.replyTo,
                new Buffer(msg),
                {
                    correlationId: message.properties.correlationId,
                    hash: hash
                }
            );

            ch.ack(message);

            console.log("Sent back %s", message.content.toString());
        });
    });

    //setTimeout(() => { conn.close(); process.exit(0) }, 500);
});