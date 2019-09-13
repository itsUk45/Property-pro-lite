import mocha from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';


//console.log(app)
// const mocha = require('mocha')h
// const chai = require('chai');
chai.use(chaiHttp);
const {expect} = chai;
//user test cases
describe('USER TEST /api/v1/auth', () => {

	describe('POST api/v1/auth/signup ', () => {

	//describe for empty fields
	describe('Empty fields', () => {
		it('Email is empty', (done) =>{
			chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
			  'data': {
			  	"email": "",
			      "firstName": "kose",
			      "lastName": "uk45",
			      "phoneNumber": "+128228",
			      "address": "KG 101 Kigali",
			      "isAgent":"YES",
			      "gender": "Male",
			      "password" :"12100"
			  }
			})
			.end( (err, res) => {
			  expect(res).to.have.status(400);
			  done()

			})
		});




		it('First name is empty', (done) =>{
			chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
			  'data': {
			  	"email": "kose@yahoo.com",
			      "firstName": "",
			      "lastName": "uk45",
			      "phoneNumber": "+128228",
			      "address": "KG 101 Kigali",
			      "isAgent":"YES",
			      "gender": "Male",
			      "password" :"12100"
			  }
			})
			.end( (err, res) => {
			  expect(res).to.have.status(400);
			  done()

			})
		});

		it('Last name is empty', (done) => {
		  chai 
		    .request(app)
		    .post('/api/v1/auth/signup')
		    .send({
			  'data': {
			  	"email": "kose@yahoo.com",
			      "firstName": "",
			      "lastName": "",
			      "phoneNumber": "+128228",
			      "address": "KG 101 Kigali",
			      "isAgent":"YES",
			      "gender": "Male",
			      "password" :"12100"
			  }
			})
			.end( (err, res) => {
				expect(res).to.have.status(400)
				done();
			})
		});

		it('Phone number is empty', (done) =>{
			chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
			  'data': {
			  	"email": "kose@yahoo.com",
			      "firstName": "",
			      "lastName": "uk45",
			      "phoneNumber": "",
			      "address": "KG 101 Kigali",
			      "isAgent":"YES",
			      "gender": "Male",
			      "password" :"12100"
			  }
			})
			.end( (err, res) =>{
				expect(res).to.have.status(400)
				done()
			})
		});

		it('Address field is empty', (done) =>{
			chai 
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
			  'data': {
			  	"email": "kose@yahoo.com",
			      "firstName": "kose",
			      "lastName": "uk45",
			      "phoneNumber": "+128228",
			      "address": "",
			      "isAgent":"YES",
			      "gender": "Male",
			      "password" :"12100"
			  }
			})
			.end( (err, res) =>{
				expect(res).to.have.status(400);
				done()
			})
		});

		it('Password field is empty', (done) => {
			chai
			.request(app)
			.post('/api/v1/auth/signup')
			.send({
			  'data': {
			  	"email": "kose@yahoo.com",
			      "firstName": "",
			      "lastName": "uk45",
			      "phoneNumber": "+128228",
			      "address": "KG 101 Kigali",
			      "isAgent":"YES",
			      "gender": "Male",
			      "password" :""
			  }
			})
			.end( (err, res) => {
				expect(res).to.have.status(400);
				done();
			})
		});
	})

	//when invalid email or password lenth is less than 5
	it('Invalid email provided', (done) => {
		chai 
		.request(app)
		.post('/api/v1/auth/signup')
		.send({
			'data': {
			  'email': 'kose.gmail.com',
			  "firstName": "kose",
		      "lastName": "uk45",
		      "phoneNumber": "+128228",
		      "address": "KG 101 Kigali",
		      "isAgent":"YES",
		      "gender": "Male",
		      "password" :"12100"
			}
		})
		.end( (err, res) => {
			expect(res).to.have.status(400);
			expect(res.body.error).to.equal('"email" must be a valid email'); //the error msg comes from joi validation
			done();
		})
	});

		//when complete data is provided ie signup success use case
	it('signup sucessful! user created status is 201 ', (done) => {
		chai
		.request(app)
		.post('/api/v1/auth/signup')
		.send({
			"data": {
			  "email": "kose@yahoo.com",
			  "firstName": "kose",
		      "lastName": "uk45",
		      "phoneNumber": "+128228",
		      "address": "KG 101 Kigali",
		      "isAgent":"YES",
		      "gender": "Male",
		      "password" :"12100"
		    }
           })
		.end( (err, res) => {
			expect(res).to.have.status(201);
			done();
		} )
	});

	//user already exist test using email as a criteria for checking existance
	it('Should not creaated user if given email has been used', (done) =>{
		chai 
		.request(app)
		.post('/api/v1/auth/signup')
		.send({
			'data': {
			  'email': 'kose@yahoo.com',
			  "firstName": "kose",
		      "lastName": "uk45",
		      "phoneNumber": "+128228",
		      "address": "KG 101 Kigali",
		      "isAgent":"YES",
		      "gender": "Male",
		      "password" :"12100"
			}
		})
		.end( (err, res) => {
			expect(res).to.have.status(409);
			done();
		})

	});
	
});

