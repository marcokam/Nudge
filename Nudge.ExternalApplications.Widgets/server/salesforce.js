const { createServer } = require("https");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { verify } = require("salesforce-canvas-request");

const SALESFORCE_APP_CONSUMER_SECRET = "2205824682758079923";
const PORT = "8080";

app.engine('html', ejs.renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/output", express.static(path.resolve(__dirname, "../", "output")));

app.get("*", (req, res) => {
    return res.render("../index.html");
});
app.post("*", (req, res) => {
    let decoded;
    let finalRoute = "";
    if (req.body && req.body.signed_request) {
        decoded = verify(req.body.signed_request, SALESFORCE_APP_CONSUMER_SECRET);
        const parameters = decoded && decoded.context && decoded.context.environment && decoded.context.environment.parameters || {};
        const { route = "/" } = parameters;
        finalRoute = route;
        console.log('finalRoute', finalRoute);
    }
    // TODO: At this point, you have a JSON that identifies a user. Utilize your own internal auth to cross reference or re-route to a web app endpoint to launch something
    return res.redirect(finalRoute);
});



const nudgeConfigPath = process.env.NUDGE_CONFIG_PATH || "/ProgramData/Nudge";
const certPath = path.resolve(nudgeConfigPath, "ssl");
const server = createServer({
    key: fs.readFileSync(path.normalize(path.resolve(certPath, "wildcard.dev.nudge.ai.key"))),
    cert: fs.readFileSync(path.normalize(path.resolve(certPath, "wildcard.dev.nudge.ai.crt"))),
    ca: fs.readFileSync(path.normalize(path.resolve(certPath, "alphassl intermedidate.crt"))),
});

server.on("request", app);
server.listen(PORT, err => {
    if (err) throw err;
    console.info(`> Ready on https://app.dev.nudge.ai:${PORT}`);
});
