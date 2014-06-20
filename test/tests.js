var knexLogger = require('..');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('knex logger', function() {
  before(function() {
    this.req = {};
    this.res = {};
    this.knex = {};
    sinon.stub(console, 'log', function() {});
  });

  after(function() {
    console.log.restore();
  });

  it('does not log when created', function() {
    knexLogger(this.knex);
    expect(console.log).to.not.have.been.called;
  });
});