//signin test
describe('POST /api/v1/auth/signin', (done) => {

	//empty field describe
	describe('Empty fields', () => {
		it('Should not signin if email  field is empty', (done) => {
  	chai
  	.request(app)
  	.post('/api/v1/auth/signin')
  	.send({
  	  'data':{
  	  	'email':'',
  	  	'Password': 12345
  	  }
  	})
  	.end( (err, res) =>{
  	  expect(res).to.have.status(400);
  	  done();
  	})
  });

   it('Should not signin if Password field is empty', (done) => {
  	chai
  	.request(app)
  	.post('/api/v1/auth/signin')
  	.send({
  	  'data':{
  	  	'email':'kose@yahoo.com',
  	  	'password': ''
  	  }
  	})
  	.end( (err, res) =>{
  	  expect(res).to.have.status(400);
  	  done();
  	})
  });

	});

	//Wrong credentials describe
	describe('Wrong credentials', () => {
		it('Should not signin when user provide wrong email', (done) =>{
	   	chai 
	   	.request(app)
	   	.post('/api/v1/auth/signin')
	   	.send({
	   	  'data':{
	   	  	'email': 'usernotfound@gmail.com',
	   	  	'password': '12100'
	   	  }
	   	})
	   	.end( (err, res) =>{
	   	  expect(res).to.have.status(404);
	   	  done();
   	  })
    });


		it('Should not signin when user provide wrong password', (done) => {
				chai
				.request(app)
				.post('/api/v1/auth/signin')
				.send({
					'data':{
						'email': 'kose@yahoo.com',
						'password': '121009'
					}
				})
				.end( (err, res) => {
					expect(res).to.have.status(400);
					done();
				})
	  });

	});
	
	//Success it, because its only one, no need for describe block
	it('Should signin when correct credentials provided', (done) => {
	chai
	.request(app)
	.post('/api/v1/auth/signin')
	.send({
		'data':{
			'email': 'kose@yahoo.com',
			'password': '12100'
		}
	})
	.end( (err, res) => {
		expect(res).to.have.status(200);
		done();
	})
});

});


 

// BLOCKER 08/09/2019, cannot test the case when there's no 
//data in the user array. because USER array isn't empty due to signup test case pushing new data
//another it() goes here










  // // BLOCKERS 08/09/2019 on this test, cant send headers error
  //  it('Should signin user when correct email and password are provided', (done) => {
  //  	chai 
  //  	.request(app)
  //  	.post('/api/v1/auth/signin')
  //  	.send({
  //  	  'data':{
  //  	  	'email': 'kose0@yahoo.com',
  //  	  	'password': '12345'
  //  	  }
  //  	})
  //  	.end( (err, res) => {
  //  		expect(res).to.have.status(200);
  //  	})
  //  });

  //RESOLVED see solution on user.js controller signin function issues with the forEach Loop
});