<template>
  <div class="container-fluid">
      <div class = "row">
        <div class = "col col-sm-6 text-center">
          <input  id="userName" v-model="user"  placeholder="User Name" v-bind:class="{ 'border border-danger' :userError}" v-on:keydown="deleteBorder()">
        </div>
        <div class = "col col-sm-6 text-left">
         <button class = "btn-light" v-on:click="getUser()">Login</button>
        </div>
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
