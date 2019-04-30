const nodemailer = require("nodemailer");
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
            const transporter = await buildTransporter();
            await transporter.sendMail(buildEmailPayload(message.value.toString()));
        }
    })

})();


async function buildTransporter() {
    return nodemailer.createTransport({
        host: 'maildev', // service name in docker-compose.yml
        port: 25,
        ignoreTLS: true
    });
}

function buildEmailPayload(message) {
    return {
        from: '"Felix workstation" <foo@example.com>',
        to: "felix@wattez.fr",
        subject: message,
        text: message,
        html: `<b>${message}</b>`
    }
}