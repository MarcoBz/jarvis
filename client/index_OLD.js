//const path = "http://localhost:4000"
const path = "https://my-perfect-day.herokuapp.com"

let currentDay
let lastDay

let headerRow = document.createElement("div")
headerRow.classname = "row"
let dailyStatusButton = document.createElement("button")
dailyStatusButton.id = "dailyStatusButton"
dailyStatusButton.className = "btn btn-outline-success bg-light"
dailyStatusButton.type = "button"
dailyStatusButton.value = "Daily Status"
dailyStatusButton.innerHTML = "Daily Status"
headerRow.appendChild(dailyStatusButton)
let dailyRecapButton = document.createElement("button")
dailyRecapButton.id = "dailyRecapButton"
dailyRecapButton.className = "btn btn-outline-success bg-light"
dailyRecapButton.type = "button"
dailyRecapButton.value = "Daily Recap"
dailyRecapButton.innerHTML = "Daily Recap"
headerRow.appendChild(dailyRecapButton)
let allActionsButton = document.createElement("button")
allActionsButton.id = "allActionsButton"
allActionsButton.className = "btn btn-outline-success bg-light"
allActionsButton.type = "button"
allActionsButton.value = "Your Actions"
allActionsButton.innerHTML = "Your Actions"
headerRow.appendChild(allActionsButton)
document.getElementById("header").appendChild(headerRow)

let form = document.createElement("form")
form.id = "getDayForm"

let getDayDiv = document.createElement('div')
getDayDiv.className = "form-group row"

let placeHolders = ["day", "month", "year"]
for (i in placeHolders){
    let getDayElement = document.createElement('div')
    getDayElement.className = "col"
    let getDayInput = document.createElement("input")
    getDayInput.className = "form-control col getDayField"
    getDayInput.id = placeHolders[i] + "Id"
    getDayInput.type = "text"
    getDayInput.placeholder = placeHolders[i]    
    getDayElement.appendChild(getDayInput)
    getDayDiv.appendChild(getDayElement)
}

let getDayButtonDiv = document.createElement('div')
getDayButtonDiv.className = "col"
let getDayButton = document.createElement("input")
getDayButton.type = "button"
getDayButton.className = "btn btn-outline-success newDayButton bg-light"
getDayButton.value = "Get Day"
getDayButton.id = "getDayId"
getDayButtonDiv.appendChild(getDayButton)
getDayDiv.appendChild(getDayButtonDiv)
form.appendChild(getDayDiv)

let getCurrentDayDiv = document.createElement('div')
getCurrentDayDiv.className = "form-group row"
let getCurrentDayButton = document.createElement("input")
getCurrentDayButton.type = "button"
getCurrentDayButton.className = "btn btn-outline-success newDayButton bg-light"
getCurrentDayButton.value = "Get Current Day"
getCurrentDayButton.id = "getCurrentDayId"
getCurrentDayDiv.appendChild(getCurrentDayButton)
form.appendChild(getCurrentDayDiv)
document.getElementById('footer').appendChild(form)

