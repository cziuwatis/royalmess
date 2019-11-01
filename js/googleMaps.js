//adapted from derek.dkit.ie
window.onload = onAllAssetsLoaded;
function onAllAssetsLoaded()
{
    loaderChange();
    displayMap();
    loadMatches();
}
function loaderChange()
{
    /*loader*/
    setTimeout(function () {
        //using overflow: hidden on body breaks the carousel.
        //using overflow: hidden on main doesn't work.
        //using display: none for main breaks the carousel.
        //resorting to opacity 1 but leaves the scrollbar visible that way :x
        document.getElementById("main").style.opacity = '1';
        document.getElementById("loader").style.display = "none";
    }, 1500);
    /*\loader*/
}
let stadiumMarkers = [];
let infoBoxesStadiums = [];
let map;
let directionsService = null;
let directionsDisplay = null;
let STARTPOSITION = new google.maps.LatLng(38.2048, 139.2529);
let STARTINGZOOM = 5.7;
let transportType = google.maps.TravelMode.DRIVING;
let services_centre_location;
let services_centre_location_marker = new google.maps.Marker();
let geocoder = new google.maps.Geocoder();
let childNodesStadiums = [];
let childNodesMenuStadiums = [];
let infoBoxesServices = [];
let nearbyServicesMarkers = [];
let icons = {
    restaurant: "images/markerIcons/restaurant.png",
    cafe: "images/markerIcons/cafe.png",
    hotel: "images/markerIcons/hotel.png",
    takeaway: "images/markerIcons/takeaway.png",
    bakery: "images/markerIcons/bakery.png",
    bar: "images/markerIcons/bar.png",
    night_club: "images/markerIcons/cocktail.png",
    parking: "images/markerIcons/parking.png",
    trophy: 'images/markerIcons/trophy-shape4.png',
    center: 'images/markerIcons/marker.png'
};
let previous_centre_location;
let previous_service_type;
let searchResults = [];
let clickedServiceContent = "";
let nearbySearchRunning = false;
let error_id;
function displayErrorMessage(error)
{
    clearTimeout(error_id);
    let e = document.getElementById('error_message');
    e.innerHTML = error;
    e.classList.add('error_message_show');
    error_id = setTimeout(function () {
        e.classList.remove('error_message_show');
    }, 3000);
}
async function displayMap()
{
    /****/
    let latLngBoundsRestrictions = {north: 46.828998, south: 28.690477, west: 123.200055, east: 153.668494};
    let start_route_element = document.getElementById("start_route_destination");
    let end_route_element = document.getElementById("end_route_destination");
    let map_directions_panel = document.getElementById('map_directions');
    let map_control_panel_panel = document.getElementById('map_control_panel');
    let map_transport_mode_panel = document.getElementById('map_transport_mode');
    let map_nearby_service_type_panel = document.getElementById('map_nearby_service_type');
    let map_nearby_service_loading_panel = document.getElementById('map_nearby_service_loading');
    //map context menu elements
    let map_context_menu = document.getElementById('map_context_menu');
    let map_context_add_to_start_element = document.getElementById('mc_add_to_start_route');
    let map_context_add_to_end_element = document.getElementById('mc_add_to_end_route');
    let map_context_set_centre_element = document.getElementById('mc_set_service_centre');
    let map_context_cancel_element = document.getElementById('mc_cancel');
    //end of map context menu elements
    let map_element = document.getElementById('map');
    let json_url = "./json/stadiums.json";
    let url_parameters = "";
    /****/
    let autocomplete_options =
            {
                componentRestrictions: {country: "jp"}
            };
    new google.maps.places.Autocomplete(start_route_element, autocomplete_options);
    new google.maps.places.Autocomplete(end_route_element, autocomplete_options);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setPanel(map_directions_panel);
    map = new google.maps.Map(map_element,
            {
                zoom: STARTINGZOOM,
                center: STARTPOSITION,
                restriction: {
                    latLngBounds: latLngBoundsRestrictions
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [
                    {
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "lightness": -5
                            }
                        ]
                    },
                    {
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "lightness": -30
                            }
                        ]
                    },
                    {
                        "elementType": "labels",
                        "stylers": [
                            {
                                "saturation": 20
                            },
                            {
                                "lightness": 25
                            },
                            {
                                "weight": 0.5
                            }
                        ]
                    },
                    {
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "saturation": -55
                            }
                        ]
                    },
                    {
                        "elementType": "labels.text",
                        "stylers": [
                            {
                                "color": "#ff5353"
                            },
                            {
                                "weight": 3
                            }
                        ]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            },
                            {
                                "saturation": -65
                            },
                            {
                                "weight": 3.5
                            }
                        ]
                    },
                    {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.text",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.business",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "stylers": [
                            {
                                "saturation": -45
                            },
                            {
                                "lightness": 55
                            }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "labels.text",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#1ea5df"
                            },
                            {
                                "saturation": -20
                            },
                            {
                                "lightness": 25
                            }
                        ]
                    }
                ]
            });
    map.controls[google.maps.ControlPosition.LEFT_TOP].push
            (map_control_panel_panel);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push
            (map_directions_panel);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push
            (map_transport_mode_panel);
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push
            (map_nearby_service_type_panel);
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push
            (map_nearby_service_loading_panel);
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push
            (map_context_menu);
    directionsDisplay.setMap(map);
    map.addListener("rightclick", function (e)
    {
        //add to google panels.
        let xOffset = -14;
        let yOffset = 7;
        map_context_menu.style.left = e.pixel.x + xOffset + 'px';
        map_context_menu.style.top = e.pixel.y + yOffset + 'px';
        map_context_menu.style.display = 'block';
        map_context_add_to_start_element.onclick = function () {
            geocodeToAddressAndAddToElement(e.latLng, start_route_element);
            hideContextMenu();
        };
        map_context_add_to_end_element.onclick = function () {
            geocodeToAddressAndAddToElement(e.latLng, end_route_element);
            hideContextMenu();
        };
        map_context_set_centre_element.onclick = function () {
            services_centre_location = e.latLng;
            services_centre_location_marker.setMap(null);
            services_centre_location_marker = new google.maps.Marker({
                position: e.latLng,
                title: 'Service centre location',
                icon: {
                    url: icons.center,
                    scaledSize: new google.maps.Size(30, 30) // scaled size
                }
            });
            services_centre_location_marker.setMap(map);
            hideContextMenu();
        };
        map_context_cancel_element.onclick = function () {
            hideContextMenu();
        };
        function hideContextMenu()
        {
            map_context_menu.style.display = 'none';
        }
    });
    try
    {
        const response = await fetch(json_url,
                {
                    method: "POST",
                    headers: {'Content-type': 'application/x-www-formurencoded; charset=UTF-8', 'Allow': 'GET, POST, HEAD'},
                    body: url_parameters
                });
        let fetchedData = await response.json();
        updateGoogleMaps(fetchedData);
    } catch (error)
    {
        console.log("Fetch failed: ", error);
    }
    function updateGoogleMaps(jData)
    {
        let location_marker;
//        let stadiumContainerElement = document.getElementById("stadiumsContainer");
        let stadium_names_container = document.getElementById("stadiumNames");
        let stadium_description_container = document.getElementById("stadiumDescription");
        let icon_image =
                {
                    url: icons.trophy,
                    scaledSize: new google.maps.Size(35, 35)
                };
        for (let i = 0; i < jData.length; i++)
        {

            stadium_names_container.innerHTML += '<div id="stadium__name' + i + '" onclick="hideStadiumsDescriptions();document.getElementById(\'stadium' + i + '\').classList.add(\'show-nice\');document.getElementById(\'stadium' + i + '\').classList.remove(\'hide\');this.classList.add(\'stadium-selected\')" class="row">' + jData[i].title + '</div>';
            stadium_description_container.innerHTML += '<div id="stadium' + i + '"class="hide agile_team_grid"><div class="stadium_image_container agile_team_grid_main"><img class="img-responsive" alt="stadium image" src="' + jData[i].image + '"><div  class="p-mask"><a onclick="showStadiums(' + i + ')" class="scroll" style="position:relative;color:#fff;" href="#map" >DISPLAY ON MAP</a></div></div><div><img style="width: 5.5em;height:4.5em;" src="images/markerIcons/trophy-shape4.png">' + jData[i].description + '<br><br><strong>Capacity:</strong> ' + jData[i].capacity + '<br><strong>Completed in:</strong> ' + jData[i].completedIn + '</div></div>';
//            stadiumContainerElement.innerHTML += "<div  id='stadium" + i + "' class='col-md-3 agile_team_grid team-left-w3l-agile'><div class='agile_team_grid_main'><img style='height:100%;width:100%' src='" + jData[i].image + "' alt='' class='img-responsive' /><div  class='p-mask'><a onclick='showStadiums(" + i + ")' class='scroll' style='position:relative;color:#fff;' href='#map' >DISPLAY ON MAP</a></div></div><div class='agile_team_grid1'><h3>" + jData[i].title + "</h3></div></div>";
//            problem with geocoding is that if I use the address got from the coordinates as the point it shows incorrect positions so I just added the geocoded address to title of the element to show I can use it
            let content_string = '<div id="marker_content" class="animate-marker"><div id="marker_header" style="background-image: url(' + jData[i].image + ')"><div id="marker_icons_container"><i onclick="geocodeToAddressAndAddToElement(new google.maps.LatLng(' + parseFloat(jData[i].latitude) + ',' + parseFloat(jData[i].longitude) + '), document.getElementById(\'end_route_destination\'));" class="fa fa-flag-checkered"></i><i onclick="geocodeToAddressAndAddToElement(new google.maps.LatLng(' + parseFloat(jData[i].latitude) + ',' + parseFloat(jData[i].longitude) + '), document.getElementById(\'start_route_destination\'));" class="fa fa-flag"></i><i id="marker_more_info" class="fa fa-info" onclick="document.getElementById(\'stadium__name' + i + '\').click();document.getElementById(\'stadiums\').scrollIntoView({behavior:\'smooth\'});"></i></div><h2 id="marker_title">' + jData[i].title + '</h2></div></div>';
//            let content_string = '<div id="marker_content" class="animate-marker"><div id="marker_header" style="background-image: url(' + jData[i].image + ')"><div id="marker_icons_container"><i onclick="document.getElementById(\'end_route_destination\').value = \'' + jData[i].latitude + ', ' + jData[i].longitude + '\'" class="fa fa-flag-checkered"></i><i onclick="document.getElementById(\'start_route_destination\').value = \'' + jData[i].latitude + ', ' + jData[i].longitude + '\'" class="fa fa-flag"></i><i id="marker_more_info" class="fa fa-info" onclick="document.getElementById(\'stadium__name' + i + '\').click();document.getElementById(\'stadiums\').scrollIntoView({behavior:\'smooth\'});"></i></div><h2 id="marker_title">' + jData[i].title + '</h2></div></div>';
            location_marker = new google.maps.Marker(
                    {
                        title: jData[i].title,
                        icon: icon_image,
                        position: new google.maps.LatLng(parseFloat(jData[i].latitude), parseFloat(jData[i].longitude)),
                        map: map,
                        zIndex: i
                    });
            infoBoxesStadiums[i] = new InfoBox
                    (
                            {
                                boxClass: "marker_content",
                                content: content_string,
                                disableAutoPan: false,
                                alignBottom: true,
                                pixelOffset: new google.maps.Size(-25, -24),
                                boxStyle:
                                        {
                                            opacity: 1
                                        },
                                closeBoxMargin: "0px -7px -13px 0px",
//                                closeBoxMargin: "-25px -53px 0px 0px",
                                closeBoxURL: "images/x-button1.png",
                                infoBoxClearance: new google.maps.Size(30, 20)
                            }
                    );
            stadiumMarkers.push(location_marker);
            google.maps.event.addListener(location_marker, 'click', (function ()
            {
                showStadiums(this.zIndex);
            }));
        }
//        stadiumContainerElement.innerHTML += '<div class="clearfix"> </div>';
        //gets all created stadium names and descriptions. Used in the gallery panel.
        childNodesStadiums = document.querySelectorAll("#stadiumDescription > div");
        childNodesMenuStadiums = document.querySelectorAll("#stadiumNames > div");
    }
}
/*
 * Get coordinates and input to title of an element. (Title this case since if we use value from the address it leads to inaccurate start/end point.
 * @param {type} latLng google maps LatLng object of the coordinates of the point to be changed to human readable address
 * @param {type} element element to which to add to title the readable address
 * @returns {undefined} void
 */
