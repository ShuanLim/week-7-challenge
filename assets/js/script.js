$(document).ready(function(){
    $('.sidenav').sidenav();
});

// logic for general search function 
$("#search-form").submit(function (search) {
    search.preventDefault()
    // local variables 
    var userQuery = $("#user-search").val()
    var apiKey = "c58ee54a66cf33c18d5b0d8c9719eec0"
    // added url keywords and changed instructions for the user to guide the search to *hopefully* desired results
    var url = "http://api.serpstack.com/search?access_key=" + apiKey + "&type=web&device=desktop&query=flights%20from%20to%20" + userQuery 
    var results = ""
    // gets data from the url that's return from the api, takes the data and runs the function (data)
    $.get(url, function (data) {
    // clears search results before listing new results. targets "results" id and passes in ""
      $("#results").html("")
  
    //   console.log(data)
      // targeted organic_results via console.log findings to display to user after query is run
      data.organic_results.forEach(result => {
          // show results after query is run. displays results within container as the title and with the url below 
        results = `
          <h5>${result.title}</h5><br><a href="${result.url}">${result.url}</a>
          <p>${result.snippet}</p>
        `
        // appends the results to the container
        $("#results").append(results)
      })
    })
});


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
var pastCity=$('.past-cities')
var citySaved = []
var allDisplay = $('#all-display')

$(document).ready(function() { 
    // load past search history
    if (localStorage.getItem('searchedCity')!==null) {
        var storage = JSON.parse(localStorage.getItem("searchedCity"))
        citySaved.push(...storage);
        loadSearchHistory();
    }   
    // if statement to check for valid input
    submitBtn.on("click",function(event) {
        event.preventDefault();
        
        if (destinationVal.val() == '') {
            $("#error-msg").text("Please enter a city!").css({"color":"red", "text-align":"center"})
            setTimeout(function(){
                $("#error-msg").text('')
            }, 2000)
        } else {
            cityName=$(destinationVal).val();
            $(destinationVal).val('');
            citySaved.unshift(cityName)
            saveLocalStorage()
            initMap(cityName)
        }
    })
})


// fetch data for latitude/longitude and create map
function initMap() {
    
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
    var apiUrl="https://api.opentripmap.com/0.1/en/places/radius?radius=200000&lon="+lon+"&lat="+lat+"&kinds=interesting_places&rate=3&limit=10&apikey="+apiKey2
    fetch(apiUrl)   
        .then(function(response){
            if (response.ok){
                response.json()
                .then(function(data){ 
                    console.log(data)
                    $(".places").text("Attractions: ").css({'font-size':'24px', 'font-weight':'bold','text-align':'center', 'margin':'0 0 50px 0'})
                    var span = $('<span>').text(' click each button for more info!').css({'font-size':'24px', 'color':'turquoise'})
                    span.appendTo($(".places"))
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
        event.preventDefault();
        event.stopPropagation()
        
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
                    poi.innerHTML+=`<img class="responsive-img" src="${data.preview.source}" alt="${data.name}">`
                    poi.innerHTML+=`<p> Address: ` + address
                    poi.innerHTML += data.wikipedia_extracts
                    ? data.wikipedia_extracts.html
                    : data.info
                    ? data.info.descr
                    : "No description"
                    poi.innerHtml+= poi.innerHTML += `<p><a target="_blank" href="${data.otm}">Show more at OpenTripMap</a></p>`
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

// save to local storage
var saveLocalStorage = function() {
    pastCity.empty()
    localStorage.setItem('searchedCity', JSON.stringify(citySaved));
    loadSearchHistory();
}

// retrieve from local storage
function loadSearchHistory() {
    var searchHistoryArray = JSON.parse(localStorage.getItem('searchedCity'))
    for (j = 0; j < searchHistoryArray.length; j++){       
    var searchHistory = $("<button class='col s12'>").text(searchHistoryArray[j]);
        searchHistory.attr("id","#search"+ [j])
        searchHistory.css({"border-radius":"5px", "font-size":"15px", "margin":"3px"})
        searchHistory.appendTo(pastCity);
    }
}

// search history buttons
pastCity.on("click", "button", function(event) {
    event.preventDefault();
    event.stopPropagation()
    cityName = $(this).text();
    console.log(cityName)
    initMap();
})

// clear search history button
$("#clear").click(function(event){
    event.preventDefault();
    event.stopPropagation();
    pastCity.empty();
    localStorage.clear();
    citySaved=[];
});
