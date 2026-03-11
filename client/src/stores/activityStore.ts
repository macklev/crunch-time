import { defineStore } from 'pinia'
import type { Activity, User } from '../types/index'
import { ref } from 'vue'
import activitiesData from '../data/activities.json'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>(activitiesData.activities)



  function addActivity(){
    userId= currentUser.value?.id || 0
  }

  function deleteActivity(){

  }

  function editActivity(){

  }

  return {
    activities,
    addActivity,
    deleteActivity,
    editActivity,
  }
})
