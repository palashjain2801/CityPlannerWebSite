let assert = require('assert');
let mongoose = require('mongoose');
let index = require('../index');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:3000';

let idSearch;


describe('CORRECT TEST', function () {
    
    describe('/POST search', function() {
        it('should add a search', (done) => {
            newSearch = {
                city: 'Chicago',
                numDays: 2,
                numPlaces: 5
            }

            chai.request(url)
            .post('/api/searches')
            .send(newSearch)
            .end((err,res) => {
                //console.log(res.body);
                idSearch = res.body._id;
                res.should.have.status(200);
                done();
            });
        });
    });

    describe('/GET searches', function() {
        it('should return all searches', (done) => {
            chai.request(url)
            .get('/api/searches')
            .end((err,res) => {
                //console.log(res.body);
                res.should.have.status(200);
                done();
            });
        }); 
    });

    
    });
        

    