const database = [
     {  "user" : "marco_bz",
        "id" : 1,
        "lastDay" : "02.01.2018",
        "days" : {
            "01.01.2018" : {
                "action1" : false,
                "action2" : false,
                "action3" : true
            },
            
            "02.01.2018" : {
                "action1" : false,
                "action2" : true,
                "action3" : true
            }
        },
        "actions" : {
            "action1" : [0,2],
            "action2" : [1,2],
            "action3" : [2,2]
        },
        "dailyStatus" : {
            "a" : 0,
            "b" : 0,
            "c" : 1,
            "d" : 0,
            "e" : 1,
            "f" : 0,
            "g" : 0
        },
        "dailyRecap" : {
            "01.01.2018" : [1,3,"c"],
            "02.01.2018" : [2,3,"e"]
            }
        }
    ]


module.exports = database

//Daily status :
// a : 0% Start Doing Something!!!
// b : 20% Are you serious? 
// c : 40% You can do better
// d : 60% You are doin fine
// e : 80% Almost done everything
// f : 100% Perfect Day