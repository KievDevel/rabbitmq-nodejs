/**
 * Created by kdev on 3/29/18.
 */

let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        //TODO: move to config
        let ex = 'direct_logs';
        let args = process.argv.slice(2);
        let msg = args.slice(1).join(' ') || 'Hello World!';
        let severity = (args.length > 0) ? args[0] : 'info';

        ch.assertExchange(ex, 'direct', {durable: false});
        ch.publish(ex, severity, new Buffer(msg));
        console.log("Sent %s: '%s'", severity, msg);
    });

    setTimeout(function() { conn.close(); process.exit(0) }, 500);
});