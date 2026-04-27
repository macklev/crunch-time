import supabase from '../db/index.js'

export async function getAll() {
  const { data, error } = await supabase
    .from('activity_types')
    .select('*')
    .order('id')

  if (error) throw error

  return data
}

export async function create(type) {
  const { data, error } = await supabase
    .from('activity_types')
    .insert([type])
    .select()
    .single()

  if (error) throw error

  return data
}

export async function update(id, updates) {
  const { data, error } = await supabase
    .from('activity_types')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function remove(id) {
  const { error } = await supabase
    .from('activity_types')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getById(id) {
  const { data, error } = await supabase
    .from('activity_types')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return data
}