import * as express from 'express'
import controller from '../controllers/refreshTokenController'
const router = express.Router()

router.get('/token', controller.refreshToken)

export default router
