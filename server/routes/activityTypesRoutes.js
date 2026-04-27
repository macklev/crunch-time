import express from 'express'
import {getActivityTypes, createActivityType,  updateActivityType, deleteActivityType } from '../controllers/activityTypesController.js'

import { authenticateToken } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/admin.js'

const router = express.Router()

router.get('/', authenticateToken, getActivityTypes)

router.post('/', authenticateToken, requireAdmin, createActivityType)

router.put('/:id', authenticateToken, requireAdmin, updateActivityType)

router.delete('/:id', authenticateToken, requireAdmin, deleteActivityType)

export default router