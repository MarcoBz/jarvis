<template>
  <div id="app">
    <div id="header">
      <div class="row border-bottom border-width">
        <h1>JARVIS</h1>
      </div>
    </div>
    <div id="main">
      <div class="container">
        <div class="row">
          <div class="col col-2">
          </div>
          <div class="col col-8">
            <router-view />
          </div>
          <div class="col col-2">
          </div>
        </div>
      </div>
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

.border-width{
    border-width: thick;
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
  background-color: : red;
   position:fixed;
   left:0px;
   bottom:0px;
   height:80px;
   width:100%;
   background:#999;
}
</style>
