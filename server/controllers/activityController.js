import * as activityModel from '../models/activityModel.js'

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
    const id= Number(req.params.id)
    const activity = await activityModel.getById(id)

    if(activity.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await activityModel.remove(id)
    res.json({ message: 'Activity deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}