const nodemailer = require("nodemailer");
const message = "Testing nodemailer";

(async () => {
    const transporter = await buildTransporter();
    await transporter.sendMail(buildEmailPayload());
})();


async function buildTransporter() {
    return nodemailer.createTransport({
        host: 'maildev', // service name in docker-compose.yml
        port: 25,
        ignoreTLS: true
    });
}

function buildEmailPayload() {
    return {
        from: '"Felix workstation" <foo@example.com>',
        to: "felix@wattez.fr",
        subject: message,
        text: message,
        html: `<b>${message}</b>`
    }
}