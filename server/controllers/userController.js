import * as usersModel from '../models/userModel.js'

export async function getMe(req, res) {
  try {
    const user = await usersModel.getById(req.user.id)
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}