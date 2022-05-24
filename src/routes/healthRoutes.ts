import * as express from 'express'
import controller from '../controllers/healthController'
import checkReqBody from '../middleware/checkReqBody'
const router = express.Router()

router.get('/server', controller.server)
router.post('/database', checkReqBody, controller.database)

export default router
