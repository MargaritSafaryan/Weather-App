// Select elements
const notification = document.querySelector(".notification");
const icon = document.querySelector(".weather-icon");
const tempValue = document.querySelector(".temperature-value p");
const tempDesc = document.querySelector(".temperature-description p");
const locationEl = document.querySelector(".location p");

// App data
const weather = {};

weather.temperature = {
    unit: "celsius"
}

// App const and vars
const KELVIN = 273;
// API key
const KEY = "c79a078ac52a5b186ea4e1af4a2b02ed";

//Check if browser supports geolocation
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notification.style.display = "block";
    notification.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// Set user's position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// Show error when there is an issue with geolocation service
function showError(error) {
    notification.style.display = "block";
    notification.innerHTML = `<p>${error.message}</p>`;
}

// Get weather from api provider 
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}`;
    fetch(api)
        .then(response => {
            let data = response.json();
            return data;
        }).then(data => {
            console.log(data);
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        }).then(() => {
            displayWeather();
        })
}

// Display weather to UI
function displayWeather() {
    icon.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempValue.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    tempDesc.innerHTML = weather.description;
    locationEl.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
    return(temperature * 9/5) + 32;
}

// When the user clicks on the temperature element
tempValue.addEventListener("click", () => {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit === "celsius") {
        let fahrenheit = Math.floor(celsiusToFahrenheit(weather.temperature.value));
        tempValue.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit"
    } else {
        tempValue.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
})
