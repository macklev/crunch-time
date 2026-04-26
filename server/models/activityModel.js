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

  if (error) throw error

  return data[0]
}

export async function update(id, updates) {
  const { data, error } = await supabase
    .from('activities')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw error

  return data[0]
}

export async function remove(id) {
  const { data, error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id)

  if (error) throw error

  return data[0]
}