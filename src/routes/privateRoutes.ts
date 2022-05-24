import * as express from 'express'
import controller from '../controllers/privateController'
import verifyJWT from '../middleware/verifyJWT'

const router = express.Router()

router.get('/data', verifyJWT, controller.sensitive)

export default router
