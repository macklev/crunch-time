import express from 'express'
import { getMe, getAllUsers, updateUser, deleteUser, addFriend, removeFriend, searchUsers } from '../controllers/userController.js'
import { authenticateToken } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/admin.js'

const router = express.Router()

router.get('/me', authenticateToken, getMe)
router.get('/', authenticateToken, requireAdmin, getAllUsers)
router.put('/:id', authenticateToken, requireAdmin, updateUser)
router.delete('/:id', authenticateToken, requireAdmin, deleteUser)
router.post('/friends', authenticateToken, addFriend)
router.delete('/friends/:friendId', authenticateToken, removeFriend)
router.get('/search', authenticateToken, searchUsers)

export default router