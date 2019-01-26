import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Checklist/Home'
import Login from '../components/Login'
import ChecklistPage from '../components/Checklist/ChecklistPage'
import OpenSpace from '../components/OpenSpace'
import DailyChecklist from '../components/Checklist/DailyChecklist'
import Actions from '../components/Checklist/Actions'
// import DailyStatus from '@/components/Checklist/DailyStatus'
// import DailyRecap from '@/components/Checklist/DailyRecap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/OpenSpace',
      name: 'OpenSpace',
      component: OpenSpace
    },
    // {
    //   path: '/',
    //   redirect: {
    //     name: 'Login'
    //   }
    // },

    {
      path: '/Checklist',
      // name: 'ChecklistPage',
      component: ChecklistPage,
      children: [
        {
          path: '',
          component: Home
        }
      ]
    }
    // {
    //   path: '/Home',
    //   name: 'Home',
    //   component: Home
    // },
    // {
    //   path: '/Actions',
    //   name: 'Actions',
    //   component: Actions
    // },
    // // {
    // //   path: '/DailyStatus',
    // //   name: 'DailyStatus',
    // //   component: DailyStatus
    // // },
    // // {
    // //   path: '/DailyRecap',
    // //   name: 'DailyRecap',
    // //   component: DailyRecap
    // // },    
    // {
    //   path: '/DailyChecklist/:day',
    //   name: 'DailyChecklist',
    //   props: true,
    //   component: DailyChecklist
    // }
  ]
})
