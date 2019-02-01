<template>
  <div id="DailyChecklist">
    <div v-html="thisDay" class="justify-content-md-center"></div>


      <div class = "container">
        <div class = "row">
          <div class = "col col-6 text-center bg-secondary">{{doneTotalActions}}</div>
        </div>
        <div class = "row">
          <div class = "col col-6 text-center bg-secondary">{{comment}}</div>
        </div>

        <div class = "row"  v-for="actionObject in dailyChecklist">
          <component :is="isToday ? 'button' : 'div'" v-on:click="checkAction(actionObject.action)"  v-bind:class= "{checkActionButton : isToday, 'bg-success' : actionObject.isChecked, 'bg-gradient-primary' : actionObject.isRemoved}" >
            <div class="col col-6 text-center action">{{actionObject.action}}</div>
          </component>
          <button v-show="onModification" class = "col col-1" v-bind:class = "(actionObject.isRemoved ? 'bg-light' : 'bg-dark')" v-on:click="removeAction(actionObject.action)"></button>
        </div>
        <div class = "row">
          <input id="addActionInput" v-show="onModification" v-model="addedAction" class = "col col-6 text-center" placeholder="Add action to the checklist">
          <button v-show="onModification" class = "col col-1 bg-light" v-on:click="addAction()"></button>
        </div>
        <div class = "row">
          <button v-show="isToday" class = "col col-6 text-center" v-on:click="buttonFunction">{{buttonText}}</button> 
          <button v-show="onModification" class = "col col-1 bg-danger" v-on:click="cancelModification()">Cancel</button>
        </div>        
      </div>
  </div>
</template>

<script>
  import userService from '../../../services/userServiceChecklist'
  import router from '../../router'
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
        onModification: false,
        addedAction: ""
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
        if (checkExistence ) next()
        else next('/Checklist')
      })
  },

    methods: {

      addAction(){
        this.dailyChecklist.push({
                action: this.addedAction,
                isChecked: false,
                isAdded: true,
                isRemoved: false 
        })
        this.addedAction = ""
        this.defineDoneTotalActions()
        this.defineComment()
      },

      removeAction(action){
        
        let actionObject = this.dailyChecklist.find(c => c.action === action)
        if (actionObject.isRemoved) actionObject.isRemoved = false
        else actionObject.isRemoved = true
      },

      buttonFunction(){
        if(!this.onModification) this.modifyChecklist()
        else this.submitChanges()
      },

      cancelModification(){
        let indexCount = 0
        for(let action in this.dailyChecklist){
          this.dailyChecklist[action].isRemoved = false
          if (this.dailyChecklist[action].isAdded){
            this.dailyChecklist.splice(indexCount, 1)
          }
          indexCount++
        }
        this.addedAction = ""
        this.onModification = false
      },

      async submitChanges(){

        let requestData = {}
        let count = 1
        let indexCount = 0
        for(let action in this.dailyChecklist){
          if (this.dailyChecklist[action].isRemoved && !this.dailyChecklist[action].isAdded){
            requestData[count] =  {
                                    "op" : "remove",
                                    "path" : "/" + String(this.dailyChecklist[action].action)
                                  }
            count++
            this.dailyChecklist.splice(indexCount, 1)
          }
          else if (!this.dailyChecklist[action].isRemoved && this.dailyChecklist[action].isAdded){
            requestData[count] =  {
                                    "op" : "add",
                                    "path" : "/" + String(this.dailyChecklist[action].action)
                                  }
            count++
            this.dailyChecklist[action].isAdded = false
          }
          else if (this.dailyChecklist[action].isRemoved && this.dailyChecklist[action].isAdded){
            this.dailyChecklist.splice(indexCount, 1)
          }
          indexCount++
        }
        const addRequest = await userService.patchDailyChecklist(this.user, this.day, requestData)
        this.addedAction = ""
        this.onModification = false
        this.buttonText = "Modify Checklist"
        this.defineDoneTotalActions()
        this.defineComment()
      
      },

      modifyChecklist(){
        this.onModification = true
        this.buttonText = "Submit Changes"
      },

      async checkAction(action){
        if (!this.onModification && this.isToday){        
          let actionObject = this.dailyChecklist.find(c => c.action === action)
          let value
          if (actionObject.isChecked) value = false
          else value = true
          let requestData = {}
          requestData[1] = {
                                "op" : "replace",
                                "path" : "/" + String(action),
                                "value" : value
                            }
          const addRequest = await userService.patchDailyChecklist(this.user, this.day, requestData)
          actionObject.isChecked = value
          this.defineDoneTotalActions()
          this.defineComment()
          }
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
            this.defineDoneTotalActions()
            this.defineComment()
            }
        }
      },

      async checkExistenceChecklist(){
        let response
        try{
          response = await userService.fetchDailyChecklist(this.user, this.thisDay)
          console.log(response)
        }
        catch (err){
          response = err.response
        }
        finally {
          if (response.data.content) return true
          else return false
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
        if (perc == 0 || (parseInt(checkedAction) == 0 && parseInt(totalActions) == 0)) this.comment    = "Start Doing Something!!!" // a 
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
