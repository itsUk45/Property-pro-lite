import {pool} from './configDB'

// create users table if not exist 
const userSchema = `CREATE TABLE IF NOT EXISTS
users (
  id VARCHAR PRIMARY KEY NOT NULL,
  email VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  phone_number VARCHAR(20) ,
  address VARCHAR(30),
  is_agent BOOLEAN,
  gender VARCHAR(10),
  password VARCHAR(30)
	)`;

	pool.query(userSchema, (err, results) => {
		if(err) return console.log(`cannot create table ${err}`);
		//do nothing here, we proceed to DML queries
	})


// class to hold db operations on user
class User{
	constructor(id, email, first_name, last_name, phone_number, address, is_agent, gender, password){
		this.id = id;
		this.email= email;
		this.first_name =first_name;
		this.last_name = last_name;
		this.phone_number = phone_number;
		this.address = address;
		this.is_agent = is_agent;
		this.gender = gender;
		this.password = password;
	}
	
  // create user  by inserting dynamic data into database
   createUser(){
   	//syntax INSERT INTO TABLE tablename(column1, columnn) VALUES($1, $2), [column1value, cololumnvalue]
  	const insertQuery = `INSERT INTO users (id, email, first_name, last_name, phone_number, address, is_agent, gender, password)
  	                     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`;  //$1 etc are placeholder to avoid SQL Injection
  	const insertValues = [this.id, this.email, this.first_name, this.last_name, this.phone_number, this.address, this.is_agent,
  	                       this.gender, this.password]; //placeholder values inserted from here
  	return pool.query(insertQuery, insertValues);
  }


  // method to find user by email
  findUserByEmail(email){
  //returns a promise , so we need to await it during call to this method
  return pool.query('SELECT * FROM users WHERE email=$1',[email])
  }

}

export {User}







/*
 .........................................................
 IMPLEMENTATION USING DATA STRUCTURE INSTEAD OF DATABASE
 .........................................................
// Users =[];
const USERS = []; //store users that have signup
class Users{ 
	constructor(id,email,first_name, last_name, phone_number, address, is_agent, gender, password){
		this.id = id;
		this.email = email;
		this.first_name = first_name;
		this.last_name = last_name;
		this.phone_number = phone_number;
		this.address = address;
		this.is_agent = is_agent;
		this.gender = gender
		this.password = password;
	}
 
	// create user and the data
	createUser(){
		    // add new user to the USERS array
			USERS.push({
				'id': this.id,
				"email": this.email,
				"first_name":this.first_name,
				"last_name": this.last_name,
				"phone_number": this.phone_number,
				"address": this.address,
				"is_agent": this.is_agent,
				"gender": this.gender,
				"password": this.password
			});
        //returns only the newly created user ie at the last index
		return USERS[USERS.length-1]; 
	}
}


export {Users,USERS};
*/