let express = require('express')
let controller = require('../controllers/itemController.js')
let itemRouter = express()
let adminMiddleware = require('../middleware/adminMiddleware.js');
const authMiddleware = require('../middleware/authMiddleware.js');
let itemRoutes = new controller();

itemRouter.use(express.json()); // for parsing application/json
itemRouter.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

itemRouter.get("/", itemRoutes.getItems);
itemRouter.get("/:name", itemRoutes.getItem);
itemRouter.post("/", [adminMiddleware], itemRoutes.postItem);
itemRouter.delete("/", [adminMiddleware], itemRoutes.deleteItem);
itemRouter.get("/id/:id", itemRoutes.getItemById);
itemRouter.put("/:id", [adminMiddleware], itemRoutes.updateItem)
itemRouter.get("/find/:query", itemRoutes.findItem);
itemRouter.post("/id/:id/review", [authMiddleware], itemRoutes.addReview);

module.exports = itemRouter;