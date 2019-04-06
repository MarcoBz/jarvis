<template>
  <div class="container">
      <div class = "row">
        <input  id="userName" v-model="user" class = "col col-2 text-center" placeholder="User Name" v-bind:class="{ 'border border-danger' :userError}" v-on:keydown="deleteBorder()">
        <button class = "col col-2 bg-light" v-on:click="getUser()"></button>
      </div>
  </div>
</template>

<script>
  import userService from '../../services/userService'
  import router from '../router'
  export default {
    name: 'Login',
    data () {
      return {
        user: null,
        userError: false,
        userExist: false
      }
    },
    mounted () {

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
              this.$emit('changeRoom', 'Open-Space')
              router.push({ name: 'OpenSpace', params: { currentUser : this.user }})  
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

</style>
