import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import * as userModel from '../models/userModel.js'

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
)

export function redirectToGoogle(req, res) {
    const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['openid', 'email', 'profile']
    })
    res.redirect(url)
}

export async function googleCallback(req, res) {
    try {
        const code= req.query.code

        const { tokens } = await client.getToken(code)
        client.setCredentials(tokens)

        const ticket= await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()
        
        const googleUser = {
            googleId: payload.sub,
            email: payload.email,
            username: payload.name,
            profilePicture: payload.picture
        }

        const user = await userModel.findOrCreateGoogleUser(googleUser)

        const appToken= jwt.sign(
            {
                id: user.id,
                username: user.username,
                admin: user.admin
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${appToken}`)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}