$(document).ready(function (){

    $('#header').on("click", "#dailyStatusButton", function(){       
        $.ajax({
            type: "GET",
            url: path + "/api/1/dailyStatus",
            contentType: 'application/json',
            success: function (response) { 
                console.log(response)
            }
        })    
    });

    $('#footer').on("click", "#getCurrentDayId", function(){
        checkIfStartNewDaY()
    });

    $('#footer').on("click", "#getDayId", function(){
        let chosenDay  = $("#dayId").val()
        let chosenMonth = $("#monthId").val()
        let chosenYear = $("#yearId").val()
        //insert error in data 
        if (chosenDay < 10) chosenDay = "0" + chosenDay
        if (chosenMonth < 10) chosenMonth = "0" + chosenMonth
        let day = chosenDay + "." + chosenMonth + "." + chosenYear
        $(".getDayField").each(function(){
            $(this).val("")
        })
        currentDay = getDate()
        if (currentDay == day){
            checkIfStartNewDaY()
        }
        else{
            
            $.ajax({
                type: "GET",
                url: path + "/api/1/days/" + day,
                contentType: 'application/json',
                success: function (response) {
                    let tableDiv = drawChecklist(response, false) 
                    document.getElementById('main').innerHTML = "";
                    document.getElementById('main').appendChild(tableDiv)
                }
            })
        }
    });

    $( window ).load(function(){
        checkIfStartNewDaY()
    });
    
    $('#main').on("click", "#newDayId", function (){
        
        currentDay = getDate()
        $.ajax({
            type: "GET",
            url: path + "/api/1/days/" + lastDay,
            contentType: 'application/json',
            success: function (response) {

                for (action in response){
                    response[action] = false 
                }

                
                $.ajax({
                    type: "PATCH",
                    url: path + "/api/1/days",
                    data: JSON.stringify({
                            "op" : "add",
                            "path" : "/" + currentDay,
                            "value" : response
                        }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response) { 
                        console.log(response)
                    }
                })
                
                

                let tableDiv = drawChecklist(response, true) 
                document.getElementById('main').innerHTML = "";
                document.getElementById('main').appendChild(tableDiv)

            }
        })
    });

    $('#main').on("click", ".checkActionButton", function (){

        let value
        if ($(this).attr("check") == "checked") {
            value = false
        }
        else {
            value = true
        }


        $.ajax({
            type: "PATCH",
            url: path + "/api/1/days/" + currentDay,
            data: JSON.stringify({
                1 : {
                    "op" : "replace",
                    "path" : "/" + $(this).val(),
                    "value" : value
                    }
                }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) { 
                let tableDiv = drawChecklist(response.days[currentDay], true) 
                document.getElementById('main').innerHTML = "";
                document.getElementById('main').appendChild(tableDiv)
                
            }
        })    
    });

    $('#main').on("click", ".modifyActionsButton", function(){
        let allActions = []
        $(".action").each(function(){
            allActions.push($(this).val())
        })
        document.getElementById('main').innerHTML = "";
        let form = document.createElement("form")
        form.id = "modifyActionsForm"

        let allAddedActionsDiv = document.createElement("div")
        allAddedActionsDiv.id = "allAddedActions"
       
        for (action in allActions){
            addedActionDiv = drawAddedActions(allActions[action])
            allAddedActionsDiv.appendChild(addedActionDiv)
        }

        addActionForm = drawAddActionForm()
        form.appendChild(allAddedActionsDiv)
        form.appendChild(addActionForm)

        let invokeModifyActions = document.createElement("div")
        invokeModifyActions.classname = "text-center"
        let invokeModifyActionsButton = document.createElement("input")
        invokeModifyActionsButton.type = "button"
        invokeModifyActionsButton.id = "invokeModifyActions"
        invokeModifyActionsButton.value = "Confirm checklist"
        invokeModifyActionsButton.className = "btn btn-success"
    
        invokeModifyActions.appendChild(invokeModifyActionsButton)
        form.appendChild(invokeModifyActions)

        document.getElementById('main').appendChild(form)
    });

    $("#main").on("click","#addActionButton", function(){
		let newAction = $(this).parents("#addAction").find("#addActionFormId").val()
        let allActions = []
        $('.addedAction').each(function(i) {
            let addedAction  = $(this).find(".action").val()
            if (addedAction){
                allActions.push(addedAction)
            }
        });	

        if (!allActions.includes(newAction) && newAction != ""){
            $(this).parents("#addAction").find("#addActionFormId").val("") 
            addedActionDiv = drawAddedActions(newAction)
            document.getElementById("allAddedActions").appendChild(addedActionDiv)
        }
        else $(this).parents("#addAction").find("#addActionFormId").val("") 

    });
    
	$("#main").on("click","#removeActionButton", function(){
		$(this).parents(".addedAction").remove()
    });

    $("#main").on("click","#invokeModifyActions", function(){
        let newActions = []
        $('.addedAction').each(function(i) {
            let addedAction  = $(this).find(".action").val()
            if (addedAction){
                newActions.push(addedAction)
            }
        });	    
        
        let oldActions = []
        currentDay = getDate()

        $.ajax({
            type: "GET",
            url: path + "/api/1/days/" + currentDay,
            contentType: 'application/json',
            success: function (response) {
                for (action in response){
                    oldActions.push(action)
                }
                body = defineModification(oldActions, newActions)
                $.ajax({
                    type: "PATCH",
                    url: path + "/api/1/days/" + currentDay,
                    data: JSON.stringify(body),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response) { 
                        console.log(response)
                        let tableDiv = drawChecklist(response.days[currentDay], true) 
                        document.getElementById('main').innerHTML = "";
                        document.getElementById('main').appendChild(tableDiv)
                    }
                }) 

            }
        })
    });

});

function getDate(){
    let today = new Date().toISOString()
    let todayFormatted = today.split('T')[0].split('-')[2] + '.' + today.split('T')[0].split('-')[1] + '.' + today.split('T')[0].split('-')[0]
    return todayFormatted
}

