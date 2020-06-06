const express = require("express")
const router = express.Router()
const utils = require("../../utils/mongoUtils")
const mongoose = require("../../utils/mongoConnection")
const schemas = require("../../utils/TvSeries/schemas")

seasonWatchedSchema = schemas.seasonWatchedSchema
episodeWatchedSchema = schemas.episodeWatchedSchema
tvSeriesSchema = schemas.tvSeriesSchema

const EpisodeWatched = mongoose.model("EpisodeWatched", episodeWatchedSchema)
const SeasonWatched = mongoose.model("SeasonWatched", seasonWatchedSchema)

router.patch("/:user/tvSeriesID/:tmdbID", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        if (!findUser)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  
        const TvSeries = mongoose.model((findUser._id) + "_tvserie", tvSeriesSchema)
        utils.query_userTvSeries(TvSeries, req.params.tmdbID)
        .then((tvSeriesResponse) => {
            if (!tvSeriesResponse)  return res.status(404).send({ 
                "message" : "The user is not following this Tv Series",
                "content" : false
            });  
            let op =  req.body[0].op

            if (!req.body[0].path && op == "remove"){
                utils.delete_tvSeries(TvSeries, req.params.tmdbID)
                .then((response) => {
                    res.status(200).send({
                        "message" : "Tv Series removed",
                        "content" : response
                    })
                })
            }
            let resource = req.body[0].path.split('/')
            

            if (resource[0] == "status"){
                if (op == "replace"){
                    utils.update_tvSeries_status(TvSeries, req.params.tmdbID, req.body[0].value)
                    .then((response) => {
                        res.status(200).send({
                            "message" : "The user is following this Tv Series",
                            "content" : {
                                "status" : response.status
                            }
                        })
                    })
                }
            }
            else if (resource[0] == "season"){
                if ( resource.length > 1 && typeof parseInt(resource[1]) == "number"){
                    let season = resource[1]
                    if (resource.length == 2){
                        if (op == "add") {
                            utils.add_tvSeries_season(TvSeries, req.params.tmdbID, season, req.body[0].value)
                            .then((response) => {
                                res.status(200).send({
                                    "message" : "The user is following this Tv Series",
                                    "content" : {
                                        "season" : {
                                            "numSeason" : response.seasons.find(c => c.seasonNumber === parseInt(season)).seasonNumber,
                                            "episodes" : response.seasons.find(c => c.seasonNumber === parseInt(season)).episodes
                                        }
                                    }
                                })
                            })
                        }
                    }
                    else {
                        if (resource[2] == "statusSeason"){
                            if (op == "replace"){
                                utils.update_tvSeries_season_status(TvSeries, req.params.tmdbID, season, req.body[0].value)
                                .then((response) => {  
                                    if (!response.seasons.find(c => c.seasonNumber === parseInt(season)))  return res.status(404).send({ 
                                        "message" : "Season not found",
                                        "content" : false
                                    }); 
                                    res.status(200).send({
                                        "message" : "The user is following this Tv Series",
                                        "content" : {
                                            "season" : {
                                                "numSeason" : response.seasons.find(c => c.seasonNumber === parseInt(season)).seasonNumber,
                                                "statusSeason" :response.seasons.find(c => c.seasonNumber === parseInt(season)).statusSeason
                                            }
                                        }
                                    }) 
                                })
                            }
                        }

                        else if(resource[2] == "episode"){
                            if ( resource.length > 3 && typeof parseInt(resource[3]) == "number"){
                                let episode = resource[3]
                                if (resource.length == 4){
                                    if (op == "add") {
                                        utils.add_tvSeries_episode(TvSeries, req.params.tmdbID, season, episode, req.body[0].value)
                                        .then((response) => {
                                            res.status(200).send({
                                                "message" : "The user is following this Tv Series",
                                                "content" : {
                                                    "season" : {
                                                        "numSeason" : response.seasons.find(c => c.seasonNumber === parseInt(season)).seasonNumber,
                                                        "episodes" : response.seasons.find(c => c.seasonNumber === parseInt(season)).episodes
                                                    }
                                                }
                                            })
                                        })
                                    }
                                }
                                else {
                                    if (resource[4] == "statusEpisode"){
                                        if (op == "replace"){
                                            utils.update_tvSeries_episode_status(TvSeries, req.params.tmdbID, season, episode, req.body[0].value)
                                            .then((response) => {  
                                                if (!response.seasons.find(c => c.seasonNumber === parseInt(season)))  return res.status(404).send({ 
                                                    "message" : "Season not found",
                                                    "content" : false
                                                }); 
                                                if (!response.seasons.find(c => c.seasonNumber === parseInt(season)).episodes.find(d => d.episodeNumber === parseInt(episode)))  return res.status(404).send({ 
                                                    "message" : "Episode not found",
                                                    "content" : false
                                                }); 
                                                res.status(200).send({
                                                    "message" : "The user is following this Tv Series",
                                                    "content" : {
                                                        "season" : {
                                                            "numSeason" : response.seasons.find(c => c.seasonNumber === parseInt(season)).seasonNumber,
                                                            "numEpisode" : response.seasons.find(c => c.seasonNumber === parseInt(season)).episodes.find(d => d.episodeNumber === parseInt(episode)).episodeNumber,
                                                            "numEpisode" : response.seasons.find(c => c.seasonNumber === parseInt(season)).episodes.find(d => d.episodeNumber === parseInt(episode)).statusEpisode
                                                        }
                                                    }
                                                }) 
                                            })
                                        }
                                    }
                                    else if (typeof parseInt(resource[4]) == "number"){
                                        if (op == "replace"){
                                            utils.update_tvSeries_array_episodes(TvSeries, req.params.tmdbID, season, resource[3], resource[4], req.body[0].value)
                                            .then((response) => {
                                                res.status(200).send({
                                                    "message" : "The user is following this Tv Series",
                                                    "content" : {
                                                        "season" : {
                                                            "numSeason" : response.seasons.find(c => c.seasonNumber === parseInt(season)).seasonNumber,
                                                            "episodes" : response.seasons.find(c => c.seasonNumber === parseInt(season)).episodes
                                                        }
                                                    }
                                                })
                                            })
                                        }
                                    }
                                }
                            }
                            else return res.status(404).send({ 
                                "message" : "Error",
                                "content" : false
                            }); 
                        }
                    }

                }
                else return res.status(404).send({ 
                    "message" : "Error",
                    "content" : false
                });  
            }


        })
    })
})
        
