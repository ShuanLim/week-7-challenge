$(document).ready(function(){
    $('.sidenav').sidenav();
})

$('.datepicker').datepicker({

})

var map = null;
var mapOptions;
var cityName;
var submitBtn = $('#submit-button')
var cardDisplay = $('.card')
var destinationVal = $('#destination-value')
var apiKey="b1230e9ae6629f281894dc4555b0c16d";

submitBtn.on("click", function(event){
    event.preventDefault()
    initMap();
    initList();
})

function initMap(){
    cityName = destinationVal.val();
    // cityName = ('austin');
    var apiUrlGeoCood="https://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&appid="+apiKey;
    fetch(apiUrlGeoCood)
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(data) {
                        console.log(data)
                        if (data.length > 0) {
                            var lat=data[0].lat;
                            var lon=data[0].lon;
                            console.log(lat,lon)
                            
                            map = new google.maps.Map(document.getElementById('map'), {
                                center: {lat:lat, lng:lon},
                                zoom: 15
                            });
                        } else {
                            console.log("no data")
                        }
                    })  
            } else {
                console.log("no data")
            }    
        })
}

function initList(){
    cityName = destinationVal.val();
    var apiUrlGeoCood="https://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&appid="+apiKey;
    fetch(apiUrlGeoCood)
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(data) {
                        console.log(data)
                        if (data.length > 0) {
                            var lat=data[0].lat;
                            var lon=data[0].lon;
                            console.log(lat,lon)
                            
                            var request = {
                                location: new google.maps.LatLng(lat, lon),
                                radius: 5000,
                                type: ['tourist_attraction']
                            };
                            var results = [];
                            var places = document.getElementById('places');
                            var service = new google.maps.places.PlacesService(places);

                            var callback = (response, status, pagination) => {
                                if (status == google.maps.places.PlacesServiceStatus.OK) {
                                    results.push(...response);
                                }

                                if (pagination.hasNextPage) {
                                    setTimeout(() => pagination.nextPage(), 2000);
                                } else {
                                    displayResults();
                                }
                            }
                            service.nearbySearch(request, callback);

                            var displayResults = () => {
                                results.filter(result => result.rating)
                                        .sort((a, b) => a.rating > b.rating ? -1 : 1)
                                        .forEach(result => {
                                            places.innerHTML += `<li>${result.name} - ${result.rating}⭐</li>`;
                                        });
                            }
                        } else {
                            console.log("no data")
                        }
                    })  
            } else {
                console.log("no data")
            }    
        })
}
