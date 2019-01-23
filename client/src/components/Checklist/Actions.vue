<template>
  <div>
    <table class="table table-striped table-dark">
      <thead>
        <tr>
          <th scope="col">Action</th>
          <th scope="col">Total Days</th>
          <th scope="col">Checked Days</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="action in allActions">
          <th scope="row">{{action.action}}</th>
          <td>{{action.totalDays}}</td>
          <td>{{action.checkedDays}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import userService from '../../../services/userServiceChecklist'
  import router from '../../router'
  export default {
    name: 'Actions',
    data () {
      return {
        user: 'marco_bz',
        allActions: null
      }
    },
  
    mounted () {
      this.getAllActions()
    },

    methods: {
      async getAllActions () {
        let response
        try{
          
          response = await userService.fetchAllActions(this.user)
        }
        catch (err){
          response = err.response
        }
        finally {
          console.log(response)
          this.allActions = response.data.content
        }
      }
    }
  }

</script>

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
