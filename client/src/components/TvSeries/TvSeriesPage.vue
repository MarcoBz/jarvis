<template>
  <div id="tvseries">
    <div id="header">
        <nav>
          <router-link @click.native="changeSection('SearchTvSeries')" :to="{ name: 'SearchTvSeries', params: {currentUser: this.user }}" class="btn" v-bind:class= "{'btn-info' : searchSection}">Search</router-link>
          <router-link @click.native="changeSection('OnWatch')" :to="{ name: 'OnWatch', params: {currentUser: this.user }}" class="btn" v-bind:class= "{'btn-info' : onWatchSection}">On Watch</router-link>
          <router-link @click.native="changeSection('WatchList')" :to="{ name: 'WatchList', params: {currentUser: this.user }}" class="btn" v-bind:class= "{'btn-info' : watchlistSection}">Watch List</router-link>
        </nav>
    </div>
    <div id="main" v-if="isReady">
      <router-view @changeSection="changeSection"></router-view>
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
      }
      else if(section == 'OnWatch'){
        this.searchSection = false
        this.onWatchSection = true
        this.watchlistSection  = false
      }
      else if(section = 'WatchList'){
        this.searchSection = false
        this.onWatchSection = false
        this.watchlistSection  = true
      }
    }
  }
}
</script>

<style>
</style>
