import * as activitiesModel from '../models/activityModel.js'

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
    const newActivity = await activityModel.create(req.body)
    res.json(newActivity)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateActivity(req, res) {
  try {
    const id = Number(req.params.id)

    const updatedActivity = await activityModel.update(id, req.body)
    
    res.json(updatedActivity)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function deleteActivity(req, res) {
  try {
    const id= Number(req.params.id)

    await activityModel.remove(id)
    res.json({ message: 'Activity deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}