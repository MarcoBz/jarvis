import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import DailyChecklist from '@/components/DailyChecklist'
// import Actions from '@/components/Actions'
// import DailyStatus from '@/components/DailyStatus'
// import DailyRecap from '@/components/DailyRecap'

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
    // {
    //   path: '/Actions',
    //   name: 'Actions',
    //   component: Actions
    // },
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
