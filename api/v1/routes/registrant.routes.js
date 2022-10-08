const router = require('express').Router();
const RegistrantController = require('../controllers/registrant.controller');
const Middleware = require('../middlewares/middleware');

router
    .route("/")
    .get(Middleware.isAuthenticated,RegistrantController.getAllRegistrants)
    .post(RegistrantController.createRegistrant)
    
router
    .route("/:id")
    .get(Middleware.isAuthenticated,RegistrantController.getRegistrantById)

    .patch(Middleware.isAuthenticated,Middleware.isUserOrSuperAdmin,RegistrantController.updateRegistrant)

    .delete(Middleware.isAuthenticated,RegistrantController.deleteRegistrant)
    
module.exports = router;