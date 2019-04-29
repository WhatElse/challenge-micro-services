const WEBHOOK = 'https://hooks.slack.com/services/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';
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
        uri: WEBHOOK,
        body: payload,
        json: true
    };
    return await rp(options);
};