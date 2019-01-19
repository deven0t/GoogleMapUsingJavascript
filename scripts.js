var markers = [];
var infoWindow = null;
var YOUR_API_KEY = 'AIzaSyDxgGXW4sfECnf78_RvNTkWxjc2csn4BvE';

function initMap() {
    var map;

    var mapOptions = {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 2,
        draggableCursor: 'default'
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    map.addListener('click', function (e) {
        placeMarker(e.latLng, map);
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
            pp && placeMarker(pp, map);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    // infoWindow.open(map);
}


function placeMarker(latLng, map) {
    // if (typeof markers[0] != 'undefined') {
    //     markers[0].setMap(null); markers.length = 0;
    // }
    // var marker = new google.maps.Marker({
    //     position: latLng,
    //     map: map
    // });

    // markers.push(marker);

    if (infoWindow) {
        infoWindow.close();
    }

    infoWindow = new google.maps.InfoWindow({
        content: callForInfo(latLng),
        position: latLng
    });
    infoWindow.open(map);
    map.panTo(latLng);
}

function callForInfo(latLng) {
    console.log(latLng.lat());
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/timezone/json?location=' + latLng.lat() + ',' + latLng.lng() + '&timestamp=1331161200&key=' + YOUR_API_KEY,
        success: function (data) {
            console.log(data);
            // console.log(calcTime(data["dstOffset"] + data["rawOffset"] + 1331161200));
            infoWindow.setContent(calcTime(data["dstOffset"] + data["rawOffset"]));
        }
    })
}

function calcTime(offset) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    // console.log(d.getTimezoneOffset() * 60000 + 1331161200);
    var ndtmp = new Date(d.getTimezoneOffset() * 60000 + 1331161200);
    // console.log(ndtmp.toLocaleDateString() + " " + ndtmp.toLocaleTimeString());
    // console.log(d.toLocaleDateString() + " " + d.toLocaleTimeString());
    var nd = new Date(utc + (1000 * offset));
    //  var nd = new Date((offset) * 3600000);
    // alert("The local time is " + nd.toLocaleString());
    return nd.toLocaleDateString() + " " + nd.toLocaleTimeString();
}