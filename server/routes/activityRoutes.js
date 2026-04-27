import express from 'express'
import { getAllActivities, createActivity, deleteActivity, updateActivity, getMyActivities, getFriendActivities, getStats } from '../controllers/activityController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateToken, getAllActivities)
router.get('/me', authenticateToken, getMyActivities)
router.post('/', authenticateToken, createActivity)
router.put('/:id', authenticateToken, updateActivity)
router.delete('/:id', authenticateToken, deleteActivity)
router.get('/friends', authenticateToken, getFriendActivities)
router.get('/stats', authenticateToken, getStats)

export default router