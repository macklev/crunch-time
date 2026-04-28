import supabase from '../db/index.js'

export async function getAll() {
  const { data, error } = await supabase
    .from('activities')
    .select('*')

  if (error) throw error

  return data
}

export async function create(activity) {
  const { data, error } = await supabase
    .from('activities')
    .insert([activity])
    .select()
    .single()

  if (error) throw error

  return data
}

export async function update(id, activity) {
  const { data, error } = await supabase
    .from('activities')
    .update(activity)
    .eq('id', id)
    .select()

  if (error) throw error

  return data[0]
}

export async function remove(id) {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getByUserId(userId) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('userId', userId)

  if (error) throw error

  return data
}

export async function getById(id) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return data
}

export async function getByUserIds(userIds) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .in('userId', userIds)

  if (error) throw error

  return data
}