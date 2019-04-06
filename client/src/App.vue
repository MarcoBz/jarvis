<template>
  <div id="app">
    <div id="header" >
      <div class="container border-header">
        <div class="row">
          <div class="col col-2">
            <h2>JARVIS</h2>
          </div>
          <div class="col col-8">
            <h1 v-html = "room"></h1>
          </div>
          <div class="col col-2">
          </div>
        </div>
      </div>
    </div>
    <div id="main">
      <div class="container">
        <div class="row">
          <div class="col col-2">
          </div>
          <div class="col col-8">
            <router-view @changeRoom="changeTitle" />
          </div>
          <div class="col col-2">
          </div>
        </div>
      </div>
    </div>
    <div id="footer">
      Powered By MarcoBz
    </div>
  </div>
</template>

<script>
import userService from '../services/userService'
import router from './router'
export default {
  name: 'App',
  data () {
    return {
      room: "Login"
    }
  },

  mounted(){
    router.push('/Login')
  },

  methods: {
    changeTitle(title) {
      this.room = title
    }


  }
}
</script>

<style scoped>

#header{
  padding: 50px;
}

.border-header{
  border-bottom:  3px solid black;
}

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
   height:40px;
   width:100%;
   background:#999;
}
</style>
