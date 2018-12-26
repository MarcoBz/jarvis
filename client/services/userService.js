
import Api from './Api'

export function fetchDailyChecklist (id, day) {
  const route = id + '/days/' + day
  return Api().get(route)
}

export function fetchDailyStatus (id) {
  const route = id + '/dailyStatus'
  return Api().get(route)
}

export function fetchLastDay (id) {
  const route = id + '/lastDay'
  return Api().get(route)
}

export function addDailyChecklist (id, body) {
  const route = id + '/days/'
  return Api().patch(route, body)
}

export default {
  fetchDailyChecklist,
  fetchDailyStatus,
  fetchLastDay,
  addDailyChecklist
}
