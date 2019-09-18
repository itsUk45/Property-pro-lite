import mocha from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import fs from 'fs';
import { User } from '../models/Users';
import { propertyStorage, Property } from '../models/Property';
import {GenerateTokens} from '../helpers/jwtAuthHelper';

//initialize chai middleware
chai.use(chaiHttp);
const {expect} = chai; //destructure expect syntax from chai, similar to should

//test case begins here, general describe to cluster all test in it
describe('PROPERTY TEST api/v1/property', () => {
	// before anything is done, please signup a user
	let token, newUser, newP;
	before( async() => {
    newUser  = new  User(1,'kose11@gmail.com','kose', 'uk45', 12345, 'KG101', 'yes', 'M', 12345);
    await newUser.createUser();
    token = GenerateTokens('kose11@gmail.com');

    newP =new Property(1, 'Available', 'Room', 'Central', 'KK', 'KK Central', 121,'12/09/19', 'image_url', 'kose11@gmail.com');
    newP.createProperty();
	});


	 it('POST api/v1/property Should create property when all fields are not empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/property')
      .set('x-auth-token', token)
      .type('form')
      .attach('image', '/home/uk45/Documents/Andela/Plearning/Property-pro-lite/api/v1/uploads/2019-09-07T18:37:11.223Zblue2.jpg')
      .field('address', 'kk 54 ')
      .field('state', 'central')
      .field('city', 'kk')
      .field('status', 'Sold')
      .field('price', 120)
      .field('type', 'Camp')
      .field('token', token)
      .end((err, res) => {
        expect(res).to.have.status(201);
        //expect(res.body.status).to.be.equal(201);
        done();
      });
  });

	// update property test
	describe('PATCH api/v1/property/:propertyId', () => {
		it('PATCH api/v1/property/:propertyId should not update when no permission right', (done) => {
			chai 
			.request(app)
			.patch('/api/v1/property/1')
			.set('x-auth-token', token)
			.send({
				data:{
					address: 'KK South LAN'
				}
			})
			.end( (err, res) => {
				expect(res).to.have.status(401);
				done();
			})

		});
		
	});

	// Change status to sold property test
	describe('PATCH api/v1/property/:propertyId/sold should not update status to sold when no proper permission', () => {
		it('PATCH api/v1/property/:propertyId/sold', (done) =>{
			chai 
			.request(app)
			.patch('/api/v1/property/2/sold')
			.set('x-auth-token', token)
			.end( (err, res) =>{
				expect(res).to.have.status(401);
				done();
			})
		});
		
	});

	// delete  property test
	describe('DELETE api/v1/property/:propertyId', () => {
		it('DELEET api/v1/property/:propertyId should not delete property that user does not own', (done) => {
			chai 
			.request(app)
			.delete('/api/v1/property/:propertyId')
			.set('x-auth-token', token)
			.end( (err, res) => {
				expect(res).to.have.status(401);
				done();
			})
		});
		
	});

	// Get all property test
	describe('GET api/v1/property/', () => {
		it('GET /api/v1/property Should get all property', (done) => {
			chai
			.request(app)
			.get('/api/v1/property')
			.end( (err, res) => {
				expect(res).to.have.status(200);
				done();
			})
		});
	});

	// Get by type property test
	describe('GET api/v1/property/type', () => {
		it('GET api/v1/property/type should get all property of the same given type', (done) =>{
			chai 
			.request(app)
			.get('/api/v1/property/type/?type=Camp')
			.end( (err, res) => {
				expect(res).to.have.status(200);
				done();
			})
		} );
		
	});

	// Get details of a property test
	describe('GET api/v1/property/:propertyId should not get property when property id is not found', () => {
		let property = 
		it('GET api/v1/property/:propertyId', (done) =>{
			chai 
			.request(app)
			.get(`/api/v1/property/2`)
			.end( (err, res) => {
				expect(res).to.have.status(404);
				done();
			})
		});
		
	});

});