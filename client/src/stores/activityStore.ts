import { defineStore } from 'pinia'
import { ref } from 'vue'
import activityTypesData from '../data/activityTypes.json'
import activitiesData from '../data/activities.json'
import { useUserStore } from './userStore'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref(activitiesData.activities)

  const activityTypes = ref(activityTypesData.activities)

  const userStore = useUserStore()



  function addActivity(type: string, duration: number, date: string) {

  if (!userStore.currentUser) {
    console.error('No user selected')
    return
  }

  const activityType = activityTypes.value.find(
    (activityType) => activityType.name.toLowerCase() === type.toLowerCase()
  )

  if (!activityType) return

  const caloriesBurned =
    (activityType.caloriesBurnedPerHour / 60) * duration

  const newActivity = {
    id: activities.value.length + 1,
    userId: userStore.currentUser!.id,
    type,
    duration,
    caloriesBurned,
    date
  }

  activities.value.push(newActivity)
}

  function deleteActivity(id: number){
    activities.value = activities.value.filter(activity => activity.id !== id)
  }

  function editActivity(updatedActivity: (typeof activities.value)[number]){
    const index= activities.value.findIndex(activity => activity.id === updatedActivity.id)
    if (index !== -1) {
      activities.value[index] = updatedActivity
    }
  }

  return {
    activities,
    activityTypes,
    addActivity,
    deleteActivity,
    editActivity,
  }
})
