import supabase from '../db/index.js'

export async function getByUserId(userId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}