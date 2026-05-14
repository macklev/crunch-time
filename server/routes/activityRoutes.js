import express from 'express'
import { getAllActivities, createActivity, deleteActivity, updateActivity, getMyActivities, getFriendActivities, getStats } from '../controllers/activityController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateToken, getAllActivities)
router.get('/me', authenticateToken, getMyActivities)
router.get('/friends', authenticateToken, getFriendActivities)
router.get('/friends/page', authenticateToken, getFriendActivitiesPage)
router.get('/stats', authenticateToken, getStats)

router.post('/', authenticateToken, createActivity)
router.put('/:id', authenticateToken, updateActivity)
router.delete('/:id', authenticateToken, deleteActivity)

export default router