function drawChecklist(actions, isToday){
    let tableDiv = document.createElement('div')
    tableDiv.className = "col col-6 text-center"
    let table = document.createElement("ul")
    table.className = ("list-group")
    let totalActions = 0
    let checkedAction = 0
    for (action in actions){
        totalActions += 1
        if (actions[action]) checkedAction += 1
    }

    let firstRow = document.createElement("li")
    firstRow.className = "list-group-item text-center list-group-item-secondary"
    firstRow.innerHTML = checkedAction + "/" + totalActions
    table.appendChild(firstRow)
    
    let perc = 100 * parseInt(checkedAction) / parseInt(totalActions)
    let status
    if (perc == 0) status = "Start Doing Something!!!" // a 
    else if ( perc > 0  && perc <= 20 ) status = "Are you serious?" // b 
    else if ( perc > 20  && perc <= 40 ) status = "Come on!" // c 
    else if ( perc > 40  && perc <= 60 ) status = "You can do better" // d
    else if ( perc > 60  && perc <= 80 ) status = "You are doing fine" // e 
    else if ( perc > 80  && perc < 100 ) status = "Almost done everything" // f 
    else if ( perc == 100 ) status = "Perfect Day" // g

    let statusRow = document.createElement("li")
    statusRow.className = "list-group-item text-center list-group-item-secondary"
    statusRow.innerHTML = status
    table.appendChild(statusRow)
    
    for (action in actions){
        let actionRow
        if (isToday){
            actionRow = document.createElement("button")
            actionRow.type = "button"    
            actionRow.className = "checkActionButton "
        }
        else {
            actionRow = document.createElement("li")
            actionRow.className = ""
        }
        actionRow.className += "list-group-item text-center action"
        actionRow.value = action
        actionRow.innerHTML = action

        if (actions[action]) {
            actionRow.className += " list-group-item-success"
            actionRow.setAttribute("check", "checked")
        }
        else{
            actionRow.setAttribute("check", "unchecked")
            if (!isToday) actionRow.className += " list-group-item-danger"
        }
        table.appendChild(actionRow)
    }
    if (isToday){
        let lastRow = document.createElement("li")
        lastRow.className = "list-group-item text-center"
        let lastRowButton = document.createElement("button")
        lastRowButton.type = "button"
        lastRowButton.className = "modifyActionsButton btn btn-info"
        lastRowButton.innerHTML = "Modify"
        lastRow.appendChild(lastRowButton)
        table.appendChild(lastRow)
            
    }
    tableDiv.appendChild(table)  

    return tableDiv
}

function checkIfStartNewDaY() {
    
    $.ajax({
                type: "GET",
                url: path + "/api/1/lastDay",
                contentType: 'application/json',
                success: function (response) {
                    currentDay = getDate()
                    lastDay = response
                    if (response != currentDay){
                        let newDayElement = document.createElement("div")
                        let newDayButton = document.createElement("input")
                        newDayButton.type = "button"
                        newDayButton.className = "btn btn-outline-success newDayButton bg-light"
                        newDayButton.value = "Start New Day"
                        newDayButton.id = "newDayId"
                        newDayElement.appendChild(newDayButton)
                        document.getElementById('main').innerHTML = "";
                        document.getElementById('main').appendChild(newDayElement)
                    }
                    else{
                        $.ajax({
                            type: "GET",
                            url: path + "/api/1/days/" + currentDay,
                            contentType: 'application/json',
                            success: function (response) {
                                let tableDiv = drawChecklist(response, true) 
                                document.getElementById('main').innerHTML = "";
                                document.getElementById('main').appendChild(tableDiv)
                            }
                        })
                    }
                },
                error: function (response){
                    console.log(response)
                }
            });
}

function drawAddActionForm(){

    let addAction = document.createElement("div")
    addAction.className = "form-row"
    addAction.id = "addAction"
    let addActionDiv = document.createElement("div")
    addActionDiv.className = "col col-10"
    let inputAction = document.createElement("input")
    inputAction.className = "form-control"
    inputAction.id = "addActionFormId"
    inputAction.type = "text"
    inputAction.placeholder = "Conquer the world"
    addActionDiv.appendChild(inputAction)
    addAction.appendChild(addActionDiv)
    
    let addButtonDiv = document.createElement("div")
    addButtonDiv.className = "col-auto"
    let add = document.createElement("input")
    add.type = "button"	
    add.className = "btn btn-light"
    add.id =  "addActionButton"
    add.innerHTML = ""
    addButtonDiv.appendChild(add)
    addAction.appendChild(addButtonDiv)

    return addAction

}
	
function drawAddedActions(action){

    let addedAction = document.createElement("div")
    addedAction.className = "form-row addedAction"
    let addedActionDiv = document.createElement("div")
    addedActionDiv.className = "col-10"
    let inputAction = document.createElement("input")
    inputAction.className = "form-control action"
    inputAction.disabled = true
    inputAction.type = "text"
    inputAction.value = action
    addedActionDiv.appendChild(inputAction)
    addedAction.appendChild(addedActionDiv)
    let addedButtonDiv = document.createElement("div")
    addedButtonDiv.className = "col-auto"
    let added = document.createElement("input")
    added.type = "button"
    added.className = "btn btn-dark"
    added.id =  "removeActionButton"
    added.innerHTML = ""
    addedButtonDiv.appendChild(added)
    addedAction.appendChild(addedButtonDiv)

    return addedAction
}

function defineModification(oldActions, newActions){
    let operations = {}
    let counter = 1
    for (action in oldActions){
        if (!newActions.includes(oldActions[action])){
            let currentOperation = {
                op : "remove",
                path : "/" + oldActions[action]
            }
            operations[counter] = currentOperation
            counter += 1
        }
    }

    for (action in newActions){
        if (!oldActions.includes(newActions[action])){
            let currentOperation = {
                op : "add",
                path : "/" + newActions[action],
                value : false
            }
            operations[counter] = currentOperation
            counter += 1
        }     
    }
    return operations
}

    
