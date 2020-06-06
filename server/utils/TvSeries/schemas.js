const mongoose = require("../mongoConnection")

episodeWatchedSchema = new mongoose.Schema({
    episodeNumber: Number,
    statusEpisode: {type: Number, default: 0}
})

seasonWatchedSchema = new mongoose.Schema({
    seasonNumber: Number,
    statusSeason: {type: Number, default: 0},
    episodes: [episodeWatchedSchema]
})

tvSeriesSchema = new mongoose.Schema({
    tmdbID: String,
    status: String,
    seasons: [seasonWatchedSchema]
})



module.exports.tvSeriesSchema= tvSeriesSchema
module.exports.seasonWatchedSchema = seasonWatchedSchema
module.exports.episodeWatchedSchema = episodeWatchedSchema