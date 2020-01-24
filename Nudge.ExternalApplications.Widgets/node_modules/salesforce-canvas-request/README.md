# salesforce-canvas-request

A utility library to support external applications run as Salesforce Canvas using a Node.js backend

## Prerequisites

* [Node.js](https://nodejs.org/en/) >= 8.9.0

## Installation

`yarn install salesforce-canvas-request` or `npm install salesforce-canvas-request`

## Utilities

### verify(signed_request: String, secret: String) : Object

#### Parameters

* **signed_request**: The full signed request as passed to Canvas to your web API
* **secret**: Your Canvas App's Consumer Secret defined in Salesforce

#### Returns

* The decoded JSON provided by Canvas

#### Example

```javascript
// Assumes you have two environment variables defined: SALESFORCE_APP_CONSUMER_KEY and PORT
const { createServer } = require('http');
const express = require('express');
const app = express();
const { verify } = require('salesforce-canvas-request');

app.post('/canvas', (req, res) => {
  let decoded = verify(req.body.signed_request, process.env.SALESFORCE_APP_CONSUMER_KEY);
  // TODO: At this point, you have a JSON that identifies a user. Utilize your own internal auth to cross reference or re-route to a web app endpoint to launch something
  return res.json(decoded);
});

const server = createServer();
server.on('request', app);
server.listen(process.env.PORT, err => {
  if (err) throw err;
  winston.info(`> Ready on http://localhost:${port}`);
});

```

## License

MIT


