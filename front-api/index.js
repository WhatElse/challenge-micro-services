const express = require('express');
const Router = require('express-promise-router');
const bodyParser = require('body-parser');

const PORT = 3000;
const app = express();
const router = new Router();
app.use('/', router);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const acks = -1;
const transactionalId = "transactional-id";

const { Kafka, logLevel } = require('kafkajs');
const kafka = new Kafka({
    clientId: process.env.CLIENT_ID,
    brokers: ['kafka:9092'],
    maxInFlightRequests: 1
});

kafka.logger().setLogLevel(logLevel.DEBUG);
const producer = kafka.producer({ idempotent: true, transactionalId });

router.get("/ping", (req, res) => {
    res.send({
        message: "Ping"
    });
});

router.post("/api/message", async (req, res) => {
    const { message, topic } = req.body;
    const transaction = await producer.transaction();
    try {
        await transaction.send({
            acks,
            topic: topic,
            messages: [
                { value: message },
            ],
        });

        await transaction.commit();
        res.send({ message, topic });
    } catch (e) {
        await transaction.abort();
    }

});

(async () => {
    app.listen(PORT, () => {
        console.log("Started at http://localhost:%d", PORT);
    });
})();
