<template>
  <div id="app">
    <div id="header">
        <nav>
          <!-- <router-link to="/dailyStatus">Daily Status</router-link> -->
          <router-link to="/dailyRecap">Daily Recap</router-link>
          <router-link to="/actions">All Actions</router-link>
        </nav>
    </div>
    <div id="main">
      <!-- <router-view :key="$route.fullPath"></router-view> -->
      <router-view></router-view>
      <!-- <home v-bind:actualday="actualDay" v-bind:chosenday="chosenDay"></home> -->
    </div>
    <div id="footer">
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
import Home from './Home' 
import userService from '../../../services/userServiceChecklist'
import router from '../../router'
export default {
  name: 'ChecklistPage',
  components: {Home},
  data () {
    return {
      day: null,
      month: null,
      year: null,
      dailyChecklist: null,
      chosenDay: null,
      formFilled: true
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
    console.log('test')
    //router.push('/Checklist/Home')
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

      if (this.chosenDay === today) router.push(('/Home'));
      else router.push({ name: 'DailyChecklist', params: { day: this.chosenDay }});
    },

    getCurrentDayChecklist () {
      router.push(('/Home'))
    },

    getDate () {
        let today = new Date().toISOString()
        let todayFormatted = today.split('T')[0].split('-')[2] + '.' + today.split('T')[0].split('-')[1] + '.' + today.split('T')[0].split('-')[0]
        return todayFormatted
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
