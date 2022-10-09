const { Schema, model} = require('mongoose');
const Department = require("./department.schema");
const { sendMail } = require("../utilities/sendMail");
const pdfMaker = require("../utilities/pdfMaker");
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
		required: [true, 'A department must be provided for this registration to be valid']
	},
	organization:{type: String, required: [true, 'A organization must be provided']},
	hasParticipated: {type: Boolean, default: false},

})


registrantSchema.pre("save", async function(next){
	let department = await Department.findById(this.department);
	if(!department) return Promise.reject(new Error("Invalid department ID"))
	let cert = await pdfMaker.GenerateCertificatePDF({
	   user: `${this.first_name} ${this.last_name}`,
	   department: department.name
	 })
	let mailData = {
	   recipient: this.email_address,
	   subject:`${department.name} Booth Registration`,
	   html:`Thank you for participating at the ${department.name} booth,\n
			 please see attached, your certificate showing the new skill that you have learnt`,
	   attachments:[{
		  content: cert,
		  filename: "Participation_Certificate.pdf",
		  type: "application/pdf",
		  disposition: "attachment"
	   }]
	}
	await sendMail(mailData);
	pdfMaker.deleteGeneratedPDF("Participation_Certificate.pdf");
})

registrantSchema.pre("findOneAndUpdate", async function(next){
	let doc = this.model.findOne(this.getQuery());
	// if the update is to change participated to true then it will send email.
	if(this._update.hasParticipated){
		if(!doc) return Promise.reject(new Error("No user found to update"));
		let department = await Department.findById(doc.department);
		if(!department) return Promise.reject(new Error("Invalid department ID"))
		let cert = await pdfMaker.GenerateCertificatePDF({
		   user: `${doc.first_name} ${doc.last_name}`,
		   department: department.name
		 })
		let mailData = {
		   recipient: doc.email_address,
		   subject:`${department.name} Booth Registration`,
		   html:`Thank you for participating at the ${department.name} booth,\n
				 please see attached, your certificate showing the new skill that you have learnt`,
		   attachments:[{
			  content: cert,
			  filename: "Participation_Certificate.pdf",
			  type: "application/pdf",
			  disposition: "attachment"
		   }]
		}
		await sendMail(mailData);
		pdfMaker.deleteGeneratedPDF("Participation_Certificate.pdf");
	}
	
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
