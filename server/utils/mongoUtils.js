const mongoose = require("./mongoConnection")
const checklistSchemas = require("./Checklist/schemas")
const userSchemas = require("./User/schemas")
const tmdbSchemas = require("./Tmdb/schemas")
const tvSeriesSchemas = require("./TvSeries/schemas")

userSchema = userSchemas.userSchema
daysSchema = checklistSchemas.daysSchema
tmdbSchema = tmdbSchemas.tmdbSchema
episodeWatchedSchema = tvSeriesSchemas.episodeWatchedSchema
seasonWatchedSchema = tvSeriesSchemas.seasonWatchedSchema
const User = mongoose.model("Population", userSchema)
const tmdbData = mongoose.model("Tmdb_TvSerie", tmdbSchema)
const EpisodeWatched = mongoose.model("EpisodeWatched", episodeWatchedSchema)
const SeasonWatched = mongoose.model("SeasonWatched", seasonWatchedSchema)

async function query_user(user){
    let userCollection = await User
        .findOne({
            user : user
        })
    return userCollection 
}

async function query_dayID(Days, day){
    let dayID = await Days
        .findOne({
            day : day
        })
        .select({
            _id : 1
        })
    return dayID._id
}

async function query_checklist(Days, dayID){
    let checklistCollection = await Days
        .findById(dayID)
    return checklistCollection
}

async function remove_action(Days, dayID, removedAction){
    let checklistCollection = await Days
        .findById(dayID)
    
    if (checklistCollection.actions.find(c => c.action === removedAction)){
        checklistCollection.actions.find(c => c.action === removedAction).remove()
        checklistCollection.save()
        return "Ok"
    }
    else{
        return "No Action"
    }
}

async function add_action(Days, dayID, newAction){
    let checklistCollection = await Days
        .findById(dayID)
    checklistCollection.actions.push(newAction)
    checklistCollection.save()
    return "Ok"
}

async function update_action(Days, dayID, updatedAction, value){
    let checklistCollection = await Days
        .findById(dayID)    
    if (checklistCollection.actions.find(c => c.action === updatedAction)){
        checklistCollection.actions.find(c => c.action === updatedAction).isDone = value
        checklistCollection.save()
        return "Ok"
    }
    else{
        return "No Action"
    }
}

async function query_lastDay(Days){
    let checklistCollection = await Days   
        .findOne()
        .sort({
            order: -1
        })
    return checklistCollection
}

async function query_actions(Days){

    let all_checklists = await Days
        .find()
        .select({
            _id : 0,
            day : 1,
            actions : 1
        })
    
    return all_checklists
}

async function query_tmdbID(tmdbID){
    let tvSeriesCollection = await tmdbData
        .findOne({
            tmdbID : tmdbID
        })
    return tvSeriesCollection 
}

async function add_seasons(tmdbID, seasonsArray){
    let tvSeriesCollection = await tmdbData
        .findById(tmdbID)
    for (let i = 0; i < seasonsArray.length; i++){
        tvSeriesCollection.seasons.push(seasonsArray[i])
    }
    tvSeriesCollection.save()
    return tvSeriesCollection
}

async function query_details(tmdbID){
    let tvSeriesCollection = await tmdbData
        .findOne({
            tmdbID : tmdbID
        })
        .select({
            "genres" : 1,
            "networks" : 1,
            "numSeasons" : 1,
            "numEpisodes" : 1,
            "lastEpAired.seasonNumber" : 1,
            "lastEpAired.episodeNumber" : 1,
            "lastEpAired.airDate" : 1,
            "nextEpAired.seasonNumber" : 1,
            "nextEpAired.episodeNumber" : 1,
            "nextEpAired.airDate" : 1,
            "seasons.seasonNumber" : 1,
            "seasons.numEpisodes" : 1
        })
    return tvSeriesCollection 
}

async function query_seasons(tmdbID){
    let tvSeriesCollection = await tmdbData
        .findOne({
            tmdbID : tmdbID
        })
        .select({
            "seasons" : 1
        })
    return tvSeriesCollection 
}

async function save_TvSeries(tvSeries){
    let tvSeriesCollection = new tmdbData(
        tvSeries
    )
    tvSeriesCollection.save()
    return tvSeriesCollection
}

async function query_userTvSeries(TvSeries, tmdbID){
    let userTvSeriesCollection = await TvSeries
    .findOne({
        tmdbID : tmdbID
    })

    return userTvSeriesCollection
}

async function update_tvSeries_status(TvSeries, tmdbID, newStatus){
    let userTvSeriesCollection = await TvSeries
    .findOne({
        tmdbID : tmdbID
    })

    if (userTvSeriesCollection) {
        userTvSeriesCollection.status = newStatus
        userTvSeriesCollection.save()
        
    }

    return userTvSeriesCollection
}

async function update_tvSeries_episode_status(TvSeries, tmdbID, season, episode, newValue){
    let userTvSeriesCollection = await TvSeries
    .findOne({
        tmdbID : tmdbID
    })

    if (userTvSeriesCollection) {
        if (userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(season))){ 
            if(userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(season)).episodes.find(d => d.episodeNumber === parseInt(episode))){
                userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(season)).episodes.find(d => d.episodeNumber === parseInt(episode)).statusEpisode = newValue
                userTvSeriesCollection.save()
            }
        }
    }
    
    return userTvSeriesCollection
}

