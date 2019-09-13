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