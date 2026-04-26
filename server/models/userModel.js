import supabase from '../db/index.js'

export async function findOrCreateGoogleUser(googleUser) {
    const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('googleid', googleUser.googleId)
        .single()

        if (findError && findError.code !== 'PGRST116') {
            throw findError
        }

        if (existingUser) {
            return existingUser
        }

        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                googleid: googleUser.googleId,
                email: googleUser.email,
                username: googleUser.username,
                profilepicture: googleUser.profilePicture,
                admin: false
            })
            .select()
            .single()

            if (insertError) {
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