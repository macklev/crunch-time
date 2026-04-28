import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Activity, ActivityType, ActivityStats } from '@/types'
import { api } from '@/services/api'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([])
  const activityTypes = ref<ActivityType[]>([])

  async function fetchMyActivities() {
    activities.value = await api<Activity[]>('/api/activities/me')
  }

  async function fetchFriendActivities() {
    return await api<Activity[]>('/api/activities/friends')
  }

  async function fetchActivityTypes() {
    activityTypes.value = await api<ActivityType[]>('/api/activity-types')
  }

  async function createActivity(activityData: {
    type: string
    duration: number
    caloriesBurned: number
    date: string
  }) {
    const newActivity = await api<Activity>('/api/activities', activityData)
    activities.value.push(newActivity)
    return newActivity
  }

  async function updateActivity(id: number, updates: Partial<Activity>) {
    const updatedActivity = await api<Activity>(
      `/api/activities/${id}`,
      updates,
      { method: 'PUT' },
    )

    const index = activities.value.findIndex((activity) => activity.id === id)

    if (index !== -1) {
      activities.value[index] = updatedActivity
    }

    return updatedActivity
  }

  async function deleteActivity(id: number) {
    await api(`/api/activities/${id}`, undefined, {
      method: 'DELETE',
    })

    activities.value = activities.value.filter((activity) => activity.id !== id)
  }

  function clearActivities() {
  activities.value = []
  }

  async function fetchStats() {
  return await api<ActivityStats>('/api/activities/stats')
}

  return {
    activities,
    activityTypes,
    fetchMyActivities,
    fetchFriendActivities,
    fetchActivityTypes,
    createActivity,
    updateActivity,
    deleteActivity,
    clearActivities,
    fetchStats
  }
})
