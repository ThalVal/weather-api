const $locationsEl = $("#search");
const $locSearch = $("#search");
const $histEl = $("#history");
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
      .appendTo($histEl)
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
  let citysURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" + location + apiKey;
  fetch(citysURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (citysData) {
        let lat = citysData.city.coord.lat; 
        let lon = citysData["city"]["coord"]["lon"]; // ↑
        let citysName = citysData.city.name;
        console.log("ln63 citysData.city.name", citysData.city.name);
        getTodaysWeather(lat, lon, citysName);
        getFiveDaysForecast(lat, lon);
        console.log("lon= ", lon);
        console.log("lat= ", lat);
        $fiveDayssEl.text("");
        $todaysWeatherEl.text("");

        // Sets user input into local storage history after search
        let histValue = citysName;
        storedHist.unshift(histValue);
        console.log("histValue", histValue);

       
        localStorage.setItem(
          "histValue",
          JSON.stringify(storedHist.slice(0, 15)) 
        );
        $("<button>")
          .attr("class", "histBtn col-md-11 col-ms-11")
          .attr("data-city", citysData.city.name)
          .text(histValue)
          .prependTo($histEl)
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
  let citysURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey;
  fetch(citysURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (citysData) {
        console.log(citysData);
        let lat = citysData.city.coord.lat; 
        let lon = citysData["city"]["coord"]["lon"]; 
        let citysName = citysData.city.name;
        getTodaysWeather(lat, lon, citysName);
        getFiveDaysForecast(lat, lon);
        console.log("lon= ", lon);
        console.log("lat= ", lat);
        $fiveDayssEl.text("");
        $todaysWeatherEl.text("");

        
        let histValue = citysName;
        storedHist.unshift(histValue);
        console.log("histValue", histValue);

      
        localStorage.setItem(
          "histValue",
          JSON.stringify(storedHist.slice(0, 15)) 
        );
        $("<button>")
          .attr("class", "histBtn col-md-11 col-ms-11")
          .attr("data-city", citysData.city.name)
          .text(histValue)
          .prependTo($histEl)
          .on("click", histSearch);
      });
    }
  });
};

// for today
let getTodaysWeather = function (lat, lon, citysName) {
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
        console.log("citysName", citysName);
        let $citysNameEl = $(".citysName").text(citysName);
        let dailyCard = $("<div>")
          .attr("class", "dailyCard col-md-8 col-sm-10")
          .attr("style", "padding-top: 8%");

        let dailyIcon = $("<img>", {
          src:
            " https://openweathermap.org/img/wn/" +
            dData.weather[0].icon +
            "@2x.png",
        }).attr("class", "col-md-6");

        let dailyMax = $("<div>").text(
          "H Temperature : " + dData.main.temps_max + " °F"
        );

        let dailyMin = $("<div>").text(
          "L Temperature : " + dData.main.temps_min + " °F"
        );

        let dailyWinds = $("<div>").text("Wind : " + dData.wind.speed + " MPH");

        let dailyHumid = $("<div>").text(
          "Humidity : " + dData.main.humid + " %"
        );

        $todaysWeatherEl.append(dailyIcon);
        $todaysWeatherEl.append(dailyCard);
        dailyCard.append(dailyMax, dailyMin, dailyWinds, dailyHumid);
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
        
        let weathersDataArr = llData.list;
     
        $.each(weathersDataArr, function (index, element) {
          let dt = element.dt_txt;
          let dtDate = dt.slice(0, 10);
          let dtTime = dt.slice(-8);
          

          if (dtDate !== todaysNoShow) {
            
            let repDatas = index % 8 == 7;
            if (repDatas) {
             

              let FDFcard = $("<div>").attr(
                "class",
                "FDFcard col-md-3 col-sm-11"
              );

              let repDates = $("<div>").text(
                dayjs(weathersDataArr[index].dt_txt.slice(0, 10)).format("dddd")
              );
              repDates.append(
                $("<div>").text(
                  dayjs(weathersDataArr[index].dt_txt.slice(0, 10)).format(
                    "MMMM DD, YYYY"
                  )
                )
              );

              let repIcon = $("<img>", {
                src:
                  " https://openweathermap.org/img/wn/" +
                  weathersDataArr[index].weather[0].icon +
                  "@2x.png",
              });
              

              let repTemps = $("<div>").text(
                "Temperature : " + weathersDataArr[index].main.temps + " °F"
              );
              let repWinds = $("<div>").text(
                "Wind : " + weathersDataArr[index].wind.speed + " MPH"
              );
              let repHumid = $("<div>").text(
                "Humidity : " + weathersDataArr[index].main.humid + " %"
              );
              $fiveDayssEl.append(FDFcard);
              FDFcard.append(repDates, repIcon, repTemps, repWinds, repHumid);
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
  $histEl.empty();
});

