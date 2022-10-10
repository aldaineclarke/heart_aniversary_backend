const router = require("express").Router();
const userRouter =  require("./routes/user.routes");
const path = require("path");
/**
 * Generates the API Docs from the list of routes in the system and attaches descriptions to them
 * from the descriptions array, when you add routes, it will change on the next load to reflect new routes
 * automatically. They appear in the same order as they are written in the code, match the array descriptions
 * to this order.
 */
 router.all('', (req, res) => {
	
	res.sendFile(path.resolve(__dirname,"../../index.html"));
});

router.use("/users",userRouter);
router.use("/departments", require("./routes/department.routes"));
router.use("/registrants", require("./routes/registrant.routes"));
router.use("/participants", require("./routes/participant.routes"));
router.use("/authenticate", require("./routes/auth.routes"));



module.exports = router;