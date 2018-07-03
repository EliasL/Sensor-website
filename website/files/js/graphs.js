var timeFormat = 'DD/MM/YYYY HH:mm';
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

function reDrawChart(chart, data) {
    chart.data.datasets[0].data = [];
    console.log(data.length)
    for (var i = 0; i < data.length; i++) {
        chart.data.datasets[0].data.push({
            x: new moment(data[i].Date),
            y: data[i].Value
        });
    }
    return chart
}