// amqp = require('amqplib/callback_api');
// amqp.connect('amqp://admin:123456@185.185.71.190', function(err, conn) {
//   conn.createChannel(function(err, ch) {
//     var q = 'hello';

//     ch.assertQueue(q, {durable: false});
//     // Note: on Node 6 Buffer.from(msg) should be used
//     ch.sendToQueue(q, new Buffer('Hello World!'));
//     console.log(" [x] Sent 'Hello World!'");
//   });
//   setTimeout(function() { conn.close(); process.exit(0) }, 500);
// });