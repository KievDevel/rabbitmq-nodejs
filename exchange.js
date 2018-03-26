#!/usr/bin/env node

let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        let exchange = 'logs';
        let msg      = 'generate SHA';

        ch.assertExchange(exchange, 'fanout', {durable: false});
        ch.publish(exchange, '', new Buffer(msg));

        console.log("Sent %s", msg);
    });

    setTimeout(() => { conn.close(); process.exit(0) }, 500);
});
