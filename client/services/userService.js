import Api from "./Api"

export function fetchDailyChecklist (user, day) {
  const route = user + "/days/" + day
  return Api().get(route)
}

export function patchDailyChecklist (user, day, body){
  console.log(body)
  const route = user + "/days/" + day
  return Api().patch(route, body)
}

// export function  (user) {
//   const route = user + "/dailyStatus"
//   return Api().get(route)
// }

export function fetchLastDay (user) {
  const route = user + "/lastDay"
  return Api().get(route)
}

export function addDailyChecklist (user, day, body) {
  const route = user + "/days/" + day
  return Api().post(route, body)
}

export default {
  fetchDailyChecklist,
  // fetchDailyStatus,
  fetchLastDay,
  patchDailyChecklist,
  addDailyChecklist
}
