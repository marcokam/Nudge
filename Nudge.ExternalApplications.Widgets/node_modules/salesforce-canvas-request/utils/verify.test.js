const { createMockCanvasRequest } = require('../__mocks__/canvas');
const session_mock = require('../__mocks__/session_mock.json');
const verify = require('./verify');
const secret = 'shh_super_duper_secret'; // Comes from Consumer Key in SFDC

describe('verify', () => {
  it('should verify a properly signed session object', () => {
    let signedRequest = createMockCanvasRequest(secret, session_mock);
    let verifiedAndDecoded = verify(signedRequest, secret);
    expect(JSON.stringify(verifiedAndDecoded)).toBe(
      JSON.stringify(session_mock)
    );
  });

  it('should throw an error for an invalid JSON', () => {
    expect(() => {
      let signedRequest = createMockCanvasRequest(
        secret,
        'definitely *not* a JSON'
      );
      let verifiedAndDecoded = verify(signedRequest, secret);
    }).toThrow();
  });

  it('should throw an error on a bad algorithm', () => {
    let badAlgorithm = Object.assign({}, session_mock, {
      algorithm: 'we-are-not-thieves-we-swear'
    });

    expect(() => {
      let signedRequest = createMockCanvasRequest(secret, badAlgorithm);
      let verifiedAndDecoded = verify(signedRequest, secret);
    }).toThrow();
  });

  it('should throw an error on a missing algorithm', () => {
    let badAlgorithm = Object.assign({}, session_mock, {
      algorithm: null
    });

    expect(() => {
      let signedRequest = createMockCanvasRequest(secret, badAlgorithm);
      let verifiedAndDecoded = verify(signedRequest, secret);
    }).toThrow();
  });

  it('should throw an error on an invalid secret', () => {
    expect(() => {
      let signedRequest = createMockCanvasRequest(secret, session_mock);
      let verifiedAndDecoded = verify(
        signedRequest,
        'we-are-not-thieves-we-swear'
      );
    }).toThrow();
  });
});
