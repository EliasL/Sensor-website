var timeFormat = 'DD/MM/YYYY HH:mm:ss';
var color = Chart.helpers.color;

function getChart(bigChartBool, animationDurationMs, curving, zero) {
    var chart = {
        type: 'line',
        data: {
            datasets: [{
                backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                borderColor: window.chartColors.blue,
                fill: false,
                data: [],
            }]
        },
        options: {
            elements: {
                line: {
                    tension: curving
                }
            },
            animation: {
                duration: animationDurationMs
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            millisecond: 'HH:mm:ss.SSS',
                            second:	     'HH:mm:ss',
                            minute:	     'HH:mm',
                            hour:	     'DD-MM HH:mm',
                            day:	     'DD MM',
                            month:	'MM YYYY'
                        },
                        parser: timeFormat,
                        tooltipFormat: timeFormat
                    },
                    display: bigChartBool,
                    scaleLabel: {
                        display: bigChartBool,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: zero
                    },
                    scaleLabel: {
                        display: bigChartBool,
                        labelString: 'Sensor value',
                        
                    }
                }]
            },
            pan: {
                // Boolean to enable panning
                enabled: true,
    
                // Panning directions. Remove the appropriate direction to disable 
                // Eg. 'y' would only allow panning in the y direction
                mode: 'xy'
            },
    
            // Container for zoom options
            zoom: {
                // Boolean to enable zooming
                enabled: true,
    
                // Zooming directions. Remove the appropriate direction to disable 
                // Eg. 'y' would only allow zooming in the y direction
                mode: 'xy',
            }            
        }
    };
    return chart;
};

function resetChartZoom(chart) {
    chart.resetZoom()
}

function clearChart(chart){
    chart.data.datasets[0].data = [];
    return chart
}

function reDrawChart(chart, data) {
    //If data is empty, don't do anything
    if (data.length == 0){
        return chart
    }
    
    // Check if the data only spans a short time, if it's short, it means only append data, if it's long, replace data. Not a good solution :/ sorry if this becomes a problem
    var oldest = new moment(data[0].Date)
    var newest = new moment(data[data.length-1].Date)
    var duration = moment.duration(newest.diff(oldest));
    if (duration < moment.duration(1, 'minutes')){
        data = trimAppendData(chart.data.datasets[0].data, data)
    }else{
        chart.data.datasets[0].data = [];
    }

    //Turn data into propper chart datapoints, and push them to the chart
    for (var i = 0; i < data.length; i++) {
        chart.data.datasets[0].data.push({
            x: new moment(data[i].Date),
            y: data[i].Value
        });
    }
    return chart
}

function trimAppendData(data, addition){
    var endOfData = data[data.length-1].x

    for (var i = 0; i < addition.length; i++) {
        if(String(new moment(addition[i].Date)) == String(endOfData)){
            // remove everything before endOfData
            addition.splice(0, i);
            return addition
        }
    }
    return addition
}

function trimOld(data, maxAge){
    while (!(moment().diff(data[0].x) < maxAge)){
        data.shift()
    }
    return data
}


// If there are many datapoints in the chart, say 3000+, depending on the computer, the chart might become laggy.
// This data condensing function doesn't loose any significant information (The lines are identical),
// and often drastically reduces the number of datapoints.
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