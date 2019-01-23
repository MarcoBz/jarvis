import Api from "./Api"

export function fetchUser (user) {
  const route = "user/" + user
  return Api().get(route)
}

export default {
  fetchUser
}
