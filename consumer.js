#!/usr/bin/env node

let amqp    = require('amqplib/callback_api');
let helpers = require('./helpers');

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        let queue = 'sha-generator';

        ch.assertQueue(queue, {durable: true});

        //accept only 1 message
        ch.prefetch(1);

        console.log("Waiting for messages in %s. To exit press CTRL+C", queue);

        ch.consume(queue, function(msg) {
            console.log("Received %s", msg.content.toString());

            let hash = helpers.generateHash(msg.content.toString());
            console.log('hash');
            console.log(hash);
        }, {noAck: true});
    });
});

