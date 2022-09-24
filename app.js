let imperialcalc = document.querySelector("#imperial-btn");
let temperatureElement = document.querySelector("#current-temperature");
let windSpeedElement = document.querySelector("#wind-speed");
let originalWindSpeed = null;
let humidityElement = document.querySelector("#current-humidity");
let currentWeatherDescription = document.querySelector(
  "#current-weather-description"
);
let currentTemperatureMin = document.querySelector("#current-temp-min");
let currentTemperatureMax = document.querySelector("#current-temp-max");
let currentWeatherDate = document.querySelector("#current-weather-date");
let iconElement = document.querySelector("#current-weather-icon");
getGeolocationForecast();

let form = document.querySelector("#form");
let searchInput = document.querySelector("#input-text");
let currrentLocationResult = document.querySelector("#current-location");
function currrentLocation(event) {
  event.preventDefault();
  currrentLocationResult.innerHTML = `${capitalize(searchInput.value.trim())} `;
  let apiKey = "c819171fe0abdc14039af4ef5dda283b";
  let city = searchInput.value.trim();
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiURL).then(showTemperature);
}

function capitalize(searchInput) {
  let arr = searchInput.split("");
  arr[0] = arr[0].toUpperCase();
  let searchInputCap = arr.join("");
  return searchInputCap;
}

form.addEventListener("submit", currrentLocation);

function mToI() {
  if (temperatureElement.innerHTML.split("").includes("F")) {
    return;
  }
  let degreesMain = parseFloat(temperatureElement.innerHTML) * 1.8 + 32;
  let degreesMin = parseFloat(currentTemperatureMin.innerHTML) * 1.8 + 32;
  let degreesMax = parseFloat(currentTemperatureMax.innerHTML) * 1.8 + 32;
  temperatureElement.innerHTML = `${Math.round(degreesMain)} \u00B0 F`;
  currentTemperatureMin.innerHTML = `${Math.round(degreesMin)} \u00B0 F`;
  currentTemperatureMax.innerHTML = `${Math.round(degreesMax)} \u00B0 F`;
  let speed = parseFloat(windSpeedElement.innerHTML) * 0.62137;
  windSpeedElement.innerHTML = `${Math.round(speed)} Mph`;
}

imperialcalc.addEventListener("click", mToI);
let metriccalc = document.querySelector("#metric-btn");

function IToM() {
  if (temperatureElement.innerHTML.split("").includes("C")) {
    return;
  }
  let temp = parseFloat(temperatureElement.innerHTML) - 32;
  let tempMin = parseFloat(currentTemperatureMin.innerHTML) - 32;
  let tempMax = parseFloat(currentTemperatureMax.innerHTML) - 32;
  let degreesMain = temp / 1.8;
  let degreesMin = tempMin / 1.8;
  let degreesMax = tempMax / 1.8;
  temperatureElement.innerHTML = `${Math.round(degreesMain)} \u00B0 C`;
  currentTemperatureMin.innerHTML = `${Math.round(degreesMin)} \u00B0 C`;
  currentTemperatureMax.innerHTML = `${Math.round(degreesMax)} \u00B0 C`;
  windSpeedElement.innerHTML = `${originalWindSpeed} km/h`;
}

metriccalc.addEventListener("click", IToM);

function handlePosition(position) {
  let lat = parseFloat(position.coords.latitude);
  let lon = parseFloat(position.coords.longitude);
  let apiKey = "c819171fe0abdc14039af4ef5dda283b";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiURL).then(showTemperature);
  let apiURLCity = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  axios.get(apiURLCity).then(showCurrentCity);
  axios.get(apiURL).then(formatDate);
}

function getForecast(coordinates) {
  let apiKey = "c819171fe0abdc14039af4ef5dda283b";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
  axios.get(apiURL).then(displayForecast);
}

function showTemperature(response) {
  temperatureElement.innerHTML = `${Math.round(
    response.data.main.temp
  )} \u00B0 C`;
  windSpeedElement.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  originalWindSpeed = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = `${response.data.main.humidity} %`;
  currentWeatherDescription.innerHTML = response.data.weather[0].description;
  currentTemperatureMin.innerHTML = `${Math.round(
    response.data.main.temp_min
  )} \u00B0 C`;
  currentTemperatureMax.innerHTML = `${Math.round(
    response.data.main.temp_max
  )} \u00B0 C`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", `${response.data.weather[0].description}`);
  currentWeatherDate.innerHTML = formatDate(response.data.dt * 1000);
  getForecast(response.data.coord);
}

function showCurrentCity(cityResponse) {
  currrentLocationResult.innerHTML = cityResponse.data.city;
}

function getGeolocationForecast() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}
let geolocationBtn = document.querySelector("#currentGeolocation");

geolocationBtn.addEventListener("click", getGeolocationForecast);

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];
  return `${day}, ${month} ${date.getDate()} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];

  return day;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
                <div class="weekday-date">${formatDay(forecastDay.dt)}</div>
                <img class="weathericon" src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" alt="${forecastDay.weather[0].description}"/>
                <div class="future-forecast">
                  <i class="fa-solid fa-temperature-arrow-up"></i>
                  <span class="forecast-temp-high">${Math.round(
                    forecastDay.temp.max
                  )}°</span>
                  <i class="fa-solid fa-temperature-arrow-down"></i>
                  <span class="forecast-temp-low">${Math.round(
                    forecastDay.temp.min
                  )}°</span>
                </div>`;
      forecastHTML = forecastHTML + `</div>`;
      forecastElement.innerHTML = forecastHTML;
    }
  });
}
