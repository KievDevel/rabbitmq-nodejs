#!/usr/bin/env node

let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        let queue = 'sha-generator';
        let msg   = 'generate SHA';

        ch.assertQueue(queue, {durable: true});
        ch.sendToQueue(queue, new Buffer(msg), {persistent: true});

        console.log("Sent %s", msg);
    });

    setTimeout(() => { conn.close(); process.exit(0) }, 500);
});