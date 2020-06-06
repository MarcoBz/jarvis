<template>
    <div id="searchtvseries" class="container">
        <div class = "row">
          <div class = "col col-sm-6 text-center">
            <input type="text" placeholder="Search Title.."  v-model="title">
          </div>
          <div class = "col col-sm-6 text-left">
            <button v-on:click="searchTvSeries">Search</button>
          </div>
        </div>
        <div v-show="isSearchEnded" class="row"  v-for="result in searchResults">
                <div class="col col-10 text-center" >
                  <b><p><u>"{{result.title}}"</u> ({{result.airDate}} - {{result.country}})</p></b>
                  <p>{{result.overview}}</p>
                </div>
                <div class="col col-2 text-left">
                  <button class="btn" v-bind:disabled= "result.isAdded" v-bind:class= "{'btn-success' : result.isAdded}" v-on:click="addTvSeries(result.tmdbID)">{{result.message}}</button>
                </div>
        </div>
    </div>
</template>

<script>
import tmdbService from '../../../services/tmdbService'
import userServiceTmdb from '../../../services/userServiceTmdb'
import userServiceTvSeries from '../../../services/userServiceTvSeries'
import router from '../../router'
export default {
  name: "SearchTvSeries",
  props: ['currentUser'],
  data () {
    return {
      user: this.currentUser,
      title: null,
      searchResults: [],
      isSearchEnded: false
    }
  },

  methods: {

    async searchTvSeries () {   
      let response
      try{
        response = await tmdbService.searchTvSeries(this.title)
      }
      catch (err){
        response = err.response
      }
      finally {

        if (response.status === 200){

          this.searchResults = []
          for (let i = 0; i < response.data.results.length; i++){
            let result = {
              tmdbID: response.data.results[i].id,
              title: response.data.results[i].original_name,
              airDate: response.data.results[i].first_air_date.split('-')[0],
              country: response.data.results[i].origin_country.join(),
              overview: response.data.results[i].overview,
              message: "Add",
              isAdded: false
            }
            this.searchResults.push(result)
            
            this.title = null
          }
          let userResponse
          try{
              userResponse = await userServiceTvSeries.fetchAll(this.user)
          }
          catch(err){
            userResponse = err.response
          }
          finally{
              if (userResponse.status === 200){
                for (let i = 0; i < userResponse.data.content.all.length; i++){
                  if(this.searchResults.find( c => c.tmdbID === parseInt(userResponse.data.content['all'][i].tmdbID))){
                    this.searchResults.find( c => c.tmdbID === parseInt(userResponse.data.content['all'][i].tmdbID)).message = "Added"
                    this.searchResults.find( c => c.tmdbID === parseInt(userResponse.data.content['all'][i].tmdbID)).isAdded = true

                  }
                }
              }
          }

          this.isSearchEnded= true
        }
      }
    },

    async addTvSeries(tmdbID){
      let response
      try{
        response = await userServiceTmdb.addTvSeries(tmdbID)
      }
      catch (err){
        error = err.response
      }
      finally {
        if (response.status == 200 || response.status == 201){
          let userResponse
          try{
            userResponse = await userServiceTvSeries.addTvSeries(this.user, tmdbID)
          }
          catch (err){
            userResponse = err.response
          }
          finally {
              // if (userResponse.status == 200){
              //   router.push({ name: 'WatchList', params: {currentUser: this.user }})
              // }
              this.searchResults.find( c => c.tmdbID === tmdbID).message = "Added"
              this.searchResults.find( c => c.tmdbID === tmdbID).isAdded = true
          }      
        }
      }
    }

  }
}
</script>

<style>

</style>
