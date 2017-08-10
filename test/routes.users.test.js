process.env.NODE_ENV = 'test';

const knex = require('../db/db');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../app');

describe('routes : users', () => {
  beforeEach((done) => {
    knex.migrate.latest().then(() => {
      chai.request(server).post('/users/signup').send({first: 'Amanda', last: 'Allen', email: 'amanda@dev.am', password: '123456'}).then(() => {
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

  describe('POST /users/signup', () => {
    it('should create user account and respond with 200', (done) => {
      chai.request(server).post('/users/signup').send({first: 'Amanda', last: 'Allen', email: 'amanda@amanda.com', password: 'hellothere'}).end((err, res) => {
        res.status.should.equal(200);
        console.log(res.text)
        done();
      });
    });
  });

  describe('POST /users/signup existing email', () => {
    it('should respond with 400.', (done) => {
      chai.request(server).post('/users/signup').send({first: 'Bob', last: 'Bob', email: 'amanda@dev.am', password: 'wellhello'}).end((err, res) => {
        res.status.should.equal(400);
        done();
      });
    });
  });

  describe('POST /users/signup password fewer than 6 characters', () => {
    it('should respond with 400', (done) => {
      chai.request(server).post('/users/signup').send({first: 'Amanda', last: 'Allen', email: 'amanda@dev.am', password: 'hi'}).end((err, res) => {
        res.status.should.equal(400);
        done();
      });
    });
  });

  describe('POST /users login with incorrect password', () => {
    it('should respond with 400', (done) => {
      chai.request(server).post('/users').send({email: 'amanda@dev.am', password: 'ohnothisiswrong'}).end((err, res) => {
        res.status.should.equal(400);
        done();
      });
    });
  });

  describe('POST /users', () => {
    it('should sign user in and respond with 200', (done) => {
      chai.request(server).post('/users').send({email: 'amanda@dev.am', password: '123456'}).end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
  });
});
