const { Schema, model} = require('mongoose');
const Department = require("./department.schema");
const { sendMail } = require("../utilities/sendMail");
const pdfMaker = require("../utilities/pdfMaker");
const mailer = require("../utilities/nodemailer");
const { randomNumberGenerator } = require("../utilities/randomNumbersGenerator");
const Verbage = require("../schema/verbage.schema");
const createPDF = require('../utilities/pdfGen');
const path = require("path");
let registrantSchema = new Schema({
	registration_number:{
		type: String,
	},
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
		required: [true, 'A department must be provided for this registration to be valid']
	},
	organization:{type: String, required: [true, 'A organization must be provided']},

})


// Sends email after registrant has be registered replace variable information depending on the registrant.
registrantSchema.pre("save", async function(next){
	let verbage = await Verbage.findOne({"name": "WELCOME_EMAIL"});
	mailer.sendMail(
		this.email_address, 
		"Welcome to Heart's 40th Anniversary", "Hello [REGISTRANT_NAME] , \n [WELCOME_VERBAGE]".replace("[WELCOME_VERBAGE]", 
		verbage.description).replace("[REGISTRANT_NAME]", 
		this.first_name+ " "+ this.last_name).replace("[REGISTRATION_NUMBER]", this.registration_number)
		);
})

registrantSchema.methods.assignRegNum = async function (){
	return await generateRegNumber("13", 8);
}

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

generateRegNumber = async (data, length)=>{
	let prefix = data.toString().slice(0, 3);
	let randNum = randomNumberGenerator(prefix, length);
	while(true){
		if(!(await registrantExists(randNum))){
			break;
		}
		randNum = randomNumberGenerator(prefix, length);
	}
	return randNum;   
}
async function registrantExists(regNumber){
	const reg =  await model("Registrant").find({registration_number: regNumber});
	if(reg.length > 0){
		return true;
	}
	return false;

}

const registrantModel = model('Registrant', registrantSchema)
module.exports = registrantModel
