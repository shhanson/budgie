process.env.NODE_ENV = 'test';

const knex = require('../db/db');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../app');

describe('routes : locations', () => {
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

  describe('GET /locations', () => {
    it('should return all locations', (done) => {
      chai.request(server).get('/locations').end((err, res) => {
        res.status.should.equal(200);
        console.log(res.text);
        done();
      });
    });
  });

  describe('POST /locations', () => {
    it('should respond with 200 and return a new item details', (done) => {
      chai.request(server).post('/locations').send({ location: 'Fresas' }).end((err, res) => {
        res.status.should.equal(200);
        console.log(res.text);
        done();
      });
    });
  });

  describe('GET /location/:id', () => {
    it('should respond with 200 and return single location', (done) => {
      chai.request(server).get('/locations/3').end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });

  describe('PATCH /locations/:id', () => {
    it('should respond with 200 and return updated data in json', (done) => {
      chai.request(server).patch('/locations/1').send({ location: 'Trader Joe\'s' }).end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });

  describe('DELETE /locations/:id', () => {
    it('should respond with 200 and return deleted receipt data', (done) => {
      chai.request(server).delete('/locations/2').end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });
});