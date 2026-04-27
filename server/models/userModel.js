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