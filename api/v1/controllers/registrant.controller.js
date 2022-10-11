const Registrant = require("../../../schema/registrant.schema");
const { JSONResponse } = require("../../../utilities/jsonResponse");
const { ObjectId } = require("mongoose").Types;

class RegistrantController {
   /**
    *
    * ### Description
    * Gets all the registrant documents in the database
    * @param {Request} req
    * @param {Response} res
    * @param {Next} next
    */
   static getAllRegistrants = async (req, res, next) => {
      try {
         if(req.query.registration_number){
            return this.getDocByRegNumber(req, res, req.query.registration_number);
         }else if(Object.keys(req.query).length > 0){
            throw new Error("Not an accepted query parameter");
         }
         let registrants = await Registrant.find().populate("department");
         JSONResponse.success(res,"Retrieved all registrant successfully",registrants,201);
      } catch (error) {
         JSONResponse.error(res, "Error Retrieving registrant profiles", error, 404);
      }
   };

        /**
     * 
     * ### Description
     * Creates a registrant profile with the data that the user passes in the body.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    static createRegistrant = async(req, res, next)=>{
        try{
            let data = req.body;
            if(Object.keys(data).length == 0) throw new Error("No data passed to create registrant profile");
            let registrant = new Registrant(data);
            registrant.registration_number = await registrant.assignRegNum();
            let duplicate = await registrant.checkDupe();
            if(duplicate) throw new Error("Duplicate registrant found");
            let newRegistrant = await registrant.save();
            await newRegistrant.populate("department");
            JSONResponse.success(res, "Registrant profile successfully created", newRegistrant, 201);
        }catch(error){
            JSONResponse.error(res, "Error creating registrant profile", error, 400);
        }
    }

        /**
     * 
     * ### Description
     * Gets the registrant that matches the id and updates the document with the data that is passed in the body.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    static updateRegistrant = async(req, res, next)=>{
        try{
            let data = req.body;
            let id = req.params.id;
            if(!ObjectId.isValid(id)) throw new Error("Invalid ID was passed as a parameter");
            if(Object.keys(data).length == 0) {
                return JSONResponse.success(res, "No data passed, file not updated",{}, 200);
            }
            let registrant = await Registrant.findOneAndUpdate({_id:id},data, {new:true}).populate("department");
            if(!registrant) throw new Error("Registrant not found with the ID");
            JSONResponse.success(res, "Registrant updated successfully", registrant, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to update registrant profile", error, 404);
        }
    }

   /**
    *
    * ### Description
    * Gets the registrant with the id that is passed in as a parameter and deletes it, returning the registrant that was deleted.
    * @param {Request} req
    * @param {Response} res
    * @param {Next} next
    */
   static deleteRegistrant = async (req, res, next) => {
      try {
         let id = req.params.id;
         if (!ObjectId.isValid(id))
            throw new Error("ID does not match any registrant profile in database");
         let registrant = await Registrant.findByIdAndDelete(id).populate("department");
         if (!registrant) throw new Error("Registrant does not exist with this ID");
         JSONResponse.success(res, "Successfully deleted registrant", registrant, 203);
      } catch (error) {
         JSONResponse.error(res, "Unable to delete registrant", error, 404);
      }
   };

   /**
    *
    * ### Description
    * Gets the registrant document for a single registrant with the id that is passed in as a parameter.
    * @param {Request} req
    * @param {Response} res
    * @param {Next} next
    */
   static getRegistrantById = async (req, res, next) => {
      try {
         let id = req.params.id;
         if (!ObjectId.isValid(id))
            throw new Error("Id is not a valid registrant profile in database");
         let registrant = await Registrant.findById(id).populate("department");
         console.log(registrant);
         if (!registrant) throw new Error("Registrant not found with this id");
         JSONResponse.success(res, "Retrieved registrant info", registrant, 200);
      } catch (error) {
         JSONResponse.error(res, "Unable to find registrant", error, 404);
      }
   };

   static getDocByRegNumber = async(req, res, registration_number)=>{
        try{
            let registrant = await Registrant.findOne({registration_number: registration_number}).populate("department");
            if(!registrant) throw new Error("Registrant was not found with that registration number");
            JSONResponse.success(res, "Registrant for user found", registrant, 200)
        }catch(error){
            JSONResponse.error(res, "Cannot find Registrant for user", error, 404);
        }
    }

}

module.exports = RegistrantController;
