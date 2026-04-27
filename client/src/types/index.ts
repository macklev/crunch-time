export type User= {
  id: number
  username: string
  gender: string
  age: number
  admin: boolean
  profilePicture: string
  friends: number[]
}

export type Activity = {
  id: number
  userId: number
  date: string
  duration: number
  type: string
  caloriesBurned: number
}

export type ActivityType = {
  id: number
  name: string
  calories_per_hour: number
  description?: string
}
