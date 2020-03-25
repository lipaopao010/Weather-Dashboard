var cityList = [];

init();


$("button").on("click", function() {
    //if the user click the search button
    if($(this).attr("id")==="search"){
      console.log($(this).attr("id"));
      
      //get the city name entered
      var cityName = $("#cityEntered").val()
      console.log(cityName)
      if (cityName === ""){
        return;
    }
      getCityInfo(cityName);

      //create a new button for the city name
      if(!cityList.includes(cityName.toLowerCase())){
        console.log("not same")
        var liEl = $("<button>");
        liEl.attr("class","list-group-item");
        liEl.attr("id",cityName.toLowerCase());
        liEl.text(cityName.toLowerCase()) ;
        $(".list-group").append(liEl);
      }
      //create a loop to check the city name is not same as the ones in the list
      for(var i=0;i<cityList.length;i++){
        cityName = cityName.toLowerCase();
        console.log(cityName);
        console.log(cityList);
       if (cityName === cityList[i]){
            cityList.splice(i,1);
       }
    }
      cityList.push(cityName.toLowerCase());
      console.log(cityList);
      storeCityList();
    }
})
   
    
$("button").on("click", function() {
    console.log($(this).attr("class"));
    // if the user clicked the button in the saved city list
    if($(this).attr("class") === "list-group-item"){
        cityName = $(this).attr("id");
        console.log(cityName);
        getCityInfo(cityName);
      }
})


function renderCityList() {
  // Render a new button for each city 
  for (var i = 0; i < cityList.length; i++) {
    var city = cityList[i];
    var liEl = $("<button>");
    liEl.attr("class","list-group-item");
    liEl.attr("id",city);
    liEl.text(city) ;
    $(".list-group").append(liEl);
    console.log("render"); 
  }
}



function init() {
  // Get stored citylist from localStorage
  // Parsing the JSON string to an object
  var storedCities = JSON.parse(localStorage.getItem("citylist"));
  if (storedCities !== null) {
    cityList = storedCities;
    console.log("init");
  renderCityList();
  }
}



function storeCityList() {
  // Stringify and set "citylist" key in localStorage to citylist array
  localStorage.setItem("citylist", JSON.stringify(cityList));
  console.log("storeCity LIst")
  console.log(cityList);
}



// this is the function to get weather data for the city
function getCityInfo(cityName){
  
  console.log("getcity info");
  console.log(cityName);
  // Constructing a URL to search weather data for city name
  //var cityName;
  var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" +
  cityName + "&appid=ba42ba8d374fbf94c10e3a4fc4399006";
  
  // Performing our AJAX GET request to get the data for current day
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // After the data comes back from the API
    .then(function(response) {
      console.log(response)
      $("#currentCityName").text(response.city.name)
      $("#currentCityWind").text(response.list[0].wind.speed+"MPH")
      
      
      // get the location details for the UV index
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
      
      for (var i=0;i<41;i+=7){
        console.log(i);
          
          var dateEl = response.list[i].dt_txt;
          var dateString = moment(dateEl).format("DD/MM/YYYY");
          $("#day"+i).text(dateString);
          console.log(dateString);
          $("#dayTemp"+i).text("Temp : " + response.list[i].main.temp+"F")
          $("#dayHumidity"+i).text("Humidity : " + response.list[i].main.humidity+"%")
          $("#icon"+i).attr("src", "http://openweathermap.org/img/wn/"+response.list[i].weather[0].icon+"@2x.png");
      } 
  })
}
