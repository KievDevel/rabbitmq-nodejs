#!/usr/bin/env node

let amqp    = require('amqplib/callback_api');
let helpers = require('./helpers');

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        let exchange = 'logs';

        ch.assertExchange(exchange, 'fanout', {durable: false});

        ch.assertQueue('', {exclusive: true}, function (error, queue) {
            console.log("Waiting for messages in %s. To exit press CTRL+C", queue.queue);
            ch.bindQueue(queue.queue, exchange, '');

            ch.consume(queue.queue, function(msg) {
                console.log("Received %s", msg.content.toString());

                let hash = helpers.generateHash(msg.content.toString());
                console.log('hash');
                console.log(hash);
            }, {noAck: true});
        });




    });
});