function geocodeToAddressAndAddToElement(latLng, element)
{
    geocoder.geocode({'location': latLng}, function (results, status) {
        if (status === 'OK')
        {
            element.title = results[0].formatted_address;
            element.value = latLng.toString().replace(/[\(\)]/g, '');
        } else
        {
            element.title = latLng.toString().replace(/[\(\)]/g, '');
            console.log('Failed to geocode selected location due to: ' + status);
        }
    });
}
/**hides any opened stadium descriptions and removes the selected stadium class**/
function hideStadiumsDescriptions()
{
    for (let j = 0; j < childNodesStadiums.length; j++)
    {
        childNodesStadiums[j].classList.add("hide");
    }
    for (let j = 0; j < childNodesMenuStadiums.length; j++)
    {
        childNodesMenuStadiums[j].classList.remove("stadium-selected");
    }
}
/**Calculates the route between 2 points on the map**/
function calculateRoute()
{
    let start = document.getElementById('start_route_destination').value;
    let end = document.getElementById('end_route_destination').value;
    if (!start || !end)
    {
        //so doesn't use directions service if fields are empty. 
        displayErrorMessage("One of the directions fields is empty. Make sure to set the start and end point for directions.");
    } else
    {
        let request = {origin: start,
            destination: end,
            travelMode: transportType};
        directionsService.route(request, function (response, status)
        {
            if (status === google.maps.DirectionsStatus.OK)
            {
                closeAllMarkers();
                directionsDisplay.setDirections(response);
                document.getElementById('map_directions').className = "unhide";
                document.getElementById('map_transport_mode').className = "unhide";
            } else
            {
                displayErrorMessage("Unable to find any routes with specified settings");
            }
        });
    }
}
function switchStartEndRoutes()
{
    let startValue = document.getElementById("start_route_destination").value;
    document.getElementById("start_route_destination").value = document.getElementById("end_route_destination").value;
    document.getElementById("end_route_destination").value = startValue;
}
function clearRouteFields()
{
    document.getElementById("start_route_destination").value = null;
    document.getElementById("end_route_destination").value = null;
    //removes route displayed
    directionsDisplay.set('directions', null);
    displayErrorMessage("Route cleared.");
}
/**Closes all and resets everything to map's starting state**/
function resetAllGoogleMaps()
{
    hideMapDirections();
    clearRouteFields();
    closeAllMarkers();
    map.setZoom(STARTINGZOOM);
    map.panTo(STARTPOSITION);
    services_centre_location = null;
    services_centre_location_marker.setMap(null);
    if (nearbyServicesMarkers.length > 0)
    {
        for (let i = 0; i < nearbyServicesMarkers.length; i++)
        {
            nearbyServicesMarkers[i].setVisible(false);
        }
    }
}
/**Hides map directions panel with the map transport mode type panel**/
function hideMapDirections()
{
    document.getElementById('map_directions').className = 'hide';
    document.getElementById('map_transport_mode').className = 'hide';
}
function showStadiums(id)
{
    closeAllMarkers();
    if (map.getZoom() < 13 || map.getZoom() > 16)
    {
        map.setZoom(16);
    }
    infoBoxesStadiums[id].open(map, stadiumMarkers[id]);
    services_centre_location_marker.setMap(null);
    services_centre_location = stadiumMarkers[id].position;
    getNearbyServices();
}
function getNearbyServices()
{
    let nearby_service_search_loading_panel = document.getElementById("map_nearby_service_loading");
    if (nearbySearchRunning)
    {
        displayErrorMessage("Service search already running. Please wait before searching for something new");
    } else if (services_centre_location)
    {
        nearbySearchRunning = true;
        let searchPage = 1;
        let service_type = getServiceType();
        if (services_centre_location === previous_centre_location && service_type === previous_service_type)
        {
            //console log only for the educational project so I do not forget the reason for this.
            console.log("same service location and same type of service search so won't do it to limit money spent in google api");
            nearbySearchRunning = false;
        } else
        {
            //show loading message
            nearby_service_search_loading_panel.className = 'unhide';
            // hide any previously displayed services markers
            if (nearbyServicesMarkers.length > 0)
            {
                for (let i = 0; i < nearbyServicesMarkers.length; i++)
                {
                    nearbyServicesMarkers[i].setVisible(false);
                }
            }
            // empty infoBoxesServices[], so that it can be used to hold the nearby services markers for the currently clicked marker
            infoBoxesServices = [];
            nearbyServicesMarkers = [];
            searchResults = [];
            previous_service_type = service_type;
            previous_centre_location = services_centre_location;
            let service = new google.maps.places.PlacesService(map);
            service.nearbySearch(
                    {
                        location: services_centre_location,
                        radius: 3000,
                        type: [service_type]
                    }, getNearbyServicesMarkers);
        }
        function getNearbyServicesMarkers(results, status, pagetoken)
        {
            if (status === google.maps.places.PlacesServiceStatus.OK)
            {
                //reason for this different code than the one used in our labs
                //https://stackoverflow.com/a/49704218 as google has a limit on searches
                //I just find all results for my search and then create the markers.
                for (let k = 0; k < results.length; k++)
                {
                    searchResults.push(results[k]);
                }
                if (pagetoken.hasNextPage && searchPage < 2) //searchPage < 2 to lower search results to max 40
                {
                    searchPage++;
                    pagetoken.nextPage();
                } else
                {
                    for (let i = 0; i < searchResults.length; i++)
                    {
                        nearby_service_search_loading_panel.className = 'hide';
                        setTimeout(function () {
                            createMarker(searchResults[i]);
                        }, 50 * i);
                    }
                    nearbySearchRunning = false;
                }
            } else
            {
                displayErrorMessage("No service of that type was found!");
                nearby_service_search_loading_panel.className = 'hide';
                nearbySearchRunning = false;
            }
        }
        function createMarker(place)
        {
            let icon = {
                url: determineIcon(place.icon, place.types[0]),
                scaledSize: new google.maps.Size(30, 30) // scaled size
            };
            let serviceMarker = new google.maps.Marker(
                    {
                        map: map,
                        position: place.geometry.location,
                        animation: google.maps.Animation.DROP,
                        icon: icon,
                        zIndex: infoBoxesServices.length
                    });
            nearbyServicesMarkers.push(serviceMarker);
            infoBoxesServices.push(new InfoBox
                    (
                            {
                                boxClass: "service_content",
                                disableAutoPan: false,
                                alignBottom: true,
                                pixelOffset: new google.maps.Size(-25, -24),
                                boxStyle:
                                        {
                                            opacity: 1
                                        },
                                closeBoxMargin: "-13px -11px 0px 0px",
                                closeBoxURL: "images/x-button1.png",
                                infoBoxClearance: new google.maps.Size(30, 20)
                            }
                    ));
            google.maps.event.addListener(serviceMarker, 'click', function ()
            {
                let e = this;
                let request = {
                    placeId: searchResults[e.zIndex].place_id,
                    fields: ['name', 'icon', 'photos', 'types', 'formatted_address', 'opening_hours', 'international_phone_number', 'geometry']
                };
                service = new google.maps.places.PlacesService(map);
                //callback function, need to include the code in there since
                //the clickedServiceContent executed at a different time and so
                //it kept giving the previous marker's content...
                //also getting details here to limit google api requests
                service.getDetails(request, function (place, status)
                {
                    if (status === google.maps.places.PlacesServiceStatus.OK)
                    {
                        clickedServiceContent = generateHTMLString(place);
                        closeAllMarkers();
                        infoBoxesServices[e.zIndex].content_ = clickedServiceContent;
                        infoBoxesServices[e.zIndex].open(map, e);
                        map.panTo(e.position);
                    }
                });
            });
        }
        function generateHTMLString(place)
        {
            //String formatting for services and their marker contents
            let placePhoto = "http://www.wellesleysocietyofartists.org/wp-content/uploads/2015/11/image-not-found.jpg";
            if (place.photos)
            {
                placePhoto = place.photos[0].getUrl();
            }
            let placeAddress = "No address found.";
            if (place.formatted_address)
            {
                placeAddress = place.formatted_address;
                placeAddress = placeAddress.replace(/,/g, '<br>');
            }
            let placeType = place.types[0].replace(/_/g, ' ');
            let placeOpeningHours = "No opening hours found";
            if (place.opening_hours)
            {
                placeOpeningHours = place.opening_hours.weekday_text;
                //callback function for replace https://stackoverflow.com/questions/13721758/how-to-search-replace-with-regex-and-keep-case-as-original-in-javascript
                //sometimes opening hours 2 in one day so need to separate
                placeOpeningHours = placeOpeningHours.toString().replace(/,\w/g, function (match) {
                    return '</td></tr><tr><td>' + match.replace(/,/g, '');
                });
                placeOpeningHours = placeOpeningHours.replace(/: /g, '</td><td>');
            }
            let placePhoneString = "";
            if (place.international_phone_number)
            {
                placePhoneString = "<div class='service_phone'>International phone number: " + place.international_phone_number + "</div>";
            }
            let placeCoordinates = place.geometry.location.toString().replace(/[\(\)]/g, '');
            let placeCoordinateIconsString = '<div class="service_coordinate_icons"><i onclick="document.getElementById(\'start_route_destination\').value = \'' + placeCoordinates + '\'" class="fa fa-flag"></i><i onclick="document.getElementById(\'end_route_destination\').value = \'' + placeCoordinates + '\'" class="fa fa-flag-checkered"></i></div>';
            let htmlContent = "<div class='service_type'><img src='" + determineIcon(place.icon, place.types[0]) + "'> (" + placeType + ")" + placeCoordinateIconsString + "</div><h7 class='service_title'>" + place.name.toUpperCase() + "</h7><img alt='Failed to load service image. Might've not been found' class='service_img' img src='" + placePhoto + "'><div class='service_details'><table class='service_opening_hours'><tr><td>" + placeOpeningHours + "</td></tr></table><div class='service_address'><strong>Address:</strong><br>" + placeAddress + "" + placePhoneString + "</div></div>";
            return htmlContent;
        }

        function determineIcon(placeIcon, placeType)
        {
            let icon_url;
            if (placeType === "restaurant")
            {
                icon_url = icons.restaurant;
            } else if (placeType === "cafe")
            {
                icon_url = icons.cafe;
            } else if (placeType === "meal_takeaway" || placeType === "meal_delivery")
            {
                icon_url = icons.takeaway;
            } else if (placeType === "lodging")
            {
                icon_url = icons.hotel;
            } else if (placeType === "bakery")
            {
                icon_url = icons.bakery;
            } else if (placeType === "parking")
            {
                icon_url = icons.parking;
            } else if (placeType === "night_club")
            {
                icon_url = icons.night_club;
            } else if (placeType === "bar")
            {
                icon_url = icons.bar;
            } else
            {
                icon_url = placeIcon;
            }
            return icon_url;
        }
        function getServiceType()
        {
            let radios = document.getElementsByName('servicesType');
            let k = 0;
            while (k < radios.length && !radios[k].checked)
            {
                k++;
            }
            return radios[k].value;
        }
    } else
    {
        displayErrorMessage("Select a location for the nearby service search first!");
    }
}
function closeAllMarkers()
{
    for (let k = 0; k < infoBoxesStadiums.length; k++)
    {
        infoBoxesStadiums[k].close();
    }
    for (let k = 0; k < infoBoxesServices.length; k++)
    {
        infoBoxesServices[k].close();
    }
}
