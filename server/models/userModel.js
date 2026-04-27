import supabase from '../db/index.js'

export async function findOrCreateGoogleUser(googleUser) {
    const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', googleUser.googleId)
        .single()

        if (findError && findError.code !== 'PGRST116') {
            throw findError
        }

        if (existingUser) {
            return existingUser
        }

        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([
                {
                google_id: googleUser.googleId,
                email: googleUser.email,
                username: googleUser.username,
                profile_picture: googleUser.profilePicture,
                admin: false
                }
            ])
            .select()
            .single()

            if (createError) {
                throw createError
            }

            return newUser
} 

export async function getById(id) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return data
}

export async function getAll() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('id')

  if (error) throw error

  return data
}

export async function update(id, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function remove(id) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function addFriend(userId, friendId) {
  const { data: user, error } = await supabase
    .from('users')
    .select('friends')
    .eq('id', userId)
    .single()

  if (error) throw error

  const friends = user.friends || []

  if (!friends.includes(friendId)) {
    friends.push(friendId)
  }

  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update({ friends })
    .eq('id', userId)
    .select()
    .single()

  if (updateError) throw updateError

  return updatedUser
}

export async function removeFriend(userId, friendId) {
  const { data: user, error } = await supabase
    .from('users')
    .select('friends')
    .eq('id', userId)
    .single()

  if (error) throw error

  const friends = user.friends || []

  const updatedFriends = friends.filter((id) => id !== friendId)

  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update({ friends: updatedFriends })
    .eq('id', userId)
    .select()
    .single()

  if (updateError) throw updateError

  return updatedUser
}

export async function searchPublicUsersById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, profile_picture')
    .eq('id', id)

  if (error) throw error

  return data
}