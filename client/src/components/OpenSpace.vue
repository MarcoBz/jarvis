<template>
  <div v-if="isReady" class="container-fluid">
        <!-- <input  id="userName" v-model="user" class = "col col-2 text-center" placeholder="User Name" v-bind:class="{ 'border border-danger' :userError}" v-on:keydown="deleteBorder()">
        <button class = "col col-2 bg-light" v-on:click="getUser()"></button> -->
        <div v-for = "room in rooms" class="row">

          <div class = "col">           
             <button class="btn" v-on:click= "goTo(room.room)" :disabled = "!room.open">{{room.room}}</button>
          </div>

        </div>
  </div>
</template>

<script>
  import userService from '../../services/userService'
  import router from '../router'
  import rooms from '../rooms'
  export default {
    name: 'Login',
    props: ['currentUser'],
    data () {
      return {
        user: this.currentUser,
        rooms: [],
        userRooms: [],
        isReady: false
      }
    },

    async mounted () {
      let response
      try{
        response = await (userService.fetchUser(this.user))
      }
      catch (err){
        response = err.response
      }
      finally {
        
        if (response.data.content) {
            this.userRooms = response.data.content.rooms
            for (let i = 0; i < rooms.length; i++){
              if (this.userRooms.includes(rooms[i])){
                this.rooms.push({
                  room: rooms[i],
                  open: true
                })
              }
              else{ 
                this.rooms.push({
                      room: rooms[i],
                      open: false
                })
              }
            }
            this.isReady = true
        }
        else {
        }
      }
    },

    methods: {

      goTo(room){
        this.$emit('changeRoom', room)
        //let path = "/" + String(room)
        let pathName = String(room)
        router.push({ name : pathName, params : { currentUser : this.user }})
      },

      deleteBorder(){
        this.userError = false
      }
    }
  }
</script>

<style>

</style>
