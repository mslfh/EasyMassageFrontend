import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    messages: [],
    smsBalance: 0,
    loading: false,
    selectedDate: new Date().toISOString().split('T')[0]
  }),

  getters: {
    getMessages: (state) => state.messages,
    isLoading: (state) => state.loading,
    getCurrentDate: (state) => state.selectedDate,
    getSmsBalance: (state) => state.smsBalance
  },

  actions: {
    setSelectedDate(date) {
      this.selectedDate = date
    },

    async fetchMessages(date = null) {
      const targetDate = date || this.selectedDate

      // Avoid fetching if already loading or date hasn't changed
      if (this.loading) return

      this.loading = true

      try {
        const response = await api.get('/api/getNotification', {
          params: {
            'begin_date': targetDate,
            'end_date': targetDate,
          },
        })
        this.messages = response.data
        const balanceResponse = await api.get('/api/getSmsBalance');
        this.smsBalance = balanceResponse.data.data.sms_balance
        console.log('SMS Balance:', this.smsBalance)
        console.log('Messages loaded for date:', targetDate, this.messages)
      } catch (error) {
        console.error('Error fetching messages:', error)
        this.messages = []
      } finally {
        this.loading = false
      }
    },

    async changeDateAndFetch(newDate) {
      if (newDate !== this.selectedDate) {
        this.setSelectedDate(newDate)
        await this.fetchMessages(newDate)
      }
    }
  }
})
