const express = require('express')
let authMiddleware = require('../middleware/authMiddleware.js')
const router = express()

const basketRouter = require('./basketRouter')
const itemRouter = require('./itemRouter.js')
const userRouter = require('./userRouter.js')
const authRouter = require('./authRouter.js')


router.use('/baskets', [authMiddleware], basketRouter)
router.use('/items', itemRouter)
router.use('/users', userRouter)
router.use('/auth', authRouter)

module.exports = router