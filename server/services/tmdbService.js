const instance = require("./tmdbApi")
const apiKey = "e08b809fa16423ea9f9a329e8b727779"

function fetchTvSeriesDetails (tmdbID) {
  const route = "tv/" + tmdbID + "?api_key=" + apiKey
  return instance.get(route)
}

function fetchSesonsDetails(tmdbID, numSeason){
  const route = "tv/" + tmdbID + "/season/" + numSeason + "?api_key=" + apiKey
  return instance.get(route)
}

module.exports.fetchTvSeriesDetails = fetchTvSeriesDetails
module.exports.fetchSesonsDetails = fetchSesonsDetails
