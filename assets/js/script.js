$(document).ready(function(){
    $('.sidenav').sidenav();
})

$('.datepicker').datepicker({

})

// define variables
var map = null;
var cityName;
var submitBtn = $('#submit-button')
var cardDisplay = $('.card')
var destinationVal = $('#destination-value')
var apiKey1="b1230e9ae6629f281894dc4555b0c16d";
var apiKey2="5ae2e3f221c38a28845f05b66bdc1770b389d46067102a298fffccb2"
var lat;
var lon;
var xidNumber;
var attraction=$(".attraction")

// submit button
submitBtn.on("click", function(event){
    event.preventDefault()
    initMap();
})

// fetch data for latitude/longitude and create map
function initMap() {
    cityName = destinationVal.val();
    var apiUrlGeoCood="https://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&appid="+apiKey1;
    fetch(apiUrlGeoCood)
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(data) {
                        if (data.length > 0) {
                            var lat=data[0].lat;
                            var lon=data[0].lon;
                            getData(lat,lon)
                            // create map
                            map = new google.maps.Map(document.getElementById('map'), {
                                center: {lat:lat, lng:lon},
                                zoom: 15
                            });
                        } else {
                            var error = $("#error-msg").text("Search had no results, try again!").css({"color":"red", "text-align":"center"})
                            setTimeout(function() {
                                error.text("")
                            }, 2000)

                        }
                    }) 
                    .catch(function(catchError) {
                        var catchError = $("#error-msg").text("Unable to connect to OpenWeather One Call API. Check your internet connection.").css({"color":"red", "text-align":"center"})
                        setTimeout(function() {
                            catchError.text("")
                        }, 2000)
                    }) 
            } else {
                var error = $("#error-msg").text("Search had no results, try again!").css({"color":"red", "text-align":"center"})
                setTimeout(function() {
                    error.text("")
                }, 2000)
            } 
        })
        .catch(function(catchError) {
            var catchError = $("#error-msg").text("Unable to connect to OpenWeather One Call API. Check your internet connection.").css({"color":"red", "text-align":"center"})
            setTimeout(function() {
                catchError.text("")
            }, 2000)
        })
}

// fetch data from OpenTripMap
function getData(lat,lon) {
    console.log(lat,lon)
    var apiUrl="https://api.opentripmap.com/0.1/en/places/radius?radius=200000&lon="+lon+"&lat="+lat+"&kinds=interesting_places&rate=3&limit=20&apikey="+apiKey2
    fetch(apiUrl)   
        .then(function(response){
            if (response.ok){
                response.json()
                .then(function(data){ 
                    console.log(data)
                    $(".places").text("Attractions")
                    var attractionContainer=$("<div class='container'>")
                    attraction.text("")
                    poi.innerHTML="";
                    // for loop to create list
                    for (let i=0; i<data.features.length; i++){   
                    var id=(data.features[i].properties.xid)
                    var attractionUl=$("<ul class='row' class='containerdiv'>")
                    var attractionItem=$("<button class='col s12m4'>").text(data.features[i].properties.name).attr("id",id)
                    attractionItem.appendTo(attractionUl)
                    attractionUl.appendTo(attractionContainer)
                    attractionContainer.appendTo(attraction)
                    }
                    GetInfo();
                })
                .catch(function(catchError) {
                    var catchError = $("#error-msg").text("Unable to connect to OpenTripMap API. Check your internet connection.").css({"color":"red", "text-align":"center"})
                    setTimeout(function() {
                        catchError.text("")
                    }, 2000)
                })

            } else {
                var error = $("#error-msg").text("Search had no results, try again!").css({"color":"red", "text-align":"center"})
                setTimeout(function() {
                    error.text("")
                }, 2000)

            }
        })
        .catch(function(catchError) {
            var catchError = $("#error-msg").text("Unable to fetch latitude and longitude. Check your internet connection.").css({"color":"red", "text-align":"center"})
            setTimeout(function() {
                catchError.text("")
            }, 2000)
        })
}

// fetch data for local attractions info
function GetInfo() {
    $("ul").on("click","button",function(event) {
        event.preventDefault;
        xidNumber=$(this).attr("id")
    var apiUrlInfo="https://api.opentripmap.com/0.1/en/places/xid/"+xidNumber+"?apikey="+apiKey2
    fetch(apiUrlInfo)
        .then(function(response){
            if(response.ok) {
                response.json()
                // add info and create inner HTML for list
                .then(function(data){
                    var address=data.address.house_number + " " + data.address.road
                    let poi=document.querySelector("#poi")
                    poi.innerHTML=""; 
                    poi.innerHTML+=`<img src="${data.preview.source}">`
                    poi.innerHTML+=`<p> Address: ` + address
                    poi.innerHTML += data.wikipedia_extracts
                    ? data.wikipedia_extracts.html
                    : data.info
                    ? data.info.descr
                    : "No description"
                    poi.innerHtml+= poi.innerHTML += `<p><a target="_blank" href="${data.otm}">Show more at OpenTripMap</a></p>`
                })
                .catch(function(catchError) {
                    var catchError = $("#error-msg").text("Unable to connect to OpenTripMap API. Check your internet connection.").css({"color":"red", "text-align":"center"})
                    setTimeout(function() {
                        catchError.text("")
                    }, 2000)
                })
            } else {
                var error = $("#error-msg").text("Search had no results, try again!").css({"color":"red", "text-align":"center"})
                setTimeout(function() {
                    error.text("")
                }, 2000)

            }
        })
        .catch(function(catchError) {
            var catchError = $("#error-msg").text("Unable to connect to OpenTripMap API. Check your internet connection.").css({"color":"red", "text-align":"center"})
            setTimeout(function() {
                catchError.text("")
            }, 2000)
        })
    })
}