import {pool} from './configDB';



/*
.........................................
IMPLEMENTATION USING POSTGRESQL DATABASE
.........................................
*/

// create propert table if not exist
const propertySchma =` CREATE TABLE properties(
id VARCHAR(200) PRIMARY KEY NOT NULL,
status VARCHAR(20) NOT NULL DEFAULT Available,
type VARCHAR(30) NOT NULL,
state VARCHAR(30) NOT NULL,
city VARCHAR(30) NOT NULL,
price FLOAT(20) NOT NULL,
created_on TIMESTAMPTZ NOT NULL,
image_url VARCHAR(100) NOT NULL,
owner_email VARCHAR(30) NOT NULL
)
`;

// BLOCKER make owner email a secondary key to email at the users table . 16.09.19

pool.query(propertySchma, (error, result) => {
	if(error) return console.log(`Cannot create table, ${error}`);
	//do nothing here when table is created, we can proceed to DML operations on the table 
});


// class to hold the operaions methods on property
class Property{
	constructor(id, status, type, state, city, price, created_on, image_url, owner_email){
		this.id = id;
		this.status =status;
		this.type = type;
		this.state = state;
		this.city = city;
		this.price = price;
		this.created_on = created_on;
		this.image_url = image_url;
		this.owner_email = ownerEmail;

	}

	//create property
	createProperty(){
		const queryQ = `INSERT INTO properties(id, status, type, state, city, price, created_on, image_url, owner_email )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
		`;
		const valuesQ = `this.id, this.status, this.type, this.state, this.city, this. price
    this.created_on, this.image_url, this.owner_email
		`;

		return pool.query(queryQ, valuesQ);
	}
  
	// find property by id
	// find property by email
	// find property by type
	// find all property

}































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