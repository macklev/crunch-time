import express from 'express'
import { getMyMessages } from '../controllers/messagesController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/me', authenticateToken, getMyMessages)

export default router