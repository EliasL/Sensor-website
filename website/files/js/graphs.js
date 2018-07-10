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
    // Check if the data only spans a short time, if it's short, it means only append data, if it's long, replace data
    if (data.length == 0){
        return chart
    }
    var oldest = new moment(data[0].Date)
    var newest = new moment(data[data.length-1].Date)
    var duration = moment.duration(newest.diff(oldest));
    if (duration < moment.duration(1, 'minutes')){
        data = trimAppendData(chart.data.datasets[0].data, data)
    }else{
        chart.data.datasets[0].data = [];
    }

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

    for (let i = 0; i < addition.length; i++) {
        if(String(new moment(addition[i].Date)) == String(endOfData)){
            // remove everything before endOfData
            addition.splice(0, i);
            return addition
        }
    }
    return addition
}