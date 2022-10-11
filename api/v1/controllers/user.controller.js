const User = require("../../../schema/user.schema");
const { JSONResponse } = require("../../../utilities/jsonResponse");
const { ObjectId } = require("mongoose").Types;

class UserController {
   /**
    *
    * ### Description
    * Gets all the user profiles in the database
    * @param {Request} req
    * @param {Response} res
    * @param {Next} next
    */
   static getAllUsers = async (req, res, next) => {
      try {
         let users = await User.find().populate("department");
         JSONResponse.success(res,"Retrieved all users successfully",users,201);
      } catch (error) {
         JSONResponse.error(res, "Error Retrieving user profiles", error, 404);
      }
   };

        /**
     * 
     * ### Description
     * Creates a user profile with the data that the user passes in the body.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    static createUserProfile = async(req, res, next)=>{
        try{
            let data = req.body;
            if(Object.keys(data).length == 0) throw new Error("No data passed to create user profile");
            let user = await new User(data).save();
            user.password = undefined;
            JSONResponse.success(res, "User profile successfully created", await user.populate("department"), 201);
        }catch(error){
            JSONResponse.error(res, "Error creating user profile", error, 400);
        }
    }

        /**
     * 
     * ### Description
     * Gets the user profile for a single user with the id that is passed in as a parameter, then updates the user with the data that is passed in the body.
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    static updateUserProfile = async(req, res, next)=>{
        try{
            let data = req.body;
            let id = req.params.id;
            if(!ObjectId.isValid(id)) throw new Error("Invalid ID was passed as a parameter");
            if(Object.keys(data).length == 0) {
                return JSONResponse.success(res, "No data passed, file not updated",{}, 200);
            }
            let user = await User.findOneAndUpdate({_id:id},data, {new:true}).populate("department");
            if(!user) throw new Error("User not found with the ID");
            JSONResponse.success(res, "User updated successfully", user, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to update user profile", error, 404);
        }
    }

   /**
    *
    * ### Description
    * Gets the user profile for a single user with the id that is passed in as a parameter and deletes it, returning the user that was deleted.
    * @param {Request} req
    * @param {Response} res
    * @param {Next} next
    */
   static deleteUserProfile = async (req, res, next) => {
      try {
         let id = req.params.id;
         if (!ObjectId.isValid(id))
            throw new Error("ID does not match any user profile in database");
         let user = await User.findByIdAndDelete(id).populate("department");
         if (!user) throw new Error("User does not exist with this ID");
         JSONResponse.success(res, "Successfully deleted user", user, 203);
      } catch (error) {
         JSONResponse.error(res, "Unable to delete user", error, 404);
      }
   };

   /**
    *
    * ### Description
    * Gets the user profile for a single user with the id that is passed in as a parameter.
    * @param {Request} req
    * @param {Response} res
    * @param {Next} next
    */
   static getUserProfile = async (req, res, next) => {
      try {
         let id = req.params.id;
         if (!ObjectId.isValid(id))
            throw new Error("Id is not a valid user profile in database");
         let user = await User.findById(id).populate("department");
         if (!user) throw new Error("User not found with this id");
         user.password = undefined;
         JSONResponse.success(res, "Retrieved user info", user, 200);
      } catch (error) {
         JSONResponse.error(res, "Unable to find user", error, 404);
      }
   };
}

module.exports = UserController;
