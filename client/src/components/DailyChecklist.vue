<template>
  <div id="DailyChecklist">
    <div v-html="thisDay" class="justify-content-md-center"></div>
      <div class="col col-6 text-center">
        <ul class="list-group">
          <li class="list-group-item text-center list-group-item-secondary" v-for="action in dailyChecklist">
            {{action}}
          </li>
        </ul>
    </div>
  </div>
</template>

<script>
import userService from '../../services/userService'
export default {
  name: 'DailyChecklist',
  props: ['day'],
  data () {
    return {
      user: '1',
      thisDay: this.day,
      dailyChecklist: null
    }
  },

  mounted () {
    this.getDailyChecklist()
  },

  beforeRouteUpdate (to,from,next) {
    this.thisDay = to.params.day
    this.checkExistenceChecklist()
      .then( checkExistence => {
        if (checkExistence) next()
        else next('/') 
      })
  },

  methods: {

    async checkExistenceChecklist(){
      let response
      try{
        response = await userService.fetchDailyChecklist(this.user, this.thisDay)
      }
      catch (err){
        response = err.response
      }
      finally {
        if (response.data.content) return true
        else return false
      }
    },

    async getDailyChecklist () {
      let response
      try{
        response = await userService.fetchDailyChecklist(this.user, this.thisDay)
      }
      catch (err){
        response = err.response
      }
      finally {
        if (response.data.message === 'Found day') this.dailyChecklist = response.data.content
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
