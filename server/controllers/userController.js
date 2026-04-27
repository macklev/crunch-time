import * as userModel from '../models/userModel.js'

export async function getMe(req, res) {
  try {
    const user = await userModel.getById(req.user.id)
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAll()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateUser(req, res) {
  try {
    console.log('Update body:', req.body)
    const id = Number(req.params.id)

    const updates = {
      username: req.body.username,
      admin: req.body.admin
    }

    const updatedUser = await userModel.update(id, updates)

    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function deleteUser(req, res) {
  try {
    const id = Number(req.params.id)

    await userModel.remove(id)

    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function addFriend(req, res) {
  try {
    const friendId = Number(req.body.friendId)

    const updatedUser = await userModel.addFriend(
      req.user.id,
      friendId
    )

    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function removeFriend(req, res) {
  try {
    const friendId = Number(req.params.friendId)

    const updatedUser = await userModel.removeFriend(
      req.user.id,
      friendId
    )

    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function searchUsers(req, res) {
  try {
    const id = Number(req.query.id)

    if (!id) {
      return res.json([])
    }

    const users = await userModel.searchPublicUsersById(id)

    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
