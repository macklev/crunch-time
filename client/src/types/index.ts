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
  users?: {
    id: number
    username: string
    profilePicture: string
  }
}

export type ActivityType = {
  id: number
  name: string
  calories_per_hour: number
  description?: string
}

export type ActivityStats = {
  totalActivities: number
  totalMinutes: number
  totalCalories: number
  averageDuration: number
  mostCommonActivity: string
}

export type Message = {
  id: number
  userId: number
  text: string
  created_at: string
  read: boolean
}

