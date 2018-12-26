<template>
    <div id="StartNewDay">
        <div class="row justify-content-md-center">
            <div class="col col-lg-2">
                <button id="startNewDayId" class="btn btn-outline-success startNewDayButton bg-light" v-on:click="startNewDailyChecklist">Start New Day</button>
            </div>
        </div>
    </div>
</template>

<script>
import userService from '../../services/userService'
import router from '../router'
export default {
  name: 'StartNewDay',
  props: ['day', 'lastday'],
  data () {
    return {
        user: '1'
    }
  },

  methods: {

      test () {
           router.go('/');
      },

    async startNewDailyChecklist () {    
      let response
      try{
        response = await userService.fetchDailyChecklist(this.user, this.lastday)
        console.log(response)
      }
      catch (err){
        response = err.response
      }
      finally {
        let lastDailyChecklist 
        if (response.data.message === 'Found day') {
            lastDailyChecklist = response.data.content
            let requestData = {
                            "op" : 'add',
                            "path" : '/' + this.day,
                            "value" : lastDailyChecklist
                        }
            const addRequest = await userService.addDailyChecklist(this.user, requestData)
            console.log(addRequest)
            router.go('/');
        }
      }
    }
  }
}
</script>

<style>

</style>
