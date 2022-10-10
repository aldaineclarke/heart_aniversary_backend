const { Schema, model } = require("mongoose");
const Registrant = require("./registrant.schema");
const Department = require("./department.schema");
const User = require("./user.schema");
const Verbage = require("./verbage.schema");
const createPDF = require("../utilities/pdfGen");
const mailer = require("../utilities/nodemailer");
const path = require("path");
const participantSchema = new Schema({
    department: { type: Schema.Types.ObjectId, ref:"Department" ,required: [true, "Deparment is needed"]},
    registrant: { type: Schema.Types.ObjectId, ref:"Registrant" ,required: [true, "Registrant is needed"]},
    demonstrator: { type: Schema.Types.ObjectId, ref:"User", required: [true, "demonstrator is needed"]}
});



participantSchema.pre("save",async function(){
    console.log(this.registrant.toString());
    let registrant = await Registrant.findOne({_id: this.registrant});
    console.log(registrant)
    if(!registrant) return Promise.reject(new Error("No registrant found with this ID"));
    let regName = `${registrant.first_name} ${registrant.last_name}`;
    let department = await Department.findOne({_id: this.department.toString()});
    if(!department) return Promise.reject(new Error("No department found with this ID"));
    let verbage = await Verbage.findOne({"name": "I_DID_A_SKILL"});
    let depName = department.name;
    let user = await User.findOne({_id: this.demonstrator.toString()});
    if(!user) return Promise.reject(new Error("No user found with this iD"));

    let demonstratorName = `${user.fname} ${user.lname}`;

    createPDF(regName, demonstratorName);
	mailer.sendMail(
		registrant.email_address, 
		"Welcome to Heart's 40th Anniversary", "Hello [REGISTRANT_NAME] , \n [I_DID_A_SKILL]".replace("[I_DID_A_SKILL]", 
		verbage.description).replace("[REGISTRANT_NAME]", 
		regName).replace("[REGISTRATION_NUMBER]", registrant.registration_number),
		{
				  filename: "Participation_Certificate.pdf",
				  contentType: "application/pdf",
				  path: path.resolve(__dirname,"../assets/PARTICIPANT_CERTIFICATE.pdf")
		}
		);
});

module.exports = model("Participant",participantSchema); 