const $locationsEl = $("#search");
const $locSearch = $("#search");
const $historyEl = $("#history");
const $todaysWeatherEl = $("#todaysWeather");
const $fiveDayssEl = $("#fiveDays");
const $searchButt = $("#searchButt");
const apiKey = "&appid=13f0a656ca2e45b9c8bfa2e6208aad73";

// Current Day and Date
let $todaysEl = $("#today");
$todaysEl.text(dayjs().format("dddd, MMMM DD, YYYY"));
let todaysNoShow = dayjs().format("YYYY-MM-DD");
console.log(todaysNoShow);
console.log(typeof todaysNoShow);


// History Search
let histSearch = function (event) {
  var city = $(event.target).data("city");
  console.log("data-city", city);
  if (city) {
    histGetLLg(city);
  }
};

let storedHist = JSON.parse(localStorage.getItem("histValue")) || [];
storedHist = storedHist.slice(0, 15);
for (var i = 0; i < storedHist.length; i++) {
  if (storedHist[i]) {
    console.log("creating button for", storedHist[i]); 
    $("<button>")
      .attr("class", "histBtn col-md-11 col-ms-11")
      .attr("data-city", storedHist[i])
      .text(storedHist[i])
      .appendTo($historyEl)
      .on("click", histSearch);
  }

}
// Search for location
let search = function (event) {
  event.preventDefault();

  let location = $locationsEl.val().trim();

  if (location) {
    getLatLong(location); 

    $locSearch.val("");
    console.log(location); 
  } else {
    alert("Enter a valid city name");
  }
};
// get lat and lon
let getLatLong = function (location) {
  let cityURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" + location + apiKey;
  fetch(cityURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (cityData) {
        let lat = cityData.city.coord.lat; 
        let lon = cityData["city"]["coord"]["lon"]; // ↑
        let cityName = cityData.city.name;
        console.log("ln63 cityData.city.name", cityData.city.name);
        getTodaysWeather(lat, lon, cityName);
        getFiveDaysForecast(lat, lon);
        console.log("lon= ", lon);
        console.log("lat= ", lat);
        $fiveDayssEl.text("");
        $todaysWeatherEl.text("");

        // Sets user input into local storage history after search
        let histValue = cityName;
        storedHist.unshift(histValue);
        console.log("histValue", histValue);

       
        localStorage.setItem(
          "histValue",
          JSON.stringify(storedHist.slice(0, 15)) 
        );
        $("<button>")
          .attr("class", "histBtn col-md-11 col-ms-11")
          .attr("data-city", cityData.city.name)
          .text(histValue)
          .prependTo($historyEl)
          .on("click", histSearch);
        //
      });
    } else {
      alert("City was not found.");
    }
  });
};

let histGetLLg = function (city) {
  console.log("ln97 histGetLLg city=", city);
  let cityURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey;
  fetch(cityURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (cityData) {
        console.log(cityData);
        let lat = cityData.city.coord.lat; 
        let lon = cityData["city"]["coord"]["lon"]; 
        let cityName = cityData.city.name;
        getTodaysWeather(lat, lon, cityName);
        getFiveDaysForecast(lat, lon);
        console.log("lon= ", lon);
        console.log("lat= ", lat);
        $fiveDayssEl.text("");
        $todaysWeatherEl.text("");

        
        let histValue = cityName;
        storedHist.unshift(histValue);
        console.log("histValue", histValue);

      
        localStorage.setItem(
          "histValue",
          JSON.stringify(storedHist.slice(0, 15)) // Limits to 15 values in search history
        );
        $("<button>")
          .attr("class", "histBtn col-md-11 col-ms-11")
          .attr("data-city", cityData.city.name)
          .text(histValue)
          .prependTo($historyEl)
          .on("click", histSearch);
      });
    }
  });
};

// for today
let getTodaysWeather = function (lat, lon, cityName) {
  let dURL =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial" +
    apiKey;
  fetch(dURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (dData) {
        console.log("dData", dData);
        console.log("cityName", cityName);
        let $cityNameEl = $(".cityName").text(cityName);
        let dailyCard = $("<div>")
          .attr("class", "dailyCard col-md-8 col-sm-10")
          .attr("style", "padding-top: 7%");

        let dailyIcon = $("<img>", {
          src:
            " https://openweathermap.org/img/wn/" +
            dData.weather[0].icon +
            "@2x.png",
        }).attr("class", "col-md-5");

        let dailyMxTemp = $("<div>").text(
          "H Temperature : " + dData.main.temp_max + " °F"
        );

        let dailyMnTemp = $("<div>").text(
          "L Temperature : " + dData.main.temp_min + " °F"
        );

        let dailyWind = $("<div>").text("Wind : " + dData.wind.speed + " MPH");

        let dailyHumi = $("<div>").text(
          "Humidity : " + dData.main.humidity + " %"
        );

        $todaysWeatherEl.append(dailyIcon);
        $todaysWeatherEl.append(dailyCard);
        dailyCard.append(dailyMxTemp, dailyMnTemp, dailyWind, dailyHumi);
      });
    }
  });
};

// for 5 days
let getFiveDaysForecast = function (lat, lon) {
  let llURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial" +
    apiKey;
  fetch(llURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (llData) {
        
        let weatherDataArr = llData.list;
     
        $.each(weatherDataArr, function (index, element) {
          let dt = element.dt_txt;
          let dtDate = dt.slice(0, 10);
          let dtTime = dt.slice(-8);
          

          if (dtDate !== todaysNoShow) {
            
            let repData = index % 8 == 7;
            if (repData) {
             

              let FDFcard = $("<div>").attr(
                "class",
                "FDFcard col-md-3 col-sm-11"
              );

              let repDate = $("<div>").text(
                dayjs(weatherDataArr[index].dt_txt.slice(0, 10)).format("dddd")
              );
              repDate.append(
                $("<div>").text(
                  dayjs(weatherDataArr[index].dt_txt.slice(0, 10)).format(
                    "MMMM DD, YYYY"
                  )
                )
              );

              let repIcon = $("<img>", {
                src:
                  " https://openweathermap.org/img/wn/" +
                  weatherDataArr[index].weather[0].icon +
                  "@2x.png",
              });
              

              let repTemp = $("<div>").text(
                "Temperature : " + weatherDataArr[index].main.temp + " °F"
              );
              let repWind = $("<div>").text(
                "Wind : " + weatherDataArr[index].wind.speed + " MPH"
              );
              let repHumi = $("<div>").text(
                "Humidity : " + weatherDataArr[index].main.humidity + " %"
              );
              $fiveDayssEl.append(FDFcard);
              FDFcard.append(repDate, repIcon, repTemp, repWind, repHumi);
            }
          }
        });
      });
    }
  });
};

// Event Listeners
$searchButt.click(search);
$(".clearListButt").on("click", () => {
  localStorage.clear();
  $historyEl.empty();
});

// theme switcher
function toggleTheme() {
  var theme = document.getElementById("theme");
  if (theme.getAttribute("href") === "./assets/css/light.css") {
    theme.setAttribute("href", "./assets/css/dark.css");
    
  } else {
    theme.setAttribute("href", "./assets/css/light.css");
  }
}