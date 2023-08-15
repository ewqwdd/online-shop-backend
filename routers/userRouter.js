let express = require('express')
let controller = require('../controllers/userController.js')
let userRouter = express()
let adminMiddleware = require('../middleware/adminMiddleware.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const adminOrUserMiddleware = require('../middleware/adminOrUserMiddleware.js');

let userRoutes = new controller();
console.log(userRoutes)

userRouter.use(express.json()); // for parsing application/json
userRouter.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

userRouter.get("/", [adminOrUserMiddleware], userRoutes.getUsers);
userRouter.get("/:id",[adminMiddleware], userRoutes.getUser);
userRouter.post("/", [adminMiddleware], userRoutes.postUser);
userRouter.post("/admin", [adminMiddleware], userRoutes.addAdmin);
userRouter.delete("/:id", [adminMiddleware], userRoutes.deleteUser);
userRouter.put("/:id", [adminMiddleware], userRoutes.updateUser)
userRouter.get("/if-bought/:id",[authMiddleware], userRoutes.ifBoughtItem);


module.exports = userRouter;