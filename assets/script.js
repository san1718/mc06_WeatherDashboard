// Variables
const API_key = "6bdabfafea6c9fb1c11b7b85ca98c4ca";
const locationInput = document.getElementById("city-input");
const search = document.getElementById("search-btn");
const weather = document.getElementById("weather");
const current = document.getElementById("current");
const search_element = document.getElementById("search-history");

search.addEventListener("click", function () {
  console.log(API_key);
  saveSearchHistory(locationInput.value);
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${locationInput.value}&appid=${API_key}`
  )
    .then((response) => response.json())
    .then((data) => {
      const { name, lat, lon } = data[0];
      console.log(lat, lon);
      // Passing down to the function
      getWeather(name, lat, lon); 
    })
    .catch((error) => {
      weather.innerHTML = `<p>Error: ${error}</p>`;
    });
});
const saveSearchHistory = (city) => {
  let cityHistory = JSON.parse(localStorage.getItem("cities"));
  if (!cityHistory) {
    cityHistory = [];
  }
  cityHistory.push(city);
  localStorage.setItem("cities", JSON.stringify(cityHistory));
};
const renderSearchHistory = () => {
  let cityHistory = JSON.parse(localStorage.getItem("cities"));
  if (!cityHistory) {
    return;
  }
  console.log(cityHistory);
  for (city of cityHistory) {
    const button = document.createElement("button");
    button.textContent = city;
    button.value = city;
    button.classList.add("search-history");
    console.log(city);
    search_element.appendChild(button);
  }
  search_element.addEventListener("click", function (e) {
    console.log(e.target.value);
    const city = e.target.value;
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Defining and passing down
        const { name, lat, lon } = data[0];
        console.log(lat, lon);
        // Passing down to function
        getWeather(name, lat, lon);
      })
      .catch((error) => {
        weather.innerHTML = `<p>Error: ${error}</p>`;
      });
  });
};
const getWeather = (name, lat, lon) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`
  )
    .then((response) => response.json())
    .then((data) => {
      const { list } = data;
      const todaysWeather = list[0];

      displayCurrentWeather(todaysWeather, name);

      displayWeather(list, name);
    });
};
function displayCurrentWeather(weatherData, cityName) {
  const date = new Date(weatherData.dt * 1000);
  const tempKelvin = weatherData.main.temp;
  const tempCelsius = tempKelvin - 273.15;
  const windSpeed = weatherData.wind.speed;
  const humidity = weatherData.main.humidity;
  const iconCode = weatherData.weather[0].icon;
  const description = weatherData.weather[0].description;

  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  document.getElementById(
    "city-name"
  ).textContent = `${cityName} (${formattedDate})`;
  document.getElementById(
    "temperature"
  ).textContent = `Temperature: ${tempCelsius.toFixed(2)}°C`;
  document.getElementById("wind").textContent = `Wind: ${windSpeed} M/S`;
  document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;
  document.getElementById(
    "weather-icon"
  ).innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">`;
}
function displayWeather(weatherData, cityName) {
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = "";

  weatherData.forEach((element, index) => {
    if (index % 8 === 0) {
      const date = new Date(element.dt * 1000);
      const tempKelvin = element.main.temp;
      const tempFahrenheit = ((tempKelvin - 273.15) * 9) / 5 + 32;
      const windSpeed = element.wind.speed;
      const iconCode = element.weather[0].icon;
      const description = element.weather[0].description;
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);

      const forecastCard = document.createElement("div");
      forecastCard.classList.add("col", "mb-3");

      const card = document.createElement("div");
      card.classList.add("card", "border-0", "bg-secondary", "text-white");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body", "p-3", "text-white");

      const cardTitle = document.createElement("h5");
      cardTitle.classList.add("card-title", "fw-semibold");
      cardTitle.textContent = `(${formattedDate})`;

      const temp = document.createElement("h6");
      temp.classList.add("card-text", "my-3", "mt-3");

      const wind = document.createElement("h6");
      wind.classList.add("card-text", "my-3");

      const humidity = document.createElement("h6");
      humidity.classList.add("card-text", "my-3");

      const iconElement = document.createElement("img");
      iconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      iconElement.alt = description;

      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = description;

      temp.textContent = `Temp: ${tempFahrenheit.toFixed(2)}°F`;
      wind.textContent = `Wind: ${windSpeed} M/S`;
      humidity.textContent = `Humidity: ${humidity}%`;

      // Card stuff
      cardBody.appendChild(cardTitle);
      // Adding icon
      cardBody.appendChild(iconElement);
      // Adding description
      cardBody.appendChild(descriptionElement);
      // Adding temp
      cardBody.appendChild(temp);
      // Adding wind
      cardBody.appendChild(wind);
      // Adding humidity
      cardBody.appendChild(humidity);

      card.appendChild(cardBody);
      forecastCard.appendChild(card);

      // Appending to Container
      forecastContainer.appendChild(forecastCard);
    }
  });
}

renderSearchHistory();
