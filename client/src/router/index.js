import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Checklist/Home'
import DailyChecklist from '@/components/Checklist/DailyChecklist'
import Actions from '@/components/Checklist/Actions'
// import DailyStatus from '@/components/Checklist/DailyStatus'
// import DailyRecap from '@/components/Checklist/DailyRecap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'Home'
      }
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/Actions',
      name: 'Actions',
      component: Actions
    },
    // {
    //   path: '/DailyStatus',
    //   name: 'DailyStatus',
    //   component: DailyStatus
    // },
    // {
    //   path: '/DailyRecap',
    //   name: 'DailyRecap',
    //   component: DailyRecap
    // },    
    {
      path: '/DailyChecklist/:day',
      name: 'DailyChecklist',
      props: true,
      component: DailyChecklist
    }
  ]
})
