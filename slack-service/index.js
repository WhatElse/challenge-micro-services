const rp = require("request-promise");

(async () => {
    await sendMessage(buildPayload("Testing if webhook works ..."))
})();

function buildPayload(message) {
    return {
        channel: "aleatoire",
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