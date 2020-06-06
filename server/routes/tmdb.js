const express = require("express")
const router = express.Router()
const schemas = require("../utils/Tmdb/schemas")
const utils = require("../utils/mongoUtils")
const mongoose = require("../utils/mongoConnection")
const userService = require("../services/tmdbService")

tmdbSchema = schemas.tmdbSchema

router.get("/tvSeriesID/:tmdbID", (req, res) => {
    utils.query_tmdbID(req.params.tmdbID) 
    .then((findTvSeries) => {
        if (!findTvSeries)  return res.status(404).send({ 
            "message" : "The TvSeries is not in the database",
            "content" : false
        });  

        return res.status(200).send({
            "message" : "Found TvSeries",
            "content" : findTvSeries
        });

    });   
})

router.get("/tvSeriesID/:tmdbID/seasons", (req, res) => {

    utils.query_seasons(req.params.tmdbID) 
    .then((findTvSeries) => {
        if (!findTvSeries)  return res.status(404).send({ 
            "message" : "The TvSeries is not in the database",
            "content" : false
        });  

        return res.status(200).send({
            "message" : "Found TvSeries",
            "content" : {
                "tmdbID": req.params.tmdbID,
                "seasons": findTvSeries.seasons
            }
        });

    });   
})

router.get("/tvSeriesID/:tmdbID/details", (req, res) => {

    utils.query_details(req.params.tmdbID) 
    .then((findTvSeries) => {
        if (!findTvSeries)  return res.status(404).send({ 
            "message" : "The TvSeries is not in the database",
            "content" : false
        });  

        return res.status(200).send({
            "message" : "Found TvSeries",
            "content" : findTvSeries
        });

    });   
})

router.post("/tvSeriesID/:tmdbID", (req, res) => {
    utils.query_tmdbID(req.params.tmdbID) 
    .then((findTvSeries) => {
        if (findTvSeries)  return res.status(200).send({ 
            "message" : "The TvSeries already exists in the database",
            "content" : {
                "title" : findTvSeries.title
            }
        });  

        else{
            userService.fetchTvSeriesDetails(req.params.tmdbID)
            .then((response) => {
                if (response.status == "201" || response.status == "200") {
                    let networks = []
                    for(let network in response.data.networks){
                        networks.push(response.data.networks[network].name)
                    }
                    let airDate
                    if(response.data.first_air_date) airDate = response.data.first_air_date.split("-")[0]
                    else airdDate = ""
                    if(response.data.last_air_date) airDate += "-" + response.data.last_air_date.split("-")[0]
                    else airDate += "-"
                      
                    
                    let genres = []
                    for(let genre in response.data.genres){
                        genres.push(response.data.genres[genre].name)
                    }
                    
                    let tvSeries = {
                        tmdbID: response.data.id,
                        title: response.data.name,
                        numSeasons: response.data.number_of_seasons, 
                        numEpisodes: response.data.number_of_episodes,
                        genres: genres,
                        airDate: airDate,
                        networks: networks 
                    }

                    if (response.data.last_episode_to_air){
                        tvSeries["lastEpAired"]= {
                            name: response.data.last_episode_to_air.name,
                            seasonNumber: response.data.last_episode_to_air.season_number,
                            episodeNumber: response.data.last_episode_to_air.episode_number,
                            airDate: response.data.last_episode_to_air.air_date
                        }
                    }
                    else{
                        tvSeries["lastEpAired"]= {
                            name: null,
                            seasonNumber: null,
                            episodeNumber: null,
                            airDate: null
                        }
                    }
                    
                    if (response.data.next_episode_to_air){                    
                        tvSeries["nextEpAired"]= {
                            name: response.data.next_episode_to_air.name,
                            seasonNumber: response.data.next_episode_to_air.season_number,
                            episodeNumber: response.data.next_episode_to_air.episode_number,
                            airDate: response.data.next_episode_to_air.air_date
                        }
                    }
                    else{
                        tvSeries["nextEpAired"]= {
                            name: null,
                            seasonNumber: null,
                            episodeNumber: null,
                            airDate: null
                        }
                    }

                    let seasons = {}
                    for (let season in response.data.seasons){
                        if (response.data.seasons[season].season_number != 0){                            
                            seasons[response.data.seasons[season].season_number] = {
                                seasonNumber: response.data.seasons[season].season_number,
                                airDate: response.data.seasons[season].air_date,
                                numEpisodes: response.data.seasons[season].episode_count
                            }
                        }
                    }

                    tvSeries[seasons] = seasons 
                    getSeasonsDetails(req.params.tmdbID, response.data.number_of_seasons)
                    .then((episodes) => {
                        
        
                        for (let i = 1; i < tvSeries.numSeasons + 1; i++){
                            if (episodes[i]) seasons[i]["episodes"] = episodes[i]
                            else seasons[i]["episodes"] = []
                        }
                        tvSeries["seasons"] = []
                        for (let season in seasons){
                            tvSeries["seasons"].push(seasons[season])
                        }
                        tvSeries["specialEpisodes"] = episodes['specials']
                        utils.save_TvSeries(tvSeries)
                        .then((newTvSeries) => {
                            return res.status(200).send({
                                "message" : "Tv Series created in the database",
                                "content" : newTvSeries
                            });
                        })
                    })
                }
                else {
                    return res.status(400).send({
                        "message" : "An error occurred",
                        "content" : false
                    });
                }
            })
            .catch((err)=> console.log(err) )
        }

    });   
})

router.get("/tvSeriesTitles", (req, res) => {
    let tmdbIDs = []
    for ( let i in req.query.tmdbIDs){
        tmdbIDs.push(JSON.parse(req.query.tmdbIDs[i]))
    }

    utils.query_tvSeriesTitle(tmdbIDs)
    .then((response) => {
        return res.status(200).send({
            "message" : "Found TvSeries",
            "content" : {
                "tvSeries" : response
            }
        });        
    })

})


async function getSeasonsDetails(tmdbID, numSeasons){
    let episodes = {}
    for (let i = 0; i < numSeasons + 1; i++ ){
        try{
            seasonDetails = await userService.fetchSesonsDetails(tmdbID, i)
        }
        catch (err){
            seasonDetails = null
        }
        finally {
        
            if (seasonDetails){
                if (i == 0){
                    episodes['specials'] = []
                    for (let j = 0; j < seasonDetails.data.episodes.length; j++ ){
                        episodes['specials'].push({
                            name: seasonDetails.data.episodes[j].name,
                            episodeNumber: j + 1,
                            airDate: seasonDetails.data.episodes[j].air_date,
                            voteCount: seasonDetails.data.episodes[j].vote_count,
                            voteAverage: seasonDetails.data.episodes[j].vote_average
                        })
                    }
                }
                else{
                    episodes[i] = []
                    for (let j = 0; j < seasonDetails.data.episodes.length; j++ ){
                        
                        episodes[i].push({
                            name: seasonDetails.data.episodes[j].name,
                            seasonNumber: i,
                            episodeNumber: j + 1,
                            airDate: seasonDetails.data.episodes[j].air_date
                        })
                    }
                }
            }
            else {
                if (i == 0) episodes['specials'] = []
                else episodes[i]
            }
        }

    }
    return episodes
}

module.exports = router

