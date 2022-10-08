const { Schema, model} = require('mongoose')
let registrantSchema = new Schema({
	first_name: {
		type: String,
		required: [true, 'first name is required'],
	},
	last_name: {
		type: String,
		required: [true, 'last name is required'],
	},
	email_address: { 
		type: String, 
		required: [true, 'No email address provided']
	},
	phone:{
		type: String,
	},
	department: {
		type: Schema.Types.ObjectId, ref:"Department", 
		required: [true, 'A department must be provided for this registration to be valid']}

})

registrantSchema.methods.checkDupe = function () {
	return new Promise(async (resolve, reject) => {
		const dupe = await model('Registrant')
			.find({ email_address: this.email_address, department: this.department })
			.catch((err) => {
				reject(err)
			})
		resolve(dupe.length > 0)
	})
}

const registrantModel = model('Registrant', registrantSchema)
module.exports = registrantModel
