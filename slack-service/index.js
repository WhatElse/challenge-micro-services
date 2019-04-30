const rp = require("request-promise");

const { Kafka } = require('kafkajs');
const kafka = new Kafka({
    clientId: 'consumer-slack',
    brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'consumers' });

(async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'aleatoire' });
    await consumer.subscribe({ topic: 'general' });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            await sendMessage(buildPayload(topic, message.value.toString()))
        }
    })
})();

function buildPayload(topic, message) {
    return {
        channel: topic,
        username: "challenge",
        text: message,
        icon_emoji: "ghost"
    };
};

async function sendMessage(payload) {
    const options = {
        method: 'POST',
        uri: process.env.WEBHOOK,
        body: payload,
        json: true
    };
    return await rp(options);
};