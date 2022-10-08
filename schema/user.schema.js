const {model, Schema} = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    fname : {
        type: String, 
        unique: [true, "name already exist in the database"]
    }, 
    lname : {
        type: String, 
        required: [true, "Last name is a required field"]
    }, 
    email: {
        type: String, 
        unique: [true, "Email already exist in the database"],
        required: [true, "Email already exist in the database"]
    },
    password: {
        type: String, 
        required: [true, "Password was not provided"]
    },
    department:{
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: function(){
            if(this.isSuperAdmin) return false;
            return true;
        }
    },
    isSuperAdmin:{
        type: Boolean,
        default: false,
    }
   

});


// Middleware function to execute and hash password before saving user into the database.

userSchema.pre("save", async function(next){
    try{
        if(!this.isModified('password')) return next(); 
        this.password = await bcrypt.hash(this.password,10);       
    }catch(error){
        return Promise.reject(new Error(error.message));
    }
    
});


userSchema.post("save", async function(doc){
    doc = removeSensitiveFields(doc);
});

userSchema.pre("findOneAndUpdate", async function(next){    
    try{
        if(this._update.password) {
            this._update.password = await bcrypt.hash(this._update.password, 10)
        }
    }catch(error){
        return Promise.reject(new Error(error.message));
    }
})


// had to do a bunch of acrobatics here. Not sure if it really is the best approach..highly doubt it. The latest condition is trying to zeroin on authenticating user to ensure that document password is not removed before it is processed;

userSchema.post(/^find/, async function(doc){
    if(Array.isArray(doc)){
        for(let file of doc){
            file = removeSensitiveFields(file);
        }
    }else {
        if(!doc) return Promise.reject(new Error("No File found"));

        // checks to see if the operation is findOne and if there is an email in the conditions
        if(!(this.op == "findOne" && this._conditions.email)) {
            doc = removeSensitiveFields(doc);

        }
    }
});


function removeSensitiveFields(doc){
    doc.isSuperAdmin = undefined;
    doc.password = undefined;   
    return doc
}
// Instance method to check for a password to compare a password with the encrypted password on the instance document.
userSchema.methods.isCorrectPassword = async function(password){
    let isCorrect = await bcrypt.compare(password, this.password);
    return isCorrect;
}


module.exports = model("User", userSchema);