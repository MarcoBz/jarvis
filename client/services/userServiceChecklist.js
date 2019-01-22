import Api from "./Api"

export function fetchDailyChecklist (user, day) {
  const route = "checklist/" + user + "/days/" + day
  return Api().get(route)
}

export function patchDailyChecklist (user, day, body){
  console.log(body)
  const route = "checklist/" + user + "/days/" + day
  return Api().patch(route, body)
}

// export function  (user) {
//   const route = user + "/dailyStatus"
//   return Api().get(route)
// }

export function fetchAllActions (user) {
  const route = "checklist/" + user + "/actions"
  return Api().get(route)
}

export function fetchLastDay (user) {
  const route = "checklist/" + user + "/lastDay"
  return Api().get(route)
}

export function addDailyChecklist (user, day, body) {
  const route = "checklist/" + user + "/days/" + day
  return Api().post(route, body)
}

export default {
  fetchDailyChecklist,
  fetchAllActions,
  fetchLastDay,
  patchDailyChecklist,
  addDailyChecklist
}
