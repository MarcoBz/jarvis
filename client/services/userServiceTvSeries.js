import Api from "./Api"

export function addTvSeries (user, tmdbID) {
  const route = "tvseries/" + user + "/tvSeriesID/" + tmdbID
  return Api().post(route)
}

export function fetchWatchList (user) {
  const route = "tvseries/" + user + "/watchList"
  return Api().get(route)
}

export function fetchAll (user) {
  const route = "tvseries/" + user + "/all"
  return Api().get(route)
}

export function fetchOnWatch (user) {
  const route = "tvseries/" + user + "/onWatch"
  return Api().get(route)
}

export function patchTvSeries (user, tmdbID, body) {
  const route = "tvseries/" + user + "/tvSeriesID/" + tmdbID
  return Api().patch(route, body)
}

export function fetchTvSeriesSeasons (user, tmdbID) {
  const route = "tvseries/" + user + "/tvSeriesID/" + tmdbID + "/seasons"
  return Api().get(route)
}

export default {
  addTvSeries,
  fetchWatchList,
  patchTvSeries,
  fetchOnWatch,
  fetchTvSeriesSeasons,
  fetchAll
}
