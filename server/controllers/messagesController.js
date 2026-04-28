import * as messagesModel from '../models/messagesModel.js'

export async function getMyMessages(req, res) {
  try {
    const messages = await messagesModel.getByUserId(req.user.id)
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}