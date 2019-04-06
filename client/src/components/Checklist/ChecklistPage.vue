<template>
  <div id="checklist">
    <div id="header">
        <nav>
          <!-- <router-link to="/dailyStatus">Daily Status</router-link> -->
          <router-link to="/dailyRecap">Daily Recap</router-link>
          <router-link to="/actions">All Actions</router-link>
        </nav>
    </div>
    <div id="main" v-if="isReady">
      <!-- <router-view :key="$route.fullPath"></router-view> -->
      <router-view></router-view>
      <!-- <home v-bind:actualday="actualDay" v-bind:chosenday="chosenDay"></home> -->
    </div>
    <div >
      <div class="row justify-content-md-center">
        <div class="col col-lg-2"><input type="text" placeholder="Day"  v-model="day"></div>
        <div class="col col-lg-2"><input type="text" placeholder="Month"  v-model="month"></div>
        <div class="col col-lg-2"><input type="text" placeholder="Year"  v-model="year"></div>
        <div class="col col-lg-2"><button v-on:click="getDailyChecklist" v-bind:disabled="formFilled">Get Day</button></div>
      </div>
      <div class="row justify-content-md-center">
        <div class="col col-lg">
          <button v-on:click="getCurrentDayChecklist">Get Current Day</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '../../../services/userServiceChecklist'
import router from '../../router'
export default {
  name: 'ChecklistPage',
  props: ["currentUser"],
  data () {
    return {
      user: this.currentUser,
      day: null,
      month: null,
      year: null,
      dailyChecklist: null,
      chosenDay: null,
      formFilled: true,
      lastday: null,
      actualDay: this.getDate(),
      isStarted: false,
      isReady: false
    }
  },

  watch: {
    day: function () {
      if (this.day && this.month && this.year) this.formFilled = false
      if (!this.day) this.formFilled = true
    },

    month: function () {
      if (this.day && this.month && this.year) this.formFilled = false
      if (!this.month) this.formFilled = true
    },

    year: function () {
      if (this.day && this.month && this.year) this.formFilled = false
      if (!this.year) this.formFilled = true
    }
  },

  mounted(){
    this.getLastDay()
      .then(() => {
        this.isReady = true
        if (!this.isStarted) {  
          router.push({ name: 'StartNewDay', params: { day: this.actualDay, lastday: this.lastDay, currentUser: this.user }})
        }
        else {
          router.push({ name: 'DailyChecklist', params: { day: this.actualDay, currentUser: this.user}})
        }
      })
      .catch(() => {
          // console.log('error') 
      })
  },

  methods: {

    async getDailyChecklist () {
      const id = 1
      if (this.day < 10) this.day = '0' + parseInt(this.day)
      if (this.month < 10) this.month = '0' + parseInt(this.month)
      this.chosenDay = this.day + '.' + this.month + '.' + this.year
      this.day = null
      this.month = null
      this.year = null
      let today = this.getDate()
      if (this.chosenDay === today) this.getCurrentDayChecklist ()
      else {
        
        router.push({ name: 'DailyChecklist', params: { day: this.chosenDay, currentUser: this.user}})}
    },

    getCurrentDayChecklist () {
      this.getLastDay()
        .then(() => {
          if (!this.isStarted) {  
            router.push({ name: 'StartNewDay', params: { day: this.actualDay, lastday: this.lastDay, currentUser: this.user }})
          }
          else {
            router.push({ name: 'DailyChecklist', params: { day: this.actualDay, currentUser: this.user}})
          }
        })
        .catch(() => {
        })
    },

    getDate () {
        let today = new Date().toISOString()
        let todayFormatted = today.split('T')[0].split('-')[2] + '.' + today.split('T')[0].split('-')[1] + '.' + today.split('T')[0].split('-')[0]
        return todayFormatted
    },

    async getLastDay () {
        let response
        try{
          response = await userService.fetchLastDay(this.user, this.thisDay)
        }
        catch (err){
          response = err.response
        }
        finally {
          
          if (response.data.message == 'The user exists') {
            this.lastDay = response.data.content["lastDay"]
            if (this.lastDay === this.actualDay) this.isStarted = true
          }
        }
         
    }

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#footer {
   position:fixed;
   left:0px;
   bottom:0px;
   height:80px;
   width:100%;
   background:#999;
}
</style>