async function add_tvSeries_episode(TvSeries, tmdbID, seasonNumber, episodeNumber, statusValue){
    let userTvSeriesCollection = await TvSeries
    .findOne({
        tmdbID : tmdbID
    })

    if (userTvSeriesCollection) {

        if (!userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(seasonNumber))){ 
            userTvSeriesCollection.seasons.push(new SeasonWatched({
                seasonNumber: seasonNumber, 
                statusSeason: '0',
                episodes: []
            }))

            if (statusValue == '1' || statusValue == '-1'){
                userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(seasonNumber)).statusSeason = '-1'
            }

        }        
        if (!userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(seasonNumber)).episodes.find(d => d.episodeNumber === parseInt(episodeNumber))){ 
                userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(seasonNumber)).episodes.push(new EpisodeWatched({
                    episodeNumber: parseInt(episodeNumber),
                    statusEpisode: statusValue
                }))
            }
            userTvSeriesCollection.save()
    }
    
    return userTvSeriesCollection
}

async function update_tvSeries_array_episodes(TvSeries, tmdbID, season, startingEpisode, endingEpisode, statusValue){
    let userTvSeriesCollection = await TvSeries
    .findOne({
        tmdbID : tmdbID
    })

    if (userTvSeriesCollection) {
        if (userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(season))){ 

            for ( let i =  parseInt(startingEpisode); i <  parseInt(endingEpisode) + 1; i++){
                if(userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(season)).episodes.find(d => d.episodeNumber === parseInt(i))){
                    userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(season)).episodes.find(d => d.episodeNumber === parseInt(i)).statusEpisode = statusValue
                }
                else{
                    userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(season)).episodes.push(new EpisodeWatched({
                        episodeNumber: parseInt(i),
                        statusEpisode: statusValue
                    }))
                }
            }

            userTvSeriesCollection.save()
        }
    }

    return userTvSeriesCollection
}

async function update_tvSeries_season_status(TvSeries, tmdbID, seasonNumber, newValue){
    let userTvSeriesCollection = await TvSeries
    .findOne({
        tmdbID : tmdbID
    })

    if (userTvSeriesCollection) {
        if (userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(seasonNumber))){ 
            userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(seasonNumber)).statusSeason = newValue
            userTvSeriesCollection.save()
        }
    }
    
    return userTvSeriesCollection
}

async function add_tvSeries_season(TvSeries, tmdbID, seasonNumber, statusValue){
    let userTvSeriesCollection = await TvSeries
    .findOne({
        tmdbID : tmdbID
    })
    if (userTvSeriesCollection) {
        if (!userTvSeriesCollection.seasons.find(c => c.seasonNumber === parseInt(seasonNumber))){ 
            userTvSeriesCollection.seasons.push(new SeasonWatched({
                seasonNumber: seasonNumber, 
                statusSeason: parseInt(statusValue),
                episodes: []
            }))
            userTvSeriesCollection.save()
        }
    }
    
    return userTvSeriesCollection
}

async function query_userWatchList(TvSeries){
    let userWatchListCollection = await TvSeries
    .find({
        status: "watchList"
    }) 
    .select({
        tmdbID: 1,
        _id: 0
    }) 
    return userWatchListCollection
}

async function query_userOnWatch(TvSeries){
    let userOnWatchCollection = await TvSeries
    .find({
        status: "watching"
    }) 
    .select({
        tmdbID: 1,
        _id: 0
    }) 
    return userOnWatchCollection
}

async function query_userMemory(TvSeries){
    let userOnWatchCollection = await TvSeries
    .find({
        status: "memory"
    }) 
    .select({
        tmdbID: 1,
        _id: 0
    }) 
    return userOnWatchCollection
}

async function query_userAll(TvSeries){
    let userOnWatchCollection = await TvSeries
    .find({
    }) 
    .select({
        tmdbID: 1,
        status: 1,
        _id: 0
    }) 
    return userOnWatchCollection
}

async function query_tvSeriesTitle(tmdbIDsArray){

    if (tmdbIDsArray.length >= 1){    
        let titlesCollection = await tmdbData
        .find()
        .or(tmdbIDsArray)
        .select({
            tmdbID: 1,
            title: 1,
            _id: 0
        }) 
        return titlesCollection 
    }    
    else return titlesCollection = null
}

async function delete_tvSeries(TvSeries, tmdbID){
    let userTvSeriesCollection = await TvSeries
    .deleteOne({
        tmdbID : tmdbID
    })
    return userTvSeriesCollection
}


//module.exports.query_checklist = query_checklist
module.exports.query_user = query_user
module.exports.query_dayID = query_dayID
module.exports.update_action = update_action
module.exports.add_action = add_action
module.exports.remove_action = remove_action
module.exports.query_lastDay = query_lastDay
module.exports.query_actions = query_actions
module.exports.query_tmdbID = query_tmdbID
module.exports.save_TvSeries = save_TvSeries
module.exports.query_details = query_details
module.exports.query_seasons = query_seasons
module.exports.add_seasons = add_seasons
module.exports.query_userTvSeries = query_userTvSeries
module.exports.update_tvSeries_status = update_tvSeries_status
module.exports.update_tvSeries_episode_status = update_tvSeries_episode_status
module.exports.add_tvSeries_episode = add_tvSeries_episode
module.exports.update_tvSeries_season_status = update_tvSeries_season_status
module.exports.add_tvSeries_season = add_tvSeries_season
module.exports.query_userWatchList = query_userWatchList
module.exports.query_tvSeriesTitle = query_tvSeriesTitle
module.exports.query_userOnWatch = query_userOnWatch
module.exports.query_userAll = query_userAll
module.exports.delete_tvSeries = delete_tvSeries
module.exports.query_userMemory = query_userMemory
module.exports.update_tvSeries_array_episodes = update_tvSeries_array_episodes

