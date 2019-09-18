import {pool} from './configDB';

/*
.........................................
IMPLEMENTATION USING POSTGRESQL DATABASE
.........................................
*/

// create propert table if not exist
const propertySchma =` CREATE TABLE  IF NOT EXISTS properties(
id VARCHAR(200) PRIMARY KEY NOT NULL,
status VARCHAR(20) DEFAULT 'Available', 
type VARCHAR(30) NOT NULL,
state VARCHAR(30) NOT NULL,
city VARCHAR(30) NOT NULL,
address VARCHAR(50) NOT NULL,
price FLOAT(20) NOT NULL,
created_on TIMESTAMPTZ NOT NULL,
image_url VARCHAR(100) NOT NULL,
owner_email VARCHAR(30) NOT NULL
)
`; //BLOCER, INSERT DEFAULT VALUE when not provided by user ie status

// BLOCKER make owner email a secondary key to email at the users table . 16.09.19

pool.query(propertySchma, (error, result) => {
	if(error) return console.log(`Cannot create table properties, ${error}`);
	//do nothing here when table is created, we can proceed to DML operations on the table 
});


// class to hold the operaions methods on property
class Property{
	constructor(id, status, type, state, city, address, price, created_on, image_url, owner_email){
		this.id = id;
		this.status =status;
		this.type = type;
		this.state = state;
		this.city = city;
		this.address = address;
		this.price = price;
		this.created_on = created_on;
		this.image_url = image_url;
		this.owner_email = owner_email;

	}

	//create property
	createProperty(){
		const queryQ = `INSERT INTO properties(id, status, type, state, city, address, price, created_on, image_url, owner_email )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		`;
		const valuesQ = [this.id, this.status, this.type, this.state, this.city, this.address, this.price,this.created_on, this.image_url, this.owner_email];

		return pool.query(queryQ, valuesQ);
	}

	//update property for the selected columns, consider type, and price to be updated
	updateProperty(type, price, propertyId){
		const updateQuery = 'UPDATE properties SET type =$1, price=$2 WHERE id=$3';
		const updateValue = [type, price, propertyId];
		return pool.query(updateQuery, updateValue);
	}
  //mark property as sold
  changeToSold(status, propertyId){
  	const markQuery = 'UPDATE properties SET status=$1 WHERE id =$2';
  	const queryValues = [status, propertyId];
  	return pool.query(markQuery, idValue);
  }
  // delete a property
  deleteProperty(id){
  	const deleteQuery = 'DELETE FROM properties WHERE id=$1';
  	const idValue = [id];
  	return pool.query(deleteQuery, idValue);
  }
	// find property by id
	getPropertyDetails(id){
		const idQuery = 0;
		return pool.query('SELECT * FROM properties WHERE id=$1',[id]);
	}
	// find property by email
	getPropertyByEmail(email){
		const emailQuery = 0;
		return pool.query('SELECT * FROM properties WHERE owner_email=$1',[email]);
	}
	// find property by type
	getPropertyByType(type){
		const typeQuery = 0;
		return pool.query('SELECT * FROM properties WHERE type=$1',[type]);
	}
	// find all property
	getAllProperty(){
		const getAllQuery = 'SELECT * FROM properties';
		return pool.query(getAllQuery);
	}

}



export {Property};



























/*
...................................
IMPLEMENTATION USING DATA STRUCTURE
...................................

// Property model
const propertyStorage = [];
class Property{
	constructor(id, status, type, state, city, address, price,created_on, image_url, ownerEmail){
		this.id = id;
		this.status = status;
		this.type =type;
		this.state =state;
		this.city = city;
		this.address = address;
		this.price = price;
		this.created_on = created_on;
		this.image_url = image_url;
		this.ownerEmail = ownerEmail;
	}

	createProperty(){
		const newProperty = {
			"id": this.id,
			"status": this.status,
			"type": this.type,
			"state": this.state,
			"city": this.city,
			"address": this.address,
			"price": this.price,
			"created_on": this.created_on,
			"image_url": this.image_url,
			"ownerEmail": this.ownerEmail
		};
		propertyStorage.push(newProperty);
		return propertyStorage[propertyStorage.length-1]; // Get the last property, ie recently added property
	}
}

export {propertyStorage, Property};
*/