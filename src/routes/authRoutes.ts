import * as express from 'express'
import controller from '../controllers/authController'
import avoidDuplicateEmail from '../middleware/avoidDuplicateEmail'
import checkReqBody from '../middleware/checkReqBody'

const router = express.Router()

router.post('/register', checkReqBody, avoidDuplicateEmail, controller.register)
router.post('/login', checkReqBody, controller.login)
router.get('/logout', controller.logout)

export default router
