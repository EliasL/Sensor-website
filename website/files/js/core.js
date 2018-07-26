
// Overview
//#region
function getGraphColumn(dataGraph, powerGraph, name, index){
    var column = document.createElement("div");
    column.className = "col-md-6";

    column.appendChild(dataGraph);
    column.appendChild(powerGraph);
    return column;
}

function getAbout(item){
    var col= document.createElement("div");
    col.className = "col-md-6";

    var top = document.createElement("div");
    top.className = "page-header";

    var topRow = document.createElement("div");
    topRow.className = "row";

    cCol = document.createElement("div");
    cCol.className = "col-md-5";
    var href = document.createElement("a");
    href.setAttribute("href", item.company.website);
    var company = document.createElement("h5");
    company.innerHTML = "Company: " + item.company.name;
    href.className="pull-left";
    href.appendChild(company);
    cCol.appendChild(href);
    company = cCol;


    tCol = document.createElement("div");
    tCol.className = "col-md-5";
    var href = document.createElement("a");
    href.setAttribute("href", item.tecnology.website);
    var tecnology = document.createElement("h5");
    tecnology.innerHTML = "Tecnology: " + item.tecnology.name;
    tecnology.className="text-right";
    href.className="pull-right";
    href.appendChild(tecnology);
    tCol.appendChild(href);
    tecnology = tCol;

    var about = document.createElement("div");
    about.innerHTML = item.about;
    about.align = "left";

    topRow.appendChild(company);
    topRow.appendChild(tecnology);
    top.appendChild(topRow);
    col.appendChild(top);
    col.appendChild(about);
    return col;
}

function getGraph(index) {
    var canvas = document.createElement("canvas");
    canvas.id = "canvas" + index;
    canvas.align = "center";
    canvas.className = "chartjs-render-monitor";
    return canvas;
}

function getRow() {
    var row = document.createElement("div");
    row.className = "row";
    return row;
}



function getSpacing() {
    var space = document.createElement("hr");
    space.className = "custom-space";
    return space;
}

function addOverview(sensors, parentID) {
    var itemsPerRow = 1;

    var nrItems = sensors.length;

    for (var i = 0; i < nrItems / itemsPerRow; i++) {

        var row = getRow();

        for (var j = 0; j < itemsPerRow; j++) {
            index = i * itemsPerRow + j;
            //Done? In case number of items is not divisible by itemsPerRow
            if (index == nrItems) {
                break;
            }
            //Add item
            else {
                var col = document.createElement("div");
                col.className = "col-md-10";
                var subRow = getRow();

                var href = document.createElement("a");
                href.setAttribute("href", "sensor.html#" + index);
            
                var header = document.createElement("h2");
                header.align = "center";
                header.innerHTML = sensors[index].name;
                header.className = "pb-5";

                href.appendChild(header);
                col.appendChild(href);

                dataGraph = getGraph(index * 2);
                powerGraph = getGraph(index * 2 + 1);
                subRow.appendChild(getGraphColumn(dataGraph, powerGraph, sensors[index].name, index));
                console.log(sensors[index]);
                subRow.appendChild(getAbout(sensors[index].about))
                col.appendChild(subRow);
                row.appendChild(col);
            }
        }
        //Add row
        document.getElementById(parentID).appendChild(row);
        document.getElementById(parentID).appendChild(getSpacing());
    }
}
//#endregion

//SIDEBAR
//#region

function getSidebar() {
    var row = getRow();
    

    var sidebar = document.createElement("div");
    sidebar.className = "col-md-2 d-none d-md-block bg-light sidebar";

    var sticky = document.createElement("div");
    sticky.className = "sidebar-sticky";

    var column = document.createElement("div");
    column.className = "nav flex-column";

    var nav = document.createElement("ul");
    nav.className="folder";
    nav.id = "nav";

    column.appendChild(nav);
    sticky.appendChild(column);
    sidebar.appendChild(sticky);
    row.appendChild(sidebar);

    return row;
}

function getSidebarItem(name, link) {
    var navItem = document.createElement("li");
    navItem.className = "nav-item"

    var navLink = document.createElement("a");
    navLink.className = "nav-item";
    navLink.href = link;
    navLink.innerHTML = name;

    navItem.appendChild(navLink);

    return navItem;
}


var sensorIndex = 0;
function getFolder(name, folderContent){
    
    var folder = document.createElement("li");
    folder.className = "list-unstyled";

    var link = document.createElement("a");
    link.href = "#";
    link.className ="dropdown-toggle nav-link";
    link.innerHTML = name;
    
    var content = document.createElement("ul");
    folderContent.forEach(folderDataItem => {
        content.appendChild(getSidebarItem(folderDataItem.name, "sensor.html#" + sensorIndex));
        sensorIndex += 1;
    });

    folder.appendChild(link);
    folder.appendChild(content);

    return folder;
}

function getParentFolder(name, folderContent){
    var folder = document.createElement("li");
    folder.className = "list-unstyled";

    var link = document.createElement("a");
    link.href = "#";
    link.className ="dropdown-toggle nav-link";
    link.innerHTML = name;
    
    var content = document.createElement("ul");
    folderContent.forEach(folderDataItem => {
        if(folderDataItem.type == "sensor"){
            content.appendChild(getSidebarItem(folderDataItem.name, "sensor.html#" + sensorIndex));
            sensorIndex += 1;
        } else if(folderDataItem.type == "powerInfo"){
            content.appendChild(getSidebarItem(folderDataItem.name, "powerInfo.html#" + folderDataItem.name));
        } else if(folderDataItem.type == "folder"){
            content.appendChild(getParentFolder(folderDataItem.name, folderDataItem.content));
        }
    });

    folder.appendChild(link);
    folder.appendChild(content);

    return folder;
}

