const { ObjectId } = require("mongoose").Types;
const Participant = require("../../../schema/participant.schema");
const { JSONResponse } = require("../../../utilities/jsonResponse");


class ParticipantController {

    static getAllParticipants = async(req, res, next)=>{
        try{
            let participants = await Participant.find();
            JSONResponse.success(res, "Successfully retrieved participants", participants, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to retrieve participants", error, 404);
        }
    }

    static getParticipantById = async (req, res, next)=>{
        try{
            let id = req.params.id;
            if(!ObjectId.isValid(id)) throw new Error("This is not a valid ID");
            let participant = await Participant.findById(id);
            if(!participant) throw new Error("No participant matches this ID");
            JSONResponse.success(res, "Successfully retrieved participant", participant, 200)
        }catch(error){
            JSONResponse.error(res, "Unable to retrieve participant", error, 404);
        }
    }

    static createParticipant = async(req, res,next)=>{
        try{
            let data = req.body;
            let participant = await new Participant(data).save();
            JSONResponse.success(res, "Successfully created participant", participant, 201);
        }catch(error){
            JSONResponse.error(res, "Unable to create participant", error, 404);
        }
    }

    static updateParticipant = async(req, res, next)=>{
        try{
            let data = req.body;
            let id = req.params.id;
            let participant = await Participant.findByIdAndUpdate(id, data, {new:true});
            if(!participant) throw new Error("No participant matches this ID");
            JSONResponse.success(res, "Successfully updated participant", participant, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to update participant", error, 404);
        }
    }


    static deleteParticipant = async(req,res, next)=>{
        try{
            let id = req.params.id;
            let participant = await Participant.findByIdAndDelete(id);
            if(!participant) throw new Error("No participant matches this ID");
            JSONResponse.success(res,"Successfully deleted participant", participant, 200);
        }catch{
            JSONResponse.error(res, "Unable to delete participant", error, 404)
        }
    }
}



module.exports = ParticipantController;