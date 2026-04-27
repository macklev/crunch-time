import express from 'express'
import { getAllActivities, createActivity, deleteActivity, updateActivity, getMyActivities } from '../controllers/activityController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateToken, getAllActivities)
router.get('/me', authenticateToken, getMyActivities)
router.post('/', authenticateToken, createActivity)
router.put('/:id', authenticateToken, updateActivity)
router.delete('/:id', authenticateToken, deleteActivity)

export default router