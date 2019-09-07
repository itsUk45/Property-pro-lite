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