const express = require('express');
const Router = require('express-promise-router');
const bodyParser = require('body-parser');

const app = express();
const router = new Router();
const PORT = 3000;

const { Kafka, logLevel } = require('kafkajs');
const kafka = new Kafka({
    clientId: 'producer',
    brokers: ['kafka:9092']
});

kafka.logger().setLogLevel(logLevel.DEBUG);
const producer = kafka.producer();


app.use('/', router);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/ping", (req, res) => {
    res.send({
        message: "Ping"
    });
});

router.post("/api/message", async (req, res) => {
    const { message, topic } = req.body;
    await producer.connect();
    await producer.send({
        topic: topic,
        messages: [
            { value: message },
        ],
    })
    res.send({ message, topic });
});

(async () => {
    app.listen(PORT, () => {
        console.log("Started at http://localhost:%d", PORT);
    });
})();
