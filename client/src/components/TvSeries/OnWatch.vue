<template>
    <div id="onwatch">
      <div v-if="isReady" class="container">
        <div v-for= "title in tvSeries">
          <div class= "row">
            <div class= "col col-3">
            </div>
            <div class = "col col-md-2">
              <button v-on:click = "getTvSeriesSeasons(title.tmdbID)" class="btn btn-info">Your Ride</button>
            </div>
            <div class= "col col-4">
              <button v-on:click = "getTvSeriesDetails(title.tmdbID)" class="btn btn-light">{{title.title}}</button>
            </div>
            <div class= "col col-3">
            </div>
          </div>
          <div v-if= "title.isClicked">             
            <div v-for= "season in title.seasons">
              <div class="row justify-content-md-center">
                <div class = "col col-md-12">
                  <button class="btn" v-bind:disabled= "!season.isAired" v-bind:class= "{'btn-success' : season.isCompleted, 'btn-warning' : season.isOnWatch}" @click="showSeasonModal = true; currentTmdbID = title.tmdbID; currentSeason = season.seasonNumber" >Season {{season.seasonNumber}}</button>
                </div>
              </div>

              <div class="row justify-content-md-center">
                <div class = "col col-md-12">
                  <span v-for= "episode in season.episodes">
                    <button class="btn" v-bind:disabled= "!episode.isAired" v-bind:class= "{'btn-success' : episode.isWatched, 'btn-warning' : episode.isPaused}" v-on:click = "clickEpisode(title.tmdbID, season.seasonNumber, episode.episodeNumber)">{{episode.episodeNumber}}</button>
                  </span> 
                </div>                
              </div>
              <hr>
            </div>
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
                            <span aria-hidden="true">Forget</span> 
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
                          <button type="button" class="close" v-on:click="deleteTvSeries(tvSeriesDetails.tmdbID)">
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
              <div v-if="showSeasonModal">
                <transition name="modal">
                  <div class="modal-mask">
                    <div class="modal-wrapper">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-body">
                            <div class="container-fluid">
                              <div class="row justify-content-md-center">
                                <div class="col-md-4">
                                  <div class="col-md-12"><h4 class="modal-title">Are You Sure?</h4> </div>
                                </div>
                              </div>
                              <div class="row justify-content-md-center">
                                <div class="col-md-6 justify-content-md-center">
                                  <button type="button" class="close" v-on:click= "clickSeason(currentTmdbID, currentSeason)">
                                    <span aria-hidden="true">Yes</span> 
                                  </button> 
                                </div>
                                <div class="col-md-6 justify-content-md-center">
                                  <button type="button" class="close" @click="showSeasonModal = false; currentTmdbID = null; currentSeason = null">
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
  name: "OnWatch",
  props: ['currentUser'],
  data () {
    return {
      delay: 300,
      clicks: 0,
      timer: null,
      user: this.currentUser,
      tvSeries: [],
      isReady: false,
      showModal: false,
      showSeasonModal: false,
      tvSeriesDetails: {},
      deletingTvSeries: false,
      currentTmdbID:null,
      currentSeason: null
    }
  },

  async mounted(){
    let response 
    try{
        response = await userServiceTvSeries.fetchOnWatch(this.user)
    }
    catch (err){
      response = err.response
      console.log(response)
    }
    finally {

      if (response.status === 200){
        let onWatchTmdbID = []
        for ( let i in response.data.content.onWatch) onWatchTmdbID.push(response.data.content.onWatch[i])
        if(onWatchTmdbID.length > 0){
        let responseTmdb
          try{
              responseTmdb = await userServiceTmdb.fetchTvSeriesTitles(onWatchTmdbID)
          }
          catch (err){
            responseTmdb = err.response
          }
          finally {
            if (responseTmdb.status === 200){

              for (let i = 0; i < responseTmdb.data.content.tvSeries.length; i++){
                this.tvSeries.push({
                  title: responseTmdb.data.content.tvSeries[i].title,
                  tmdbID: responseTmdb.data.content.tvSeries[i].tmdbID,
                  isClicked: false,
                  seasons: []
                })
              }
              this.isReady = true
            }
          }
        }
      }
    }
  },

  methods: {


    async clickSeason(tmdbID, seasonNumber){
      this.showSeasonModal = false
      let season = this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber)
      let statusValue = null
      if (season.isCompleted){
        statusValue = '0'
      }
      else{
        statusValue = '1'
      }
      let response 
      try{
        let body
        if (season.isSaved){
          body = {
            '0' : {
              op: 'replace',
              path: 'season/' + season.seasonNumber + '/statusSeason',
              value: statusValue
            }
          }
        }
        else{
          body = {
            '0' : {
              op: 'add',
              path: 'season/' + season.seasonNumber ,
              value: statusValue
            }
          }         
        }  
        response = await userServiceTvSeries.patchTvSeries(this.currentUser, tmdbID, body)   
      }
      catch (err){
        response = err.response
        console.log(response)
      } 
      finally{
        if (response.status === 200){
          let startingEpisode = null 
          let endingEpisode = null
          let episodeResponse
          for (let i = 0; i < season.numEpisodes; i++  ){
            let episode = season.episodes.find( c => c.episodeNumber == i + 1)
            if (episode.isAired && !startingEpisode && !endingEpisode) startingEpisode = i+1
            if (!episode.isAired && startingEpisode && !endingEpisode) endingEpisode = i
            if ( i + 1 == season.numEpisodes && startingEpisode && !endingEpisode) endingEpisode = i+1
          }
          try{
            let episodeBody = {
              '0' : {
                op: 'replace',
                path: 'season/' + season.seasonNumber + '/episode/' + startingEpisode + '/' + endingEpisode,
                value: statusValue
              }
            }
            episodeResponse = await userServiceTvSeries.patchTvSeries(this.currentUser, tmdbID, episodeBody)
          }
          catch (err){
            episodeResponse = err.response
            console.log(response)
          }
          finally{
            if (episodeResponse.status === 200){

              for (let i = 0; i < season.numEpisodes; i++  ){
                let episode = season.episodes.find( c => c.episodeNumber == i + 1)
                if (episode.isAired){
                  if (season.isCompleted){
                    episode.isWatched = false
                    episode.isPaused = false
                  }
                  else{
                    episode.isWatched = true
                    episode.isPaused = false
                  }
                }

              }
            }
          }
          // for (let i = 0; i < season.numEpisodes; i++  ){
          //   let episodeResponse
          //   let episode = season.episodes[i]
          //   if (episode.isAired){
          //     try{
          //       let episodeBody
          //       if (episode.isSaved){
          //         episodeBody = {
          //           '0' : {
          //             op: 'replace',
          //             path: 'season/' + season.seasonNumber + '/episode/' + episode.episodeNumber + '/statusEpisode',
          //             value: statusValue
          //           }
          //         }
          //       }
          //       else{
          //         episodeBody = {
          //           '0' : {
          //             op: 'add',
          //             path: 'season/' + season.seasonNumber + '/episode/' + episode.episodeNumber ,
          //             value: statusValue
          //           }
          //         }         
          //       }  
          //       episodeResponse = await userServiceTvSeries.patchTvSeries(this.currentUser, tmdbID, episodeBody) 
          //     }
          //     catch (err){
          //       episodeResponse = err.response
          //     }
          //     finally{
          //       if (episodeResponse.status === 200){
          //         if (season.isCompleted){
          //           episode.isWatched = false
          //           episode.isPaused = false
          //         }
          //         else{
          //           episode.isWatched = true
          //           episode.isPaused = false
          //         }
          //       }
          //     }
          //   }

          // }
          if (season.isCompleted){
            season.isCompleted = false
            season.isOnWatch = false
          }
          else{
            season.isCompleted = true
            season.isOnWatch = false
          }  
          season.isSaved = true
        }
      }
    },
    async clickEpisode(tmdbID, seasonNumber, episodeNumber){
      this.clicks++ 
        if(this.clicks === 1) {
          this.timer = setTimeout(() => {
            this.singleClickEpisode(tmdbID, seasonNumber, episodeNumber)
            this.clicks = 0
          }, this.delay);
        } else{
            clearTimeout(this.timer);  
            this.dblClickEpisode(tmdbID, seasonNumber, episodeNumber);
            this.clicks = 0;
        }  
    },
    async dblClickEpisode(tmdbID, seasonNumber, episodeNumber){
      let season = this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber)
      let episode = season.episodes.find(f => f.episodeNumber == episodeNumber)

      if (!episode.isPaused){
        let statusValue = '-1'
        let response 
        try{
          let body
          if (episode.isSaved){
            body = {
              '0' : {
                op: 'replace',
                path: 'season/' + season.seasonNumber + '/episode/' + episode.episodeNumber + '/statusEpisode',
                value: statusValue
              }
            }
          }
          else{
            body = {
              '0' : {
                op: 'add',
                path: 'season/' + season.seasonNumber + '/episode/' + episode.episodeNumber ,
                value: statusValue
              }
            }         
          }  
          response = await userServiceTvSeries.patchTvSeries(this.currentUser, tmdbID, body)   
        }
        catch (err){
          response = err.response
          console.log(response)
        } 

        finally{
          
          if (response.status === 200){
            episode.isPaused = true
            episode.isWatched = false
          }
          episode.isSaved = true
          season.isSaved = true

          let seasonResponse

          try{
            let body = {
              '0' : {
                op: 'replace',
                path: 'season/' + season.seasonNumber + '/statusSeason',
                value: '-1'
              }
            }
            seasonResponse  = await userServiceTvSeries.patchTvSeries(this.currentUser, tmdbID, body)
          }
          catch (err){
            seasonResponse  = err.response
          }   
          finally {

            if (seasonResponse.status === 200){
              season.isCompleted = false
              season.isOnWatch = true
            } 
          }  
        }
      }
    },
    async singleClickEpisode(tmdbID, seasonNumber, episodeNumber){
      let season = this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber)
      let episode = season.episodes.find(f => f.episodeNumber == episodeNumber)

      let statusValue = null
      if (episode.isWatched){
        statusValue = '0'
      }
      else{
        statusValue = '1'
      }
      let response 
      try{
        let body
        if (episode.isSaved){
          body = {
            '0' : {
              op: 'replace',
              path: 'season/' + season.seasonNumber + '/episode/' + episode.episodeNumber + '/statusEpisode',
              value: statusValue
            }
          }
        }
        else{
          body = {
            '0' : {
              op: 'add',
              path: 'season/' + season.seasonNumber + '/episode/' + episode.episodeNumber ,
              value: statusValue
            }
          }         
        }  
        response = await userServiceTvSeries.patchTvSeries(this.currentUser, tmdbID, body)   
      }
      catch (err){
        response = err.response
        console.log(response)
      } 

      finally{  
        if (response.status === 200){
          if (episode.isWatched){
            episode.isWatched = false
            episode.isPaused = false
          }
          else{
            episode.isWatched = true
            episode.isPaused = false
          }
        }
        episode.isSaved = true
        season.isSaved = true

        let seasonIsCompleted = true
        let seasonIsStarted = false
        for (let i = 0; i < season.numEpisodes; i++){
          let checkEpisode = season.episodes.find( c => c.episodeNumber == i + 1)
          if (checkEpisode.isWatched || checkEpisode.isPaused) seasonIsStarted = true
          if (!checkEpisode.isWatched) seasonIsCompleted = false 
        }
        let seasonResponse 
        try{
          if (seasonIsStarted && !seasonIsCompleted) statusValue = '-1'
          else if (seasonIsCompleted) statusValue = '1'
          else statusValue = '0'
          let body = {
            '0' : {
              op: 'replace',
              path: 'season/' + season.seasonNumber + '/statusSeason',
              value: statusValue
            }
          }
          seasonResponse  = await userServiceTvSeries.patchTvSeries(this.currentUser, tmdbID, body)
        }
        catch (err){
          seasonResponse  = err.response
        }   
        finally {

          if (seasonResponse.status === 200){
            if (statusValue == '-1') {
              season.isCompleted = false
              season.isOnWatch = true
            }
            else if (statusValue == '0') {
              season.isCompleted = false
              season.isOnWatch = false
            }
            else if (statusValue == '1') {
              season.isCompleted = true
              season.isOnWatch = false
            }
          } 
        }  
      }

    },
    async deleteTvSeries(tmdbID){
      let response 
      try{
        let body = {
          "0" : {
            op: "remove"
          }
        }
        response = await userServiceTvSeries.patchTvSeries(this.user, tmdbID, body)
        
      }
      catch (err){
        response = err.response
        console.log(response)
      }   
      finally {

        if (response.status === 200){
          this.tvSeriesDetails = {}
          this.tvSeries.splice((this.tvSeries.indexOf(this.tvSeries.find(c => c.tmdbID == tmdbID))), 1)
          this.showModal = false
          this.deletingTvSeries = false
        } 
      }  
    },

    async changeTvSeriesStatus(tmdbID){
      let response 
      try{
        let body = {
          "0" : {
            op: "replace",
            value: "memory",
            path: "status"
          }
        }
        response = await userServiceTvSeries.patchTvSeries(this.user, tmdbID, body)
        
      }
      catch (err){
        response = err.response
        console.log(response)
      }   
      finally {

        if (response.status === 200){
          this.tvSeriesDetails = {}
          this.tvSeries.splice((this.tvSeries.indexOf(this.tvSeries.find(c => c.tmdbID == tmdbID))), 1)
          this.showModal = false
        } 
      }  
    },
    async getTvSeriesSeasons(tmdbID){
      this.tvSeries.find(c => c.tmdbID == tmdbID).seasons = []
      if (this.tvSeries.find(c => c.tmdbID == tmdbID).isClicked === false){
        let response 
          try{
              response = await userServiceTmdb.fetchTvSeriesSeasons(tmdbID)
          }
          catch (err){
            response = err.response
            console.log(response)
          }   
          finally {
            if (response.status === 200){
              
              for (let i = 0; i < response.data.content.seasons.length; i++){
                let season = response.data.content.seasons[i]
                let episodesArray = []
                
                for (let j = 0; j < season.numEpisodes; j++){
                  let episode = season.episodes.find( c => c.episodeNumber == j + 1)
                  episodesArray.push({
                    name: episode.name,
                    airDate: episode.airDate,
                    seasonNumber: episode.seasonNumber,
                    episodeNumber: episode.episodeNumber,
                    isWatched: false,
                    isPaused: false,
                    isSaved: false,
                    isAired: this.compareDate(episode.airDate)
                  })
                }
                this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.push({
                  airDate: season.airDate,
                  seasonNumber: season.seasonNumber,
                  numEpisodes: season.numEpisodes,
                  isOnWatch: false,
                  isCompleted: false,
                  isSaved: false,
                  episodes: episodesArray,
                  isAired: this.compareDate(season.airDate)
                })
              }
            }
            this.tvSeries.find(c => c.tmdbID == tmdbID).isClicked = true
            let userResponse 
              try{
                  userResponse = await userServiceTvSeries.fetchTvSeriesSeasons(this.currentUser, tmdbID)
              }
              catch (err){
                userResponse = err.response
                console.log(userResponse)
              }  
              
              finally {
                if (userResponse.status === 200){
                  for (let i = 0; i < userResponse.data.content.seasons.length; i++){
                    let season =  userResponse.data.content.seasons[i]
                    let seasonNumber = season.seasonNumber
                    this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).isSaved = true
                    if (season.statusSeason == '1'){
                      this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).isCompleted = true
                      this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).isOnWatch = false
                    }
                    else if (season.statusSeason == '-1'){
                      this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).isCompleted = false
                      this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).isOnWatch= true
                    }
                    else if (season.statusSeason == '0'){
                      this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).isCompleted = false
                      this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).isOnWatch = false
                    }
                    for (let j = 0; j < season.episodes.length; j++){
                      
                        let episode = season.episodes[j]
                        let episodeNumber = episode.episodeNumber
                        this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).episodes.find(f => f.episodeNumber == episodeNumber).isSaved = true
                        if (parseInt(episode.statusEpisode) == '1'){
                          this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).episodes.find(f => f.episodeNumber == episodeNumber).isWatched = true 
                          this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).episodes.find(f => f.episodeNumber == episodeNumber).isPaused = false
                        }
                        else if (parseInt(episode.statusEpisode) == '-1'){
                          this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).episodes.find(f => f.episodeNumber == episodeNumber).isWatched = false
                          this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).episodes.find(f => f.episodeNumber == episodeNumber).isPaused = true
                        }
                        else if (parseInt(episode.statusEpisode) == '0'){
                          this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).episodes.find(f => f.episodeNumber == episodeNumber).isWatched = false
                          this.tvSeries.find(c => c.tmdbID == tmdbID).seasons.find(d => d.seasonNumber == seasonNumber).episodes.find(f => f.episodeNumber == episodeNumber).isPaused = false
                        }
                    }
                  }
                }
              }
          }  
      }
      else{
        this.tvSeries.find(c => c.tmdbID == tmdbID).isClicked = false
      }
    },
    async getTvSeriesDetails(tmdbID){
      let response 
        try{
            response = await userServiceTmdb.fetchTvSeriesDetails(tmdbID)
        }
        catch (err){
          response = err.response
          console.log(response)
        }   
        finally {

          if (response.status === 200){
            this.tvSeriesDetails =  response.data.content
            this.tvSeriesDetails.title = this.tvSeries.find(c => c.tmdbID == tmdbID).title
            this.tvSeriesDetails.tmdbID = tmdbID
            this.showModal = true
          } 
        }  
    },

    compareDate(airDate){
      
      let currentDate = new Date().toISOString()
      let currentYear = parseInt(currentDate.split('T')[0].split('-')[0])
      let currentMonth = parseInt(currentDate.split('T')[0].split('-')[1])
      let currentDay = parseInt(currentDate.split('T')[0].split('-')[2])
      let airDateYear = 0
      let airDateMonth = 0
      let airDateDay = 0
      if (airDate){
        airDateYear = parseInt(airDate.split('-')[0])
        airDateMonth = parseInt(airDate.split('-')[1])
        airDateDay= parseInt(airDate.split('-')[2])
      }
      let isAlreadyAired  

      if(currentYear > airDateYear)  isAlreadyAired = true
      else if(currentYear < airDateYear) isAlreadyAired = false
      else if (currentYear = airDateYear){
        if(currentMonth > airDateMonth)  isAlreadyAired = true
        else if(currentMonth < airDateMonth) isAlreadyAired = false
        else if (currentMonth = airDateMonth)  {
          if(currentDay >= airDateDay)  isAlreadyAired = true
          else if(currentDay < airDateDay) isAlreadyAired = false
        }  
      }
      return isAlreadyAired
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