function addNavBar(sidebarFolders, parentID) {


    var sidebar = getSidebar();


    sidebarFolders.forEach(folder => {
        sidebar.firstChild.
        firstChild.
        firstChild.
        firstChild.appendChild(getParentFolder(folder.name, folder.content));
    });

    document.getElementById(parentID).appendChild(sidebar);
}
//#endregion


var elwatchAbout = {
    company: {name: "Elwatch", website:"https://neuronsensors.com"},
    tecnology: {name: "SI1083 propitary fx radio", website:"https://www.silabs.com/products/wireless/proprietary/si10xx-sub-ghz/device.si1083"},
    about: "Elwatch produces small blue boxes that all have one sensor each. They are very simple for anyone to use, and are mainly for general monitorisation, but can be implemented in more complex systems. The so called Neurons are fully functional and a well made product. Web services however, are sill in development. Each neuron has an estimated lifetime of 15 years."};

var telenorAbout = {
    company: {name: "Telenor", website:"https://docs.exploratory.engineering/"}, 
    tecnology: {name: "NarowBand IoT", website:"https://www.telenor.no/bedrift/iot/narrowband/?gclid=EAIaIQobChMI6oaXtcS83AIVR-WaCh1g-QExEAAYASAAEgJDNfD_BwE&s_kwcid=AL!285!3!200395911548!b!!g!!%2Bnb%20%2Biot%20%2Btelenor&ef_id=W1iG2gAAB3jMgxN_:20180726101537:s"}, 
    about: "Telenors Exploratory Engineering are in the process of developing this NB-IoT system. As such, there is currently limited suport and funcionallity. There is for example currently no way to request data within a timeframe, you download all the data you have collected every single time you want to check if there is new data available. This is expected to change."};

var TTNAbout = {
    company: {name: "The Things Network", website:"https://www.thethingsnetwork.org/"}, 
    tecnology: {name: "LoRaWAN", website:"https://www.lora-alliance.org/about-lorawan"}, 
    about: "The Things Network has a very well implemented hardware and software datastructure. With a pleasing and well structured online dashboard, and relatively simple API, it is a good product. Encoding and decoding is left for the user to do themselves which creates useless complication for some, but perhaps deerly needed custom optimized data commpression for others."};


var sidebarFolders = [ 
    {name: "Data graphs", type: "folder", content: [
        {name: "El-watch", type: "folder", content: [
            /*
            {name: "Magnet 1",       type: "sensor", id: "20006040", unit: "",  about: elwatchAbout},
            {name: "Magnet 2",       type: "sensor", id: "20006039", about: elwatchAbout},
            {name: "Light",          type: "sensor", id: "20004700", about: elwatchAbout},
            {name: "Surface temp 1", type: "sensor", id: "20005880", about: elwatchAbout},
            {name: "Surface temp 2", type: "sensor", id: "20005883", about: elwatchAbout},
            {name: "Humidity",       type: "sensor", id: "20004722", about: elwatchAbout},
            */
            {name: "Air temp 1",     type: "sensor", id: "20004874", unit:"°C", about: elwatchAbout},
            //{name: "Air temp 2",     type: "sensor", id: "20004936", about: elwatchAbout}
        ]},

        {name: "Telenor", type: "folder", content: [
            {name: "Node 1", type: "sensor", id: "357517080049085", unit:"°C", about: telenorAbout}
        ]},
        {name: "The Things Network", type: "folder", content:[
            {name: "Temperature reader", type: "sensor", id: "temp_reader1", unit:"°C", about: TTNAbout}
        ]}
    ]},
    {name: "Power usage", content:[
        {name: "El-watch", type: "powerInfo"},

        {name: "Telenor", type: "powerInfo"},
        {name: "The Things Network", type: "powerInfo"}
    ]}
];


var sensors = getAllSensors(sidebarFolders);

function getAllSensors(folders){
    const items = [];
    folders.forEach(item =>{
        if(item.type == "folder"){
            getAllSensors(item.content).forEach(childItem =>{
                items.push(childItem);
            })
        } else{
            if(item.type == "sensor"){
                items.push(item);
            }
        }
    });
    return items;
}

function createOverview() {
    var parent = "Overview";
    addOverview(sensors, parent);
}

function createSidebar() {
    var parent = "sensorTab";
    addNavBar(sidebarFolders, parent);
}

// If createing toggle isn't done with a function, it appears as a checkbox while the page is loading
function createToggle(){
    var toggle = document.createElement("input");
    toggle.type="checkbox";
    toggle.setAttribute("data-height", "31");
    toggle.setAttribute("data-width", "150");
    toggle.setAttribute("data-toggle", "toggle");
    toggle.id="condenseData";
    toggle.setAttribute("data-on", "Show all data");
    toggle.setAttribute("data-off", "Condense data");
    document.getElementById("Toggle button").appendChild(toggle);
}

function folderLogic(){
    $("#nav li a").on("click", function (e) {
        //allow links to be followed if they don't have a sub-menu
        if ( !$(this).parent().has("ul").length ) { return; }
    
        //we have a sub-menu, so stop the link from being followed
        e.preventDefault();
    
        if(!$(this).hasClass("open")) {
            //we need to know which 'level' we're on 
            var currentLevel = $(this).closest('ul')
            $("li ul", currentLevel).slideUp(350);
            $("li a", currentLevel).removeClass("open");
    
            // open our new menu and add the open class
            $(this).next("ul").slideDown(350);
            $(this).addClass("open");
        } else {
            $(this).removeClass("open");
            $(this).next("ul").slideUp(350);
        }
    });
}