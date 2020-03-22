var cityList = [];

init();


$("button").on("click", function() {
    // In this case, the "this" keyword refers to the button that was clicked
    var cityName = $("#cityEntered").val()
    console.log(cityName)

    if (cityName === "") {
        return;
    }

    // Constructing a URL to search Giphy for the name of the person who said the quote
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityName + "&appid=ba42ba8d374fbf94c10e3a4fc4399006";
      
    // Performing our AJAX GET request
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // After the data comes back from the API
      .then(function(response) {
        
        
        console.log(response)
        $("#currentCityName").text(response.city.name)
        $("#currentCityWind").text(response.list[0].wind.speed+"MPH")
        
        

        var lat = response.city.coord.lat;
        var lon = response.city.coord.lon;
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=ba42ba8d374fbf94c10e3a4fc4399006&lat="+lat+"&lon="+lon;
          
        // Performing our AJAX GET request to get the UV index
        $.ajax({
          url: uvURL,
          method: "GET"
        })
          // After the data comes back from the API
          .then(function(response) {
              console.log(response.value);
              var uvIndex = response.value;
              $("#currentCityUv").text(uvIndex);
              if (uvIndex !==null){
                if(uvIndex < 3){
                    $("#currentCityUv").attr("class","low");
                }
                else if(uvIndex >6){
                    $("#currentCityUv").attr("class","high");
                }
                else{
                    $("#currentCityUv").attr("class","moderate");
                }
              }
          })
    
          //create a loop to get the data for next five days
        
        for (var i=0;i<6;i++){
            $("#day"+i).text(response.list[i].dt_txt)
            $("#dayTemp"+i).text("Temp : " + response.list[i].main.temp+"F")
            $("#dayHumidity"+i).text("Humidity : " + response.list[i].main.humidity+"%")
            $("#icon"+i).attr("src", "http://openweathermap.org/img/wn/"+response.list[i].weather[0].icon+"@2x.png");

        }

       
    })
    cityList.push(cityName);
    console.log(cityList);
    //$("#cityEntered").val() = "";

// Store updated todos in localStorage, re-render the list
    storeCityList();
    //renderCityList();
    var liEl = $("<li>");
    liEl.attr("class","list-group-item");
    liEl.attr("id",cityName);
    liEl.text(cityName) ;
    $(".list-group").append(liEl);
    


})




function renderCityList() {
  
  // Render a new li for each city
  for (var i = 0; i < cityList.length; i++) {
    var city = cityList[i];

    var liEl = $("<li>");
    liEl.attr("class","list-group-item");
    liEl.attr("id",city);
    liEl.text(city) ;
    $(".list-group").append(liEl);
    
  }
}

function init() {
  // Get stored todos from localStorage
  // Parsing the JSON string to an object
  var storedCities = JSON.parse(localStorage.getItem("citylist"));

  // If todos were retrieved from localStorage, update the todos array to it
  if (storedCities !== null) {
    cityList = storedCities;
  

  // Render todos to the DOM
  renderCityList();
  }
}

function storeCityList() {
  // Stringify and set "todos" key in localStorage to todos array
  localStorage.setItem("citylist", JSON.stringify(cityList));
  console.log(cityList);
}