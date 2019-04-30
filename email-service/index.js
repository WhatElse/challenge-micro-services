const nodemailer = require("nodemailer");
const { Kafka } = require('kafkajs');
const kafka = new Kafka({
    clientId: 'consumer-email',
    brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'email' });

(async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'aleatoire' });
    await consumer.subscribe({ topic: 'general' });
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