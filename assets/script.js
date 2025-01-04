// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

const apiKey = '6bdabfafea6c9fb1c11b7b85ca98c4ca';
const weatherFormEl = document.getElementById("weatherForm");
const weatherResultEl = document.getElementById("weatherdataicon");
const weatherCityEl = document.getElementById("weatherdataicon");
const weatherReportEl = document.getElementById("weatherReport");

function travelDes() {
    // 
    const inputCityEl = document.getElementById("cityInput");
    const inputCountryEl = document.getElementById("countryInput");
    const city = inputCityEl.value;
    const country = inputCountryEl.value;

    console.log(city);
    console.log(country);
    getWeather(city, country);
}

function getWeather() {
    // Placing geocode api to get a location for the targeted destinations
    const requestUrlGeocode = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${apiKey}`;

    // Fetching for a response
    fetch(requestUrlGeocode)
    .then(function(response) {
        return response.json();
    })
    // Response gotten
    .then(function(data) {
        console.log(data[0]);
        // if statement to see if we get something useful back
        if (data[0]) {
            const resultObj = data[0];
            let lat = resultObj.lat;
            let lon = resultObj.lon;
            // Weather API
            const requestUrlWeather = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=6bdabfafea6c9fb1c11b7b85ca98c4ca`;
            // Fetch response for the weather location
            fetch(requestUrlWeather)
            .then(function(response) {
                return response.json();
            })
            // Getting response for weather
            .then(function(weatherdata) {
                console.log(weatherdata.weather[0]);
                // Decorations / Icons and stuff
                const weatherObj = weatherdata.weather[0];
                const iconWeather = document.createElement("img");
                iconWeather.setAttribute("src", `https://openweathermap.org/img/wn/${weatherObj.icon}@2x.png`);
                weatherResultEl.appendChild(iconWeather);
            });
        } else {
            showError("Location not found, please try again.");
        }
    })

}

weatherFormEl.addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("weatherdataicon").innerHTML = "";
    removeError();
    travelDes();
});

function showError(errorMsg) {
    const messageEl = document.createElement("div");
    messageEl.setAttribute("id", "weatherError");
    messageEl.classList.add("notification", "is-link");
    const buttonEl = document.createElement("button");
    buttonEl.classList.add("delete");

    messageEl.textContent = errorMsg;
    messageEl.prepend(buttonEl);

    weatherReportEl.prepend(messageEl);
}

function removeError() {
    const msgEl = document.getElementById("weatherError");
    if (msgEl) {
        msgEl.remove();
    }
}