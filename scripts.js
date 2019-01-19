var infoWindow = null;
var YOUR_API_KEY = '';

function initMap() {

    var mapOptions = {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 2,
        draggableCursor: 'default'
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    map.addListener('click', function (e) {
        placeInfo(e.latLng, map);
    });

    infoWindow = new google.maps.InfoWindow;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var pp = new google.maps.LatLng(pos);
            console.log(pp);
            pp && placeInfo(pp, map);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    Console.log("Failed to get the location of the user");
}


function placeInfo(latLng, map) {
    if (infoWindow) {
        infoWindow.setContent(" ");
        infoWindow.close();
    }

    infoWindow = new google.maps.InfoWindow({
        position: latLng
    });
    getDateInfo(latLng);
    getWeatherInfo(latLng);
    infoWindow.open(map);
    map.panTo(latLng);
}

function getDateInfo(latLng) {
    console.log(latLng.lat());
    console.log(latLng.lng());
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/timezone/json?location=' + latLng.lat() + ',' + latLng.lng() + '&timestamp=1331161200&key=AIzaSyDxgGXW4sfECnf78_RvNTkWxjc2csn4BvE',
        success: function (data) {
            console.log(infoWindow.getContent());
            if (data["dstOffset"] == undefined)
                infoWindow.setContent("<p style=\"color:red;\">Date Time is not available<p>" + getInfoWindowContent());
            else
                infoWindow.setContent(formatDate(calcTime(data["dstOffset"] + data["rawOffset"])) + getInfoWindowContent());
        }
    })
}

function formatDate(data) {
    return data ? '<h2>Date</h2>' +
        '<div><p class="a">' + data + '</p></div> <br>' : null;
}

function formatWeather(data) {
    return '<h2>' + data["name"] + ' Weather</h2>' +
        '<div  id="w1">' +
        '<p class="b"> <b>' + data["weather"].map(a => a.description) + '</b> <br>' +
        '<i> Temp:</i> ' + data["main"].temp + ' &#x2103' + '<br>' +
        '<i> Pressure:</i> ' + data["main"].pressure + ' hPa ' + '<br>' +
        '<i> Humidity:</i> ' + data["main"].humidity + ' %' + '</p>' +
        '</div>';
}

function getInfoWindowContent() {
    return infoWindow.getContent() || "";
}

function getWeatherInfo(latLng) {
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/weather?lat=' + latLng.lat() + '&lon=' + latLng.lng() + '&appid=7d51455da54989ed6ea5d8872a5baeee&units=metric',
        success: function (data) {
            console.log(infoWindow.getContent());
            infoWindow.setContent(getInfoWindowContent() + formatWeather(data));
        },
        error: function (data) {
            console.log(data);
        }
    })
}

function calcTime(offset) {
    var d = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (1000 * offset));
    return nd.toLocaleDateString("en-US", options) + '<br>' + nd.toLocaleTimeString();
}