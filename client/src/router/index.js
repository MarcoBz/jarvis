import Vue from 'vue'
import Router from 'vue-router'
import StartNewDay from '../components/Checklist/StartNewDay'
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
    {
      path: '/Checklist',
      // name: 'ChecklistPage',
      component: ChecklistPage,
      children: [
        {
          path: '/Checklist/StartNewDay',
          name: 'StartNewDay',
          props: true,
          component: StartNewDay
        },
        {
          path: '/DailyChecklist',
          name: 'DailyChecklist',
          component: DailyChecklist,
          props: true

        }
      ]
    }
  ]
})
