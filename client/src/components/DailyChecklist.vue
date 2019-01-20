<template>
  <div id="DailyChecklist">
    <div v-html="thisDay" class="justify-content-md-center"></div>
      <div class="col col-6 text-center">
        <ul class="list-group">
          <li class="list-group-item text-center list-group-item-secondary" >{{doneTotalActions}}</li>
          <li class="list-group-item text-center list-group-item-secondary">{{comment}}</li>
          <component :is="isToday ? 'button' : 'li'" v-for="actionObject in dailyChecklist" v-on:click="checkAction(actionObject.action)"  class="list-group-item text-center action" v-bind:class= "{checkActionButton : isToday, 'list-group-item-success' : actionObject.isChecked}" >{{actionObject.action}}</component>
          <li v-show="onModification">Ciao</li>
          <button v-show="isToday" v-on:click="buttonFunction">{{buttonText}}</button>
        </ul>
      </div>
  </div>
</template>

<script>
import userService from '../../services/userService'
import router from '../router'
export default {
  name: 'DailyChecklist',
  props: ['day'],
  data () {
    return {
      user: 'marco_bz',
      thisDay: this.day,
      isToday: null,
      dailyChecklist: [],
      isChecked: {},
      doneTotalActions: null,
      comment: null,
      buttonText: "Modify Checklist",
      onModification: false
    }
  },

  mounted () {
    this.getDailyChecklist()
    this.isToday = this.checkIfIsToday()
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

    buttonFunction(){
      if(!this.onModification) this.modifyChecklist()
      else this.submitChanges()
    },

    submitChanges(){
      this.onModification = false
      this.buttonText = "Modify Checklist"
    },

    modifyChecklist(){
      this.onModification = true
      this.buttonText = "Submit Changes"
    },

    async checkAction(action){
      let actionObject = this.dailyChecklist.find(c => c.action === action)
      let value
      if (actionObject.isChecked) value = false
      else value = true
      let requestData = { "1" : 
                          {
                            "op" : "replace",
                            "path" : "/" + String(action),
                            "value" : value
                          }
                        }
      const addRequest = await userService.patchDailyChecklist(this.user, this.day, requestData)
      actionObject.isChecked = value
      this.defineDoneTotalActions()
      this.defineComment()
    },

    getDate () {
        let today = new Date().toISOString()
        let todayFormatted = today.split('T')[0].split('-')[2] + '.' + today.split('T')[0].split('-')[1] + '.' + today.split('T')[0].split('-')[0]
        return todayFormatted
    },

    checkIfIsToday(){
      if (this.getDate() === this.thisDay) return true
      else return false
    },

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
        if (response.data.message === 'Found checklist') {
          for (let action in response.data.content.checklist ){
            let actionObject = {
              action: action,
              isChecked: response.data.content.checklist[action],
              isAdded: false,
              isRemoved: false
            }
            this.dailyChecklist.push(actionObject)
          }
          console.log(this.dailyChecklist)
          this.defineDoneTotalActions()
          this.defineComment()
          }
      }
    },

    defineComment(){
      let totalActions = 0
      let checkedAction = 0
      for (let actionObject in this.dailyChecklist){
          totalActions += 1
          if (this.dailyChecklist[actionObject].isChecked) checkedAction += 1
      }      
      let perc = 100 * parseInt(checkedAction) / parseInt(totalActions)
      if (perc == 0) this.comment    = "Start Doing Something!!!" // a 
      else if ( perc > 0  && perc <= 20 ) this.comment    = "Are you serious?" // b 
      else if ( perc > 20  && perc <= 40 ) this.comment    = "Come on!" // c 
      else if ( perc > 40  && perc <= 60 ) this.comment    = "You can do better" // d
      else if ( perc > 60  && perc <= 80 ) this.comment    = "You are doing fine" // e 
      else if ( perc > 80  && perc < 100 ) this.comment    = "Almost done everything" // f 
      else if ( perc == 100 ) this.comment    = "Perfect Day" // g    
      
    },

    defineDoneTotalActions(){
      let totalActions = 0
      let checkedAction = 0
      for (let actionObject in this.dailyChecklist){
          totalActions += 1
          if (this.dailyChecklist[actionObject].isChecked) checkedAction += 1
      }
      this.doneTotalActions = String(checkedAction) + "/" + String(totalActions)      
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
