
// GRID
//#region
function getGraph(name, index) {
    var column = document.createElement("div");
    column.className = "col-md-4";

    var href = document.createElement("a");
    href.setAttribute("href", "sensor.html#" + index);

    var header = document.createElement("h2");
    header.align = "center";
    header.innerHTML = name;

    var canvas = document.createElement("canvas");
    canvas.id = "canvas" + index;
    canvas.align = "center";
    canvas.className = "chartjs-render-monitor";

    href.appendChild(header);
    column.appendChild(href);
    column.appendChild(canvas);
    return column;
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

function addGraphGrid(sensors, parentID) {
    var itemsPerRow = 3;
    var names = [];
    for (var i = 0; i < sensors.length; i++) {
        names.push(sensors[i].name);
    }

    var nrItems = names.length;

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
                row.appendChild(getGraph(names[index], index));
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
function getFolder(folderName, folderContent){
    
    var folder = document.createElement("li");
        folder.className = "list-unstyled";

        var link = document.createElement("a");
        link.href = "#";
        link.className ="dropdown-toggle nav-link";
        link.innerHTML = folderName;
        
        var content = document.createElement("ul");
        folderContent.forEach(folderDataItem => {
            content.appendChild(getSidebarItem(folderDataItem.name, "sensor.html#" + itemIndex));
            itemIndex += 1;
        });

    folder.appendChild(link);
    folder.appendChild(content);

    return folder;
}

var itemIndex = 0;

function addNavBar(sensorFolders, parentID) {
    var sidebar = getSidebar();

    sensorFolders.forEach(folder => {
        sidebar.firstChild.
        firstChild.
        firstChild.
        firstChild.appendChild(getFolder(folder.folderName, folder.sensors));
    });

    document.getElementById(parentID).appendChild(sidebar);
}
//#endregion

var sensorFolders = [ 
    {folderName: "El-watch", sensors: [
        {name: "Magnet 1",        id: "20006040"},
        {name: "Magnet 2",        id: "20006039"},
        {name: "Light",           id: "20004700"},
        {name: "Surface temp 1",  id: "20005880"},
        {name: "Surface temp 2",  id: "20005883"},
        {name: "Humidity",        id: "20004722"},
        {name: "Air temp 1",      id: "20004874"},
        {name: "Air temp 2",      id: "20004936"}
    ]},

    {folderName: "Telenor", sensors: [
         {name: "Node 1", id: "357517080049085"}
    ]},
    {folderName: "The Things Netowrk", sensors:[
        {name: "Power Compare", id: "power_compare"}
    ]}
];


var sensors = getSensors(sensorFolders);
console.log(sensors);
function getSensors(sensorFolders){
    sensors = [];
    sensorFolders.forEach(folder => {
        folder.sensors.forEach(sensor => {
            sensors.push(sensor);
        });
    });
    return sensors;
}

function createGridOnOverview() {
    var parent = "sensorGrid";
    addGraphGrid(sensors, parent);
}

function createSidebar() {
    var parent = "sensorTab";
    addNavBar(sensorFolders, parent);
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