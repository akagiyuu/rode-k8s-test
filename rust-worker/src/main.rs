use std::env;

use anyhow::Result;
use futures::StreamExt;
use lapin::{
    Connection, ConnectionProperties,
    options::{BasicAckOptions, BasicConsumeOptions},
    types::FieldTable,
};

#[tokio::main]
async fn main() -> Result<()> {
    let addr = std::env::var("AMQP_ADDR").unwrap_or_else(|_| "amqp://127.0.0.1:5672/%2f".into());
    let conn = Connection::connect(&addr, ConnectionProperties::default()).await?;
    let id = env::var("ID").unwrap();
    let queue_name = env::var("QUEUE_NAME").unwrap();

    let channel = conn.create_channel().await?;

    let mut consumer = channel
        .basic_consume(
            &queue_name,
            &id,
            BasicConsumeOptions::default(),
            FieldTable::default(),
        )
        .await?;
    while let Some(delivery) = consumer.next().await {
        let delivery = delivery?;
        delivery.ack(BasicAckOptions::default()).await?;

        let data = String::from_utf8(delivery.data)?;
        println!("[{}] Received: {}", id, data);
    }

    Ok(())
}
