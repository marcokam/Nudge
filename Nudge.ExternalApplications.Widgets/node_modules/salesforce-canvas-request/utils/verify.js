const crypto = require('crypto');

/**
 * Code adapted from @enreeco
 * https://github.com/enreeco/CanvasApp-NodeJS-Base/blob/master/sf-tools/index.js
 * @param {String} signedRequest - The signed_request field taken from req.body when Canvas posts to Node.js
 * @param {String} secret - Your Canvas app's defined Consumer Secret
 */
module.exports = (signedRequest, secret) => {
  if (!signedRequest || signedRequest.indexOf('.') <= 0)
    throw new Error(`This is not a valid signed request`);

  let signedRequestParts = signedRequest.split('.', 2);
  let signature = signedRequestParts[0];
  let encodedJSON = signedRequestParts[1];

  // Deserialize the json body
  let decodedJSON = new Buffer(encodedJSON, 'base64').toString('utf8');
  let output;
  let algorithm;
  let canvasRequest = null;

  try {
    output = JSON.parse(decodedJSON);
    algorithm = output.algorithm;
  } catch (e) {
    throw 'Error deserializing JSON: ' + e;
  }

  if (!algorithm || algorithm.toUpperCase() !== 'HMACSHA256') {
    throw new Error(`Invalid algorithm ${algorithm} detected`);
  }

  expectedSig = crypto
    .createHmac('sha256', secret)
    .update(signedRequestParts[1])
    .digest('base64');
  if (signature !== expectedSig) {
    throw new Error('Bad signed JSON Signature!');
  }

  return output;
};
