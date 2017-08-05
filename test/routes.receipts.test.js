process.env.NODE_ENV = 'test';

const knex = require('../db/db');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../app');

describe('routes : receipts', () => {
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

  describe('GET /receipts/users/:id', () => {
    it('should return all receipts for user id', (done) => {
      chai.request(server).get('/receipts/users/1').end((err, res) => {
        res.status.should.equal(200);
        console.log(res.text);
        done();
      });
    });
  });

  describe('POST /receipts/users/:id', () => {
    it('should respond with 200 and return a json object containing all list receipts for new receipt', (done) => {
      chai.request(server).post('/receipts/users/1').send({
        location_id: '1',
        date: '2017-08-04',
        listItems: [
          {
            name: 'mango',
            price: 3.01,
            tag_id: 7,
          }, {
            name: 'chocolate',
            price: 0.99,
            tag_id: 1,
          },
        ],
      }).end((err, res) => {
        res.status.should.equal(200);
        console.log(res.text);
        done();
      });
    });
  });

  describe('GET /receipts/:id', () => {
    it('should respond with 200 and return all list items for receipt', (done) => {
      chai.request(server).get('/receipts/2').end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });

  describe('PATCH /receipts/:id', () => {
    it('should respond with 200 and return updated receipt data in json', (done) => {
      chai.request(server).patch('/receipts/3').send({ date: '2017-06-02' }).end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });

  describe('DELETE /receipts/:id', () => {
    it('should respond with 200 and return deleted receipt data', (done) => {
      chai.request(server).delete('/receipts/1').end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });

  describe('GET /receipts/:id with id that does not exist', () => {
    it('should respond with 400', (done) => {
      chai.request(server).get('/receipts/10').end((err, res) => {
        res.status.should.equal(400);
        done();
      });
    });
  });
});
