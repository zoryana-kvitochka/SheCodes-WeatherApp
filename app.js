function formatDate(date) {
  let currentWeatherDate = document.querySelector("#current-weather-date");
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
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

  let month = months[now.getMonth()];

  function hoursCalc(now) {
    return (now.getHours() < 10 ? "0" : "") + now.getHours();
  }
  function minutesCalc(now) {
    return (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
  }

  let hours = hoursCalc(now);
  let minutes = minutesCalc(now);

  currentWeatherDate.innerHTML = `${day}, ${month} ${now.getDate()}, ${hours}:${minutes}`;
}
formatDate();

let form = document.querySelector("#form");
let searchInput = document.querySelector("#input-text");
let currrentLocationResult = document.querySelector("#current-location");
function currrentLocation(event) {
  event.preventDefault();
  currrentLocationResult.innerHTML = `${capitalize(searchInput.value.trim())} `;
  let apiKey = "5d9ddb47e7d12cd322569c5f2419881f";
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

let fahrenheitcalc = document.querySelector("#fahrenheit-link");
let temperatureElement = document.querySelector("#temperature");
let temperature = temperatureElement.innerHTML;
function cToF(degrees) {
  degrees.preventDefault();
  degrees = parseInt(temperature) * 1.8 + 32;
  temperatureElement.innerHTML = parseInt(degrees);
}

fahrenheitcalc.addEventListener("click", cToF);
let celciuscalc = document.querySelector("#celcius-link");

function fToC(degrees1) {
  degrees1.preventDefault();
  degrees1 = parseInt(temperature);
  temperatureElement.innerHTML = parseInt(degrees1);
}

celciuscalc.addEventListener("click", fToC);

function handlePosition(position) {
  let lat = parseFloat(position.coords.latitude);
  let lon = parseFloat(position.coords.longitude);
  let apiKey = "5d9ddb47e7d12cd322569c5f2419881f";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiURL).then(showTemperature);
  let apiURLCity = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  axios.get(apiURLCity).then(showCurrentCity);
}

function showTemperature(response) {
  let forecast = document.querySelector("#temperature");
  forecast.innerHTML = `${Math.round(response.data.main.temp)} `;
}

function showCurrentCity(cityResponse) {
  currrentLocationResult.innerHTML = cityResponse.data.city;
}

function getGeolocationForecast() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}
let geolocationBtn = document.querySelector("#currentGeolocation");

geolocationBtn.addEventListener("click", getGeolocationForecast);
