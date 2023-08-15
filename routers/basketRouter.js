let express = require('express')
let controller = require('../controllers/basketController.js')
let basketRouter = express()
let adminMiddleware = require('../middleware/adminMiddleware.js');
const authMiddleware = require('../middleware/authMiddleware.js');

let basketRoutes = new controller();

basketRouter.use(express.json()); // for parsing application/json
basketRouter.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

basketRouter.get("/:username",  authMiddleware, basketRoutes.getBasket);
basketRouter.post("/", authMiddleware, basketRoutes.addItem);
basketRouter.get("/", [adminMiddleware], basketRoutes.getBaskets);
basketRouter.delete("/", authMiddleware, basketRoutes.deleteItem)
basketRouter.post("/decrease", authMiddleware, basketRoutes.decreaseItem);
basketRouter.post("/buy", authMiddleware, basketRoutes.buyItems)


module.exports = basketRouter;