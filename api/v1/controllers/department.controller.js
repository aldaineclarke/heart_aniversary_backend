const Department = require("../../../schema/department.schema");
const { JSONResponse } = require("../../../utilities/jsonResponse");


class DepartmentController {

    static getAllDepartments = async(req, res, next)=>{
        try{
            let departments = await Department.find();
            JSONResponse.success(res, "Successfully retrieved departments", departments, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to retrieve departments", error, 404);
        }
    }

    static getDepartmentById = async (req, res, next)=>{
        try{
            let id = req.params.id;
            let department = await Department.findById(id);
            JSONResponse.success(res, "Successfully retrieved department", department, 200)
        }catch(error){
            JSONResponse.error(res, "Unable to retrieve department", error, 404);
        }
    }

    static createDepartment = async(req, res,next)=>{
        try{
            let data = req.body;
            let department = await new Department(data).save();
            JSONResponse.success(res, "Successfully created department", department, 201);
        }catch(error){
            JSONResponse.error(res, "Unable to create department", error, 404);
        }
    }

    static updateDepartment = async(req, res, next)=>{
        try{
            let data = req.body;
            let id = req.params.id;
            let department = await Department.findByIdAndUpdate(id, data, {new:true});
            JSONResponse.success(res, "Successfully updated department", department, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to update department", error, 404);
        }
    }


    static deleteDepartment = async(req,res, next)=>{
        try{
            let id = req.params.id;
            let department = await Department.findByIdAndDelete(id);
            JSONResponse.success(res,"Successfully deleted department", department, 200);
        }catch{
            JSONResponse.error(res, "Unable to delete department", error, 404)
        }
    }
}



module.exports = DepartmentController;