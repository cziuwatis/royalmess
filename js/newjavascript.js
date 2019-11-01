map = null;
let directionsDisplay = null;
let directionsService = null;
window.onload = displayMap();
async function displayMap()
{
    let locations = [];
    let TITLE = 0;
    let PHOTO = 1;
    let CONTENT = 2;
    let LATITUDE = 3;
    let LONGITUDE = 4;
    let LINK = 5;
    let BACKGROUND = 6;

    let url = "Json/map2.json";
    let urlParameters = "";

    try
    {
        const response = await fetch(url,
                {
                    method: "POST",
                    headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    body: urlParameters
                });

        updateWebpage(await response.json());
    } catch (error)
    {
        console.log("Fetch failed: ", error);
    }

    function updateWebpage(jsonData)
    {
        for (let i = 0; i < jsonData.length; i++)
        {
            locations.push([jsonData[i].title, jsonData[i].photo, jsonData[i].content, parseFloat(jsonData[i].latitude), parseFloat(jsonData[i].longtitude), jsonData[i].link, jsonData[i].background]);
        }

        map = new google.maps.Map(document.getElementById('mapDiv'),
                {zoom: 7,
                    center: new google.maps.LatLng(4.245551, 102.126119),
                    mapTypeId: google.maps.MapTypeId.ROADMAP});
        for (let i = 0; i < locations.length; i++)
        {
            let contentString = '<div id="div1" style="background-image:url(' + locations[i][BACKGROUND] + ')"><a href="' + jsonData[i].link + '"><img id="img1" src=' + locations[i][PHOTO] + ' alt=""/></a><div id="div2"><h1>' + locations[i][TITLE] + '</h1><p>' + locations[i][CONTENT] + '</p></div></div> ';
            let location_marker = new google.maps.Marker({title: locations[i][TITLE], animation: google.maps.Animation.DROP, position: new google.maps.LatLng(locations[i][LATITUDE], locations[i][LONGITUDE]), map: map});

            google.maps.event.addListener(location_marker, 'click', (function (location_marker, i) //here
            {
                return function ()
                {
                    mapWindow.setContent(contentString);
                    mapWindow.open(map, location_marker);
                }
            })(location_marker, i));
        }
        let mapWindow = new google.maps.InfoWindow();
        init();
    }


    let currentLocationMap = null;
    function init()
    {
        let start = document.getElementById('start');
        let end = document.getElementById('end');
        new google.maps.places.Autocomplete(start);
        new google.maps.places.Autocomplete(end);

        directionsService = new google.maps.DirectionsService();
        // route planner
        directionsDisplay = new google.maps.DirectionsRenderer();

        // add directions to the route
        directionsDisplay.setPanel(document.getElementById('directions'));
    directionsDisplay.setMap(map);

    }

    function calculateRoute()
    {
        let start = document.getElementById('start').value;
        let end = document.getElementById('end').value;

        let request = {origin: start,
            destination: end,
            travelMode: google.maps.TravelMode[travel]};

        directionsService.route(request, function (response, status)
        {
            if (status === google.maps.DirectionsStatus.OK)
            {
                directionsDisplay.setDirections(response);
            }
        });
    }
}



//calculate route 