router.get("/:user/tvSeriesID/:tmdbID/status", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  

        const TvSeries = mongoose.model((findUser._id) + "_tvserie", tvSeriesSchema)

        utils.query_userTvSeries(TvSeries, req.params.tmdbID)
        .then((tvSeriesResponse) => {
            if (!tvSeriesResponse._id)  return res.status(404).send({ 
                "message" : "The user is not following this Tv Series",
                "content" : false
            }); 
            res.status(200).send({
                "message" : "The user is following this Tv Series",
                "content" : {
                    "status" : tvSeriesResponse.status
                }
            })
        })
    })
})

router.get("/:user/tvSeriesID/:tmdbID/seasons", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  

        const TvSeries = mongoose.model((findUser._id) + "_tvserie", tvSeriesSchema)
        utils.query_userTvSeries(TvSeries, req.params.tmdbID)
        .then((tvSeriesResponse) => {
            
            if (!tvSeriesResponse._id)  return res.status(404).send({ 
                "message" : "The user is not following this Tv Series",
                "content" : false
            }); 
            console.log(tvSeriesResponse)
            res.status(200).send({
                "message" : "The user is following this Tv Series",
                "content" : {
                    "tmdbId" : tvSeriesResponse.tmdbID,
                    "seasons" : tvSeriesResponse.seasons
                }
            })
        })
    })
})

router.get("/:user/tvSeriesID/:tmdbID", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  

        const TvSeries = mongoose.model((findUser._id) + "_tvserie", tvSeriesSchema)

        utils.query_userTvSeries(TvSeries, req.params.tmdbID)
        .then((tvSeriesResponse) => {
            if (!tvSeriesResponse._id)  return res.status(404).send({ 
                "message" : "The user is not following this Tv Series",
                "content" : false
            }); 
            res.status(200).send({
                "message" : "The user is following this Tv Series",
                "content" : {
                    "status" : tvSeriesResponse
                }
            })
        })
    })
})

router.post("/:user/tvSeriesID/:tmdbID", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  
        const TvSeries = mongoose.model((findUser._id) + "_tvserie", tvSeriesSchema)
        utils.query_userTvSeries(TvSeries, req.params.tmdbID)
        .then((tvSeriesResponse) => {
            if (tvSeriesResponse)  return res.status(400).send({ 
                "message" : "The user is already following this Tv Series",
                "content" : false
            });  
            else{
                let seasonsArray = []       
                const tvSeries = new TvSeries({           
                    tmdbID: req.params.tmdbID ,
                    status: "watchList", //watching memory
                    seasons: seasonsArray
                })                
                tvSeries.save()
                .then((savedTvSeries) =>{ 
                    return res.status(201).send({
                        "message" : "Added tvSeries",
                        "content" : savedTvSeries
                    });
                })
                .catch((err) => {
                    return res.status(404).send({
                        "message" : "Error in saving the tvSeries",
                        "content" : err
                    });
                })
            }
        })
    })
})

router.get("/:user/watchList", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  

        const TvSeries = mongoose.model((findUser._id) + "_tvserie", tvSeriesSchema)

        utils.query_userWatchList(TvSeries)
        .then((watchListResponse) => {
            res.status(200).send({
                "message" : "The user is following this Tv Series",
                "content" : {
                    "watchList" : watchListResponse
                }
            })
        })
    })
})

router.get("/:user/onWatch", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  

        const TvSeries = mongoose.model((findUser._id) + "_tvserie", tvSeriesSchema)

        utils.query_userOnWatch(TvSeries)
        .then((onWatchResponse) => {
            res.status(200).send({
                "message" : "The user is following this Tv Series",
                "content" : {
                    "onWatch" : onWatchResponse
                }
            })
        })
    })
})

router.get("/:user/memory", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  

        const TvSeries = mongoose.model((findUser._id) + "_tvserie", tvSeriesSchema)

        utils.query_userMemory(TvSeries)
        .then((onWatchResponse) => {
            res.status(200).send({
                "message" : "The user is following this Tv Series",
                "content" : {
                    "onWatch" : onWatchResponse
                }
            })
        })
    })
})

router.get("/:user/all", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  

        const TvSeries = mongoose.model((findUser._id) + "_tvserie", tvSeriesSchema)

        utils.query_userAll(TvSeries)
        .then((allResponse) => {
            res.status(200).send({
                "message" : "The user is following this Tv Series",
                "content" : {
                    "all" : allResponse
                }
            })
        })
    })
})

module.exports = router
