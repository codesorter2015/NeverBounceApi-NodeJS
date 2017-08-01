const chai = require('chai'),
    chaiAsPromised = require("chai-as-promised"),
    nock = require('nock'),
    _Errors = require('../src/Errors'),
    NeverBounce = require('../src/NeverBounce');

chai.use(chaiAsPromised);
chai.should();

// Setup node request mock
const scope = nock('https://api.neverbounce.com')
    .get('/v4/account/info');

// Create NeverBounce object
const nb = new NeverBounce();

describe('Account', function () {
    describe('info', function () {
        it('should return a object during a good response', function () {
            scope.reply(200, {
                "status": "success",
                "result": "valid",
                "flags": [
                    "has_dns",
                    "has_dns_mx"
                ],
                "suggested_correction": "",
                "retry_token": "",
                "execution_time": 499
            });

            return nb.account.info().should.be.fulfilled
                .then(resp => resp.should.be.a('Object'));
        });

        it('should reject the promise and provide an error', function () {
            scope.reply(200, {
                "status": "general_failure",
                "message": "An error occurred",
                "execution_time": 499
            });

            return nb.account.info().should.be.rejected
                .then(err => err.should.contain({'type': _Errors.GeneralError}));
        });
    });
});