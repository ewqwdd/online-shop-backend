let express = require('express')
let controller = require('../controllers/authController.js')
let authRouter = express()
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware.js')
const adminMiddleware = require('../middleware/adminMiddleware.js')

let authController = new controller();

authRouter.use(express.json()); // for parsing application/json
authRouter.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

authRouter.post("/register", 
    [check('username', "Invalid value").notEmpty(),
    check('password', "Password has to be at least 8 symbols long").isLength({min:8})], 
    authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/", [authMiddleware], authController.check);
authRouter.get("/admin", [adminMiddleware], authController.checkAdmin);



module.exports = authRouter;