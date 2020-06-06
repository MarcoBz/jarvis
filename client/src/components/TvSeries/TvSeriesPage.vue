<template>
  <div id="tvseries">
    <div id="header" class="container-fluid">
          <div class="row">
            <div class="col-sm"><router-link @click.native="changeSection('SearchTvSeries')" :to="{ name: 'SearchTvSeries', params: {currentUser: this.user }}" class="btn" v-bind:class= "{'btn-info' : searchSection}">Search</router-link></div>
            <div class="col-sm"><router-link @click.native="changeSection('OnWatch')" :to="{ name: 'OnWatch', params: {currentUser: this.user }}" class="btn" v-bind:class= "{'btn-info' : onWatchSection}">On Watch</router-link></div>
            <div class="col-sm"><router-link @click.native="changeSection('WatchList')" :to="{ name: 'WatchList', params: {currentUser: this.user }}" class="btn" v-bind:class= "{'btn-info' : watchlistSection}">Watch List</router-link></div>
            <div class="col-sm"><router-link @click.native="changeSection('Memory')" :to="{ name: 'Memory', params: {currentUser: this.user }}" class="btn" v-bind:class= "{'btn-info' : memorySection}">Memory</router-link></div>     
          </div>
    </div>
    <div id="main" v-if="isReady" class="row">
      <div class ="col text-center">
        <router-view @changeSection="changeSection"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '../../../services/userServiceTmdb'
import router from '../../router'
export default {
  name: 'TvSeriesPage',
  props: ["currentUser"],
  data () {
    return {
      user: this.currentUser,
      isReady: false,
      searchSection: true,
      watchlistSection: false,
      onWatchSection: false,
      memorySection: false,
      sectionClass: 'btn-info'
    }
  },

  mounted(){
    this.isReady = true
    router.push({ name: 'SearchTvSeries', params: {currentUser: this.user }})
  },

  methods: {
    changeSection(section){
      if (section == 'SearchTvSeries'){
        this.searchSection = true
        this.onWatchSection = false
        this.watchlistSection  = false
        this.memorySection = false
      }
      else if(section == 'OnWatch'){
        this.searchSection = false
        this.onWatchSection = true
        this.watchlistSection  = false
        this.memorySection = false
      }
      else if(section == 'WatchList'){
        this.searchSection = false
        this.onWatchSection = false
        this.watchlistSection  = true
        this.memorySection = false
      }
      else if(section == 'Memory'){
        this.searchSection = false
        this.onWatchSection = false
        this.watchlistSection  = false
        this.memorySection = true
      }
    }
  }
}
</script>

<style>
</style>
