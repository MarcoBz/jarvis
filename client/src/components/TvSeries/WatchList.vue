<template>
    <div id="watchlist">
      <div v-if="isReady" class="container">
        <div v-for= "title in tvSeries" class= "row">
          <div class= "col col-12">
            <button class="btn" v-on:click = "getTvSeriesDetails(title.tmdbID)">{{title.title}}</button>
          </div>
        </div>
      </div>
      <div v-if="showModal">
        <transition name="modal">
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <div class="container-fluid">
                      <div class="row justify-content-md-center">
                        <div class="col-md-12"><h3 class="modal-title">{{tvSeriesDetails.title}}</h3> </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-body">
                    <div class="container-fluid">
                      <div class="row justify-content-md-center">
                        <div class="col-md-12">
                          <span v-for= "genre in tvSeriesDetails.genres">{{genre}} </span> 
                        </div>
                      </div>
                      <hr>
                      <div class="row justify-content-md-center">
                        <div class="col-md-12">
                          <span v-for= "network in tvSeriesDetails.networks">{{network}} </span> 
                        </div>
                      </div>
                      <hr>
                      <div class="row justify-content-md-center" v-for= "season in tvSeriesDetails.seasons" >
                        <div class="col-md-12">
                          Season {{season.seasonNumber}} : {{season.numEpisodes}} Episodes
                        </div>
                      </div>   
                      <hr>
                      <div class="row justify-content-md-center" v-if="tvSeriesDetails.lastEpAired.airDate">
                        <div class="col-md-12">
                          Last Episode : S{{tvSeriesDetails.lastEpAired.seasonNumber}}E{{tvSeriesDetails.lastEpAired.episodeNumber}} - {{tvSeriesDetails.lastEpAired.airDate}}
                        </div>
                      </div>
                      <div class="row justify-content-md-center" v-else>
                        <div class="col-md-12">
                          Last Episode : --
                        </div>
                      </div>
                      <hr>
                      <div class="row justify-content-md-center" v-if="tvSeriesDetails.nextEpAired.airDate">
                        <div class="col-md-12">
                          Next Episode : S{{tvSeriesDetails.nextEpAired.seasonNumber}}E{{tvSeriesDetails.nextEpAired.episodeNumber}} - {{tvSeriesDetails.nextEpAired.airDate}}
                        </div>
                      </div>    
                      <div class="row justify-content-md-center" v-else>
                        <div class="col-md-12">
                          Next Episode : --
                        </div>
                      </div>                 
                    </div>
                  </div>
                  <div class="modal-footer">
                    <div class="container-fluid">
                      <div class="row justify-content-md-center">
                        <div class="col-md-4">
                          <button type="button" class="close" @click="showModal=false">
                            <!-- <span aria-hidden="true">&times;</span> -->
                            <span aria-hidden="true">Close</span> 
                          </button>                          
                        </div>
                        <div class="col-md-4">
                          <button type="button" class="close" v-on:click= "changeTvSeriesStatus(tvSeriesDetails.tmdbID)">
                            <!-- <span aria-hidden="true">&times;</span> -->
                            <span aria-hidden="true">Start</span> 
                          </button> 
                        </div>
                        <div class="col-md-4">
                          <button type="button" class="close"@click="deletingTvSeries=true">
                            <!-- <span aria-hidden="true">&times;</span> -->
                            <span aria-hidden="true">Delete</span> 
                          </button> 
                        </div>
                      </div>
                      <div v-if="deletingTvSeries" class="row justify-content-md-center">
                        <div class="col-md-4">
                          <div class="col-md-12"><h4 class="modal-title">Are You Sure?</h4> </div>
                        </div>
                      </div>
                      <div v-if="deletingTvSeries" class="row justify-content-md-center">
                        <div class="col-md-6 justify-content-md-center">
                          <button type="button" class="close" v-on:click="deleteTvSeries">
                            <!-- <span aria-hidden="true">&times;</span> -->
                            <span aria-hidden="true">Yes</span> 
                          </button> 
                        </div>
                        <div class="col-md-6 justify-content-md-center">
                          <button type="button" class="close" @click="deletingTvSeries=false">
                            <!-- <span aria-hidden="true">&times;</span> -->
                            <span aria-hidden="true">No</span> 
                          </button> 
                        </div>
                      </div>
                    </div>  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
</template>

<script>
import tmdbService from '../../../services/tmdbService'
import userServiceTmdb from '../../../services/userServiceTmdb'
import userServiceTvSeries from '../../../services/userServiceTvSeries'
import router from '../../router'
export default {
  name: "WatchList",
  props: ['currentUser'],
  data () {
    return {
      user: this.currentUser,
      tvSeries: null,
      isReady: false,
      showModal: false,
      tvSeriesDetails: {},
      deletingTvSeries: false
    }
  },

  async mounted(){
    let response 
    try{
        response = await userServiceTvSeries.fetchWatchList(this.user)
    }
    catch (err){
      response = err.response
    }
    finally {

      if (response.status === 200){
        let watchListTmdbID = []
        for ( let i in response.data.content.watchList) watchListTmdbID.push(response.data.content.watchList[i])
        let responseTmdb
        try{
            responseTmdb = await userServiceTmdb.fetchTvSeriesTitles(watchListTmdbID)
        }
        catch (err){
          responseTmdb = err.response
        }
        finally {
          if (responseTmdb.status === 200){
            this.tvSeries = responseTmdb.data.content.tvSeries
            this.isReady = true
          }
        }
      }
    }
  },

  methods: {

    async deleteTvSeries(){

    },

    async changeTvSeriesStatus(tmdbID){
      let response 
        try{
          let body = {
            "0" : {
              op: "replace",
              value: "watching",
              path: "status"
            }
          }
          response = await userServiceTvSeries.patchTvSeries(this.user, tmdbID, body)
          
        }
        catch (err){
          response = err.response
        }   
        finally {
          if (response.status === 200){
            this.tvSeriesDetails = {}
            this.tvSeries.splice((this.tvSeries.indexOf(this.tvSeries.find(c => c.tmdbID == tmdbID))), 1)
            this.showModal = false
            router.push({ name: 'OnWatch', params: {currentUser: this.user }})
          } 
        }  
    },

    async getTvSeriesDetails(tmdbID){
      let response 
        try{
            response = await userServiceTmdb.fetchTvSeriesDetails(tmdbID)
        }
        catch (err){
          response = err.response
        }   
        finally {

          if (response.status === 200){
            this.tvSeriesDetails =  response.data.content
            this.tvSeriesDetails.title = this.tvSeries.find(c => c.tmdbID == tmdbID).title
            this.tvSeriesDetails.tmdbID = tmdbID
            this.showModal = true
          } 
        }  
    }
  }
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>
