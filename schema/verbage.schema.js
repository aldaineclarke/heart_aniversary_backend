const { Schema, model } = require('mongoose');



const verbageSchema = new Schema({
    name: { type: String, required:[true, "Verbage name is required"], unique: true },
    description: { type: String, required:[true, "Verbage description is required"], unique: true },
});



module.exports = model("Verbage", verbageSchema);



