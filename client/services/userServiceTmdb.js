import Api from "./Api"

export function fetchTvSeries (tmdbID) {
  const route = "tmdb/tvSeriesID/" + tmdbID
  return Api().get(route)
}

export function fetchTvSeriesDetails (tmdbID) {
  const route = "tmdb/tvSeriesID/" + tmdbID + "/details"
  return Api().get(route)
}

export function fetchTvSeriesSeasons (tmdbID) {
  const route = "tmdb/tvSeriesID/" + tmdbID + "/seasons"
  return Api().get(route)
}

export function fetchTvSeriesTitles (watchListTmdbID) {
  const route = "tmdb/tvSeriesTitles"
  return Api().get(route, {
    params: {
      tmdbIDs: watchListTmdbID
    }
  })
}

export function addTvSeries (tmdbID) {
  const route = "tmdb/tvSeriesID/" + tmdbID
  return Api().post(route)
}

export default {
  addTvSeries,
  fetchTvSeries,
  fetchTvSeriesTitles,
  fetchTvSeriesDetails,
  fetchTvSeriesSeasons
}
