export type UserRole = 'user' | 'admin'

export type User = {
    id: number
    firstName: string
    lastName: string
    gender: string
    birthdate: Date
    image: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
    role: UserRole
}

export type Activity = {
    id: number
    name: string
    description: string
}