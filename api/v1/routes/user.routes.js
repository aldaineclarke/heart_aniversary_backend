const router = require('express').Router();
const UserController = require('../controllers/user.controller');
const Middleware = require('../middlewares/middleware');

router
    .route("/")
    .get(Middleware.isAuthenticated,Middleware.isSuperAdmin,UserController.getAllUsers)
    .post(UserController.createUserProfile)
    
router
    .route("/:id")

    .get(Middleware.isAuthenticated,Middleware.isUserOrSuperAdmin,UserController.getUserProfile)

    .patch(Middleware.isAuthenticated,Middleware.isUserOrSuperAdmin,UserController.updateUserProfile)

    .delete(Middleware.isAuthenticated,Middleware.isUserOrSuperAdmin,UserController.deleteUserProfile)
    
module.exports = router;