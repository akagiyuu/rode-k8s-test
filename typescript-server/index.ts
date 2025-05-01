import amqp from 'amqplib/callback_api'
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

amqp.connect(process.env.AMQP_ADDR, function(err, conn) {
	if(err) throw err;

	conn.createChannel(async function(err, channel) {
		if (err) throw err;
		
		var queue = process.env.QUEUE_NAME;
 
		channel.assertQueue(queue, {
			durable: false
		});
		
		while(true) {
			var msg = new Date();
			await delay(10000);
			channel.sendToQueue(queue, Buffer.from(msg));
			console.log(`[x] Sent ${msg}`)
		}

		setTimeout(() => {
			conn.close();
			process.exit(0)
		}, 500)
	})
})
