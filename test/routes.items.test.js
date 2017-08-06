process.env.NODE_ENV = 'test';

const knex = require('../db/db');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../app');

describe('routes : items', () => {
  beforeEach((done) => {
    knex.migrate.latest().then(() => {
      knex.seed.run().then(() => {
        done();
      });
    }).catch(err => done(err));
  });

  afterEach((done) => {
    knex.migrate.rollback().then(() => {
      done();
    }).catch((err) => {
      done(err);
    });
  });

  describe('GET /receipts/:receipt_id/items', () => {
    it('should return all items for receipt id', (done) => {
      chai.request(server).get('/receipts/2/items').end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });

  describe('POST /receipts/:receipt_id/items', () => {
    it('should respond with 200 and return a new item details', (done) => {
      chai.request(server).post('/receipts/2/items').send({ name: 'kale', price: '3.01', tag_id: '2' }).end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });

  describe('GET /receipts/:receipt_id/items/:id', () => {
    it('should respond with 200 and return single list item', (done) => {
      chai.request(server).get('/receipts/3/items/7').end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });

  describe('PATCH /receipts/:receipt_id/items/:id', () => {
    it('should respond with 200 and return updated data in json', (done) => {
      chai.request(server).patch('/receipts/3/items/7').send({ name: 'almond milk' }).end((err, res) => {
        res.status.should.equal(200);
        console.log(res.text);
        done();
      });
    });
  });

  describe('DELETE /receipts/:receipt_id/items/:id', () => {
    it('should respond with 200 and return deleted receipt data', (done) => {
      chai.request(server).delete('/receipts/3/items/7').end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });
});
