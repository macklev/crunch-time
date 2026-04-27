import * as activityTypesModel from '../models/activityTypesModel.js'

export async function getActivityTypes(req, res) {
  try {
    const types = await activityTypesModel.getAll()
    res.json(types)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createActivityType(req, res) {
  try {
    const newType = await activityTypesModel.create({
      name: req.body.name,
      calories_per_hour: req.body.calories_per_hour
    })

    res.json(newType)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateActivityType(req, res) {
  try {
    const id = Number(req.params.id)

    const updatedType = await activityTypesModel.update(id, {
      name: req.body.name,
      calories_per_hour: req.body.calories_per_hour
    })

    res.json(updatedType)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function deleteActivityType(req, res) {
  try {
    const id = Number(req.params.id)

    await activityTypesModel.remove(id)

    res.json({ message: 'Activity type deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}