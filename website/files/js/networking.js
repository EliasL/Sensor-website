var ws;

function sendTimeframeRequest(sensorID, timeframe) {
    tableName = "sensor_"+sensorID
    dates = timeframeToArg(timeframe)
    sendMessage("get, elwatchTableTimeframe, " + tableName + ", " + dates[0] + ", " + dates[1]);
}

function checkSocket(message, handleFunc){
    //Check if socet is open
    if(ws == null){
        ws = new WebSocket("wss://lowpowersensor.tk:8080");
        ws.addEventListener(message, handleFunc);
        ws.onopen = function(evt) {
            console.log("OPEN");
        }
        ws.onclose = function(evt) {
            console.log("CLOSE");
            ws = null;
        }
        ws.onerror = function(evt) {
            console.log("ERROR: " + evt.data);
        }
    }
}

function sendMessage(msg){
    console.log("Attempt send message")

    console.log("Waiting for socket...")
    // Wait until the state of the socket is not ready and send the message when it is...
    waitForSocketConnection(ws, function(){
        console.log("Sending...")
        ws.send(msg);
    });
}

function waitForSocketConnection(socket, callback){
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                if(callback != null){
                    callback();
                }
                return;

            } else {
                waitForSocketConnection(socket, callback);
            }

        }, 5); // wait 5 milisecond for the connection...
}

function reciveResponse(evt) {
    console.log("Request recieved");

    try {
        var jsonData = JSON.parse(evt.data);
    }
    catch (err) {
        console.log("Error in json response!");
        console.log("Error: " + err);
        console.log("Response: " + xhttp.responseText);
    }

    return jsonData;
}

function condenseData(jsonData){
    //Check if data is empty
    if(jsonData.length == 0){
        return jsonData
    }
    previousValue = jsonData[1].Value;
    currentSlope = jsonData[0].Value - jsonData[1].Value;
    previousSlope = 0;
    newData = [jsonData[0]];
    for (index = 2; index < jsonData.length; index++) {
        previousSlope = currentSlope;
        currentSlope = jsonData[index].Value - previousValue;

        //Check change sign of slopes
        //fix this
        if(currentSlope*previousSlope<0 || (currentSlope == 0) ^ (previousSlope == 0)) {
            newData.push(jsonData[index-1]);
        }
        previousValue = jsonData[index].Value;   
    }
    newData.push(jsonData[jsonData.length-1]);
    return newData;
}


function timeframeToArg(timeframe) {

    function format(d) {

        year = "" + d.getFullYear();
        month = "" + (d.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
        day = "" + d.getDate(); if (day.length == 1) { day = "0" + day; }
        hour = "" + d.getHours(); if (hour.length == 1) { hour = "0" + hour; }
        minute = "" + d.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
        second = "" + d.getSeconds(); if (second.length == 1) { second = "0" + second; }
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }

    var oneMinute = 60 * 1000;
    var oneHour = 60 * oneMinute;
    var oneDay = 24 * oneHour;
    var oneWeek = 7 * oneDay;
    var oneMonth = 30 * oneDay;

    switch (timeframe) {
        case "One hour":
            string1 = format(new Date((new Date) - oneHour));
            string2 = format(new Date);
            break;

        case "One day":
            string1 = format(new Date((new Date) - oneDay));
            string2 = format(new Date);
            break;

        case "One week":
            string1 = format(new Date((new Date) - oneWeek));
            string2 = format(new Date);
            break;

        case "30 days":
            string1 = format(new Date((new Date) - oneMonth));
            string2 = format(new Date);
            break;

        default:
            console.log("Something went wrong in timeframeToUrlArg")
            string1 = format(new Date((new Date) - oneHour));
            string2 = format(new Date);
            break;
    }
    return [string1, string2];
}