const rp = require("request-promise");

const { Kafka } = require('kafkajs');
const kafka = new Kafka({
    clientId: process.env.CLIENT_ID,
    brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });

(async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.TOPIC_1 });
    await consumer.subscribe({ topic: process.env.TOPIC_2 });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            await sendMessage(buildPayload(topic, message.value.toString()))
        }
    })
})();

function buildPayload(topic, message) {
    return {
        channel: topic,
        username: process.env.USERNAME,
        text: message,
        icon_emoji: process.env.EMOJI
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