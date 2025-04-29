import amqp from 'amqplib/callback_api'

amqp.connect('amqp://localhost:5672', function(err, conn) {
	if(err) throw err;

	conn.createChannel(function(err, channel) {
		if (err) throw err;
		
		var queue = process.env.QUEUE_NAME;
		var msg = new Date();
 
		channel.assertQueue(queue, {
			durable: false
		});

		channel.sendToQueue(queue, Buffer.from(msg));
		console.log(`[x] Sent ${msg}`)

		setTimeout(() => {
			conn.close();
			process.exit(0)
		}, 500)
	})
})
