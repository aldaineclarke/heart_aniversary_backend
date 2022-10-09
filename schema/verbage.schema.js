const { Schema, model } = require('mongoose');



const verbageSchema = new Schema({
    verbage: [
        {
            name: { type: String, required:[true, "Verbage name is required"], unique: true },
            description: { type: String, required:[true, "Verbage description is required"], unique: true },
        }
    ]
});






const Verbage = model("Verbage", verbageSchema);


function initialVerbage(){
        
    let verbage = new Verbage(
        [
            {
                "name": "WELCOME_EMAIL",
                "description": "Welcome to our company! We're so excited to have you as part of our team. We're glad you've chosen us, and we want to show our appreciation by giving you a special incentive. We're delighted to have you as our customer."
            }, 
            {
                "name":"I_DID_A_SKILL", "description":"Congratulations you are now one step closer to become proficient in this skill. We hope you continue down this path towards succes." 
            }
        ]
    ).save().catch((error)=>{
        console.log(error);
    })

};

initialVerbage();

module.exports = Verbage;



