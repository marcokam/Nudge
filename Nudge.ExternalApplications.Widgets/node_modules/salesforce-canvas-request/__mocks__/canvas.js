const crypto = require('crypto');

module.exports = {
  createMockCanvasRequest
};

function createMockCanvasRequest(secret, sessionMock) {
  let envelope = JSON.stringify(sessionMock);
  let buffer = new Buffer(envelope);
  let encodedJSON = buffer.toString('base64');
  let signature = crypto
    .createHmac('sha256', secret)
    .update(encodedJSON)
    .digest('base64');
  return `${signature}.${encodedJSON}`;
}
