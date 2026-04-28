import * as activityModel from '../models/activityModel.js'
import * as userModel from '../models/userModel.js'

export async function getMyActivities(req, res) {
  try {
    const activities = await activityModel.getByUserId(req.user.id)

    res.json(activities)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getAllActivities(req, res) {
  try {
    const activities = await activityModel.getAll()
    res.json(activities)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createActivity(req, res) {
  try {
    const newActivity = await activityModel.create({
        ...req.body,
        userId: req.user.id
    })
    res.json(newActivity)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateActivity(req, res) {
  try {
    const id = Number(req.params.id)
    const activity = await activityModel.getById(id)

    if (activity.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const updatedActivity = await activityModel.update(id, req.body)
    
    res.json(updatedActivity)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function deleteActivity(req, res) {
  try {
    const id = Number(req.params.id)

    const activity = await activityModel.getById(id)

    if (activity.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    await activityModel.remove(id)

    res.json({ message: 'Activity deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getFriendActivities(req, res) {
  try {
    const user = await userModel.getById(req.user.id)

    const friendIds = user.friends || []

    if (friendIds.length === 0) {
        return res.json([])
    }   

    const activities = await activityModel.getByUserIds(friendIds)

    res.json(activities)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getStats(req, res) {
  try {
    const activities = await activityModel.getByUserId(req.user.id)

    const totalActivities = activities.length

    const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0)

    const totalCalories = activities.reduce(
      (sum, a) => sum + (a.caloriesBurned || 0),
      0
    )

    const averageDuration =
      totalActivities > 0 ? totalMinutes / totalActivities : 0

    const typeCounts = {}

    activities.forEach((a) => {
      typeCounts[a.type] = (typeCounts[a.type] || 0) + 1
    })

    const mostCommonActivity =
      Object.keys(typeCounts).length > 0
        ? Object.keys(typeCounts).reduce((a, b) =>
            typeCounts[a] > typeCounts[b] ? a : b
          )
        : null

    res.json({
      totalActivities,
      totalMinutes,
      totalCalories,
      averageDuration,
      mostCommonActivity
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}