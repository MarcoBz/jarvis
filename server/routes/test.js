const express = require("express")
const router = express.Router()
const schemas = require("../utils/Tmdb/schemas")
const utils = require("../utils/mongoUtils")
const mongoose = require("../utils/mongoConnection")
const userService = require("../services/tmdbService")

tmdbSchema = schemas.tmdbSchema

router.post("/tvSeriesID/:tmdbID", (req, res) => {
            userService.fetchTvSeriesDetails(req.params.tmdbID)
            .then((response) => {
                if (response.status == "201" || response.status == "200") {

                    let networks = []
                    for(let network in response.data.networks){
                        networks.push(response.data.networks[network].name)
                    }

                    let airDate = response.data.first_air_date.split("-")[0] + "-" + response.data.last_air_date.split("-")[0]
                    
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
                    return res.status(200).send({
                        "message" : "Tv Series created in the database",
                        "content" : tvSeries
                    });
                }
                else {
                    return res.status(200).send({
                        "message" : "An error occurred",
                        "content" : response
                    });
                }
            })
            .catch((err)=> console.log(err) )  
})

module.exports = router