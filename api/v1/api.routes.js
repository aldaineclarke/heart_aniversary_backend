const router = require("express").Router();
const userRouter =  require("./routes/user.routes");

/**
 * Generates the API Docs from the list of routes in the system and attaches descriptions to them
 * from the descriptions array, when you add routes, it will change on the next load to reflect new routes
 * automatically. They appear in the same order as they are written in the code, match the array descriptions
 * to this order.
 */
 router.all('', (req, res) => {
	let concat = [];
    let resource = "";
    let routerLayers = [...router.stack]
	for (let routerLayer of routerLayers) {
        if(!routerLayer.handle.stack) {
            concat.push({
                path: routerLayer.route.path,
                methods: Object.keys(routerLayer.route.methods),
            })
            continue
        };
        switch(routerLayers.indexOf(routerLayer)){
            case 1: resource = "users";break;
            case 2: resource = "departments";break;
            case 3: resource = "registrants";break;
            case 4: resource = "authenticate";break;
        }
        for(let layer of routerLayer.handle.stack){
            concat.push({
                path: resource+layer.route.path,
                methods: Object.keys(layer.route.methods),
            })
        }
		
    }

	const descriptions = [
		`API DOCS URL`,
		`Route for creating user and getting all users in the database`,
		`Route for updating, deleting and retrieving a single user`,
		`Gets all departments and allow for creation of departments`,
		`Retrieving, updating and deleting a single department`,
		`Creating and retrieving all registrants `,
		`Update, retrieve and delete a single registrant`,
		`Authenticate user  and creates token`,
	]
	let body = {
		name: 'Heart Registration App v1',
		version: '1.0.0',
		routes: concat,
		description: descriptions,
	}
	res.render('summary', body)
});

router.use("/users",userRouter);
router.use("/departments", require("./routes/department.routes"));
router.use("/registrants", require("./routes/registrant.routes"));
router.use("/authenticate", require("./routes/auth.routes"));



module.exports = router;