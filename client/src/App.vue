<template>
  <div id="app">
    <div id="header">
      <h1>JARVIS</h1>
    </div>
    <div id="main">
      <div class="container" v-show="userExist">
          <div class = "row">
            <input  id="userName" v-model="user" class = "col col-2 text-center" placeholder="User Name" v-bind:class="{ 'border border-danger' :userError}" v-on:keydown="deleteBorder()">
            <button class = "col col-2 bg-light" v-on:click="getUser()"></button>
          </div>
      </div>
      <router-view :key="$route.fullPath"></router-view>
    </div>
    <div id="footer">
      Powered By MarcoBz
    </div>
  </div>
</template>

<script>
import ChecklistIndex from './components/Checklist/ChecklistIndex' 
import userService from '../services/userService'
import router from './router'
export default {
  name: 'App',
  components: {ChecklistIndex},
  data () {
    return {
      user: null,
      userError: false,
      userExist: false
    }
  },

  methods: {

    async getUser () {
      let response
      try{
        response = await (userService.fetchUser(this.user))
      }
      catch (err){
        response = err.response
      }
      finally {
        if (response.data.content) {
          this.userExist = true
          router.push(('/Home'))  
          }
        else {
          this.user = null
          this.userError = true
          }
      }
      
      
    },

    deleteBorder(){
      this.userError = false
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
