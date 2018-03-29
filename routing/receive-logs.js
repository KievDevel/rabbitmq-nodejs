/**
 * Created by kdev on 3/29/18.
 */

let amqp = require('amqplib/callback_api');

let args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
}

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        //TODO: move to config
        let ex = 'direct_logs';

        ch.assertExchange(ex, 'direct', {durable: false});

        ch.assertQueue('', {exclusive: true}, function(err, q) {
            console.log('Waiting for logs. To exit press CTRL+C');

            args.forEach(function(severity) {
                ch.bindQueue(q.queue, ex, severity);
            });

            ch.consume(q.queue, function(msg) {
                console.log(" %s: '%s'", msg.fields.routingKey, msg.content.toString());
            }, {noAck: true});
        });
    });
});