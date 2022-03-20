$(document).ready(function(){
    $('.sidenav').sidenav();
})

$('.datepicker').datepicker({

})

var map;
var mapOptions;
var cityName;
var submitBtn = $('#submit-button')
var cardDisplay = $('.card')
var destinationVal = $('#destination-value')

submitBtn.on("click", function(event){
    event.preventDefault();
    cityName = $(destinationVal).val();
    console.log(destinationVal);
    initMap();
})

function initMap(){
    var apiKey="b1230e9ae6629f281894dc4555b0c16d";
    var apiUrlGeoCood=`https://api.openweathermap.org/geo/1.0/direct?q=${destinationVal}&appid=${apiKey}`;
    fetch(apiUrlGeoCood)
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(data) {
                        if (data.length > 0) {
                            console.log(data)
                            var lat=data[0].lat;
                            var lon=data[0].lon;
                            
                            map = new google.maps.Map(document.getElementById('map'), {
                                center: {lat: lat, lng: lon},
                                zoom:15
                            })
                        }
                    })  
            }    
        })
}
// map = new google.maps.Map(document.getElementById("map"), mapOptions);
// initMap();
// var marker = new google.maps.Marker({
//     location: {lat:lat, lng:lon},
//     radius:'5000',
//     type: "tourist_attraction",
// });

// marker.setMap(map);
