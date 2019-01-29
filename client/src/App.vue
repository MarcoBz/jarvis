<template>
  <div id="app">
    <div id="header">
      <h1>JARVIS</h1>
    </div>
    <div id="main">
      <router-view />
    </div>
    <!-- <div id="footer">
      Powered By MarcoBz
    </div> -->
  </div>
</template>

<script>
import userService from '../services/userService'
import router from './router'
export default {
  name: 'App',
  data () {
    return {

    }
  },

  mounted(){
    router.push('/Login')
  },

  // methods: {



  // }
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
