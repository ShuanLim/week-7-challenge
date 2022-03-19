$(document).ready(function(){
    $('.sidenav').sidenav();
})

$('.datepicker').datepicker({

})

var lat;
var lon;
var map;
var mapOptions;
var cityName;
var submitBtn = $('submit-button')
var destinationVal = $('#destination-value')
var cardDisplay = $('.card')

submitBtn.on("click", function(event){
    event.preventDefault();
    cityName = $(destinationVal).val();
    destinationVal.val('')
    cardDisplay.empty();
    initMap();
})

function initMap(){
    let location=new Object();
    var apiKey="b1230e9ae6629f281894dc4555b0c16d";
    cityName= ""
    var apiUrlGeoCood=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
    fetch(apiUrlGeoCood)
        .then(function(response){
            if (response.ok){
                response.json().then(function(data){
                    console.log(data)
                        lat=data[0].lat;
                        lon=data[0].lon;
                       
                    location.lat=lat
                    location.long=lon 
                    console.log(location.lon)
                        
                    mapOptions =new google.maps.Map(document.getElementById('map'),{
                        center: {lat:lat, lng:lon},
                        zoom:15
                    })
                })
            
                
            }    
        })
    }

var map = new google.maps.Map(document.getElementById("map"), mapOptions);

var marker = new google.maps.Marker({
    location: {lat:lat, lng:lon},
    radius:'5000',
    type: "tourist_attraction",
});

marker.setMap(map);
