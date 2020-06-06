const mongoose = require("../mongoConnection")

episodeSchema = new mongoose.Schema({
    name: String,
    episodeNumber: Number,
    seasonNumber: Number,
    airDate: String 
})

specialEpisodesSchema = new mongoose.Schema({
    name: String,
    airDate: String ,
    voteCount: Number,
    voteAverage: Number 
})

seasonSchema = new mongoose.Schema({
    seasonNumber: Number,
    airDate: String,
    numEpisodes: Number,
    episodes: [episodeSchema]
})

tmdbSchema = new mongoose.Schema({
    title: String,
    tmdbID: String,
    numSeasons: Number, 
    numEpisodes: Number,
    lastEpAired: episodeSchema,
    nextEpAired: episodeSchema,
    genres: [String],
    airDate: String,
    networks: [String], 
    seasons: [seasonSchema],
    specialEpisodes: [specialEpisodesSchema]
})

module.exports.tmdbSchema = tmdbSchema
module.exports.seasonSchema = seasonSchema
module.exports.episodeSchema = episodeSchema
module.exports.specialEpisodesSchema = specialEpisodesSchema