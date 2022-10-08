const router = require('express').Router();
const DepartmentController = require('../controllers/department.controller');
const Middleware = require('../middlewares/middleware');

router
    .route("/")
    .get(DepartmentController.getAllDepartments)
    .post(Middleware.isAuthenticated,Middleware.isSuperAdmin,DepartmentController.createDepartment)
router
    .route("/:id")
    .get(Middleware.isAuthenticated, DepartmentController.getDepartmentById)
    .patch(Middleware.isAuthenticated,Middleware.isSuperAdmin,DepartmentController.updateDepartment)
    .delete(Middleware.isAuthenticated,Middleware.isSuperAdmin,DepartmentController.deleteDepartment);



module.exports = router;