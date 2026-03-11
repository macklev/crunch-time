export type User= {
  id: number
  username: string
  gender: string
  age: number
  admin: boolean
  profilePicture: string
}

export type Activity = {
  id: number
  userId: number
  date: string
  duration: number
  type: string
}
