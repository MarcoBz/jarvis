import Vue from 'vue'
import Router from 'vue-router'
import StartNewDay from '../components/Checklist/StartNewDay'
import Login from '../components/Login'
import ChecklistPage from '../components/Checklist/ChecklistPage'
import OpenSpace from '../components/OpenSpace'
import DailyChecklist from '../components/Checklist/DailyChecklist'
import Actions from '../components/Checklist/Actions'
import TvSeriesPage from '../components/TvSeries/TvSeriesPage'
import SearchTvSeries from '../components/TvSeries/SearchTvSeries'
import WatchList from '../components/TvSeries/WatchList'
import OnWatch from '../components/TvSeries/OnWatch'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login,
      props: true,
    },
    {
      path: '/OpenSpace',
      name: 'OpenSpace',
      component: OpenSpace,
      props: true,
    },
    {
      path: '/Checklist',
      name: 'Checklist',
      props: true,
      component: ChecklistPage,
      children: [
        {
          path: '/Checklist/StartNewDay',
          name: 'StartNewDay',
          props: true,
          component: StartNewDay
        },
        {
          path: '/Checklist/:day',
          name: 'DailyChecklist',
          component: DailyChecklist,
          props: true

        }
      ]
    },
    {
      path: '/TvSeries',
      name: 'TvSeries',
      props: true,
      component: TvSeriesPage,
      children:[
        {
          path: '/TvSeries/SearchTvSeries',
          name: 'SearchTvSeries',
          props: true,
          component: SearchTvSeries
        },
        {
          path: '/TvSeries/WatchList',
          name: 'WatchList',
          props: true,
          component: WatchList
        } ,
        {
          path: '/TvSeries/OnWatch',
          name: 'OnWatch',
          props: true,
          component: OnWatch
        }           
      ]
    }
  ]
})
