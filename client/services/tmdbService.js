import Api from "./tmdbApi"
const apiKey = "e08b809fa16423ea9f9a329e8b727779"

export function searchTvSeries(title) {
  const route = "search/tv?api_key=" + apiKey + "&query=" + title
  return Api().get(route)
}

export default {
  searchTvSeries
}
