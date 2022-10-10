const router = require('express').Router();
const ParticipantController = require('../controllers/participant.controller');
const Middleware = require('../middlewares/middleware');

router
    .route("/")
    .get(ParticipantController.getAllParticipants)
    .post(Middleware.isAuthenticated,Middleware.isSuperAdmin,ParticipantController.createParticipant)
router
    .route("/:id")
    .get(Middleware.isAuthenticated, ParticipantController.getParticipantById)
    .patch(Middleware.isAuthenticated,Middleware.isSuperAdmin,ParticipantController.updateParticipant)
    .delete(Middleware.isAuthenticated,Middleware.isSuperAdmin,ParticipantController.deleteParticipant);



module.exports = router;