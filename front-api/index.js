const express = require('express');
const Router = require('express-promise-router');
const bodyParser = require('body-parser');

const app = express();
const router = new Router();
app.use('/', router);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

router.get("/ping", (req, res) => {
    res.send({
        message: "Ping"
    });
});

router.post("/api/message", (req, res) => {
    const { message } = req.body;
    res.send({ message });
});

(async () => {
    app.listen(PORT, () => {
        console.log("Started at http://localhost:%d", PORT);
    });
})();
