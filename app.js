const searchButton = document.querySelector(".search-btn"),
    cityInput = document.querySelector(".city-input"),
    weatherCardsDiv = document.querySelector(".weather-cards")

const API_KEY = 'a99ccb2acda0049b2980578987066395';

const createWeatherCard = (weatherItem) => {
    return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather">
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}*C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}79%</h4>
            </li>`
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays = []
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate)
            }
        })

        fiveDaysForecast.forEach(weatherItem => {
            weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem))
            
        })
    }).catch(() => {
        alert("error")
    })
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim()
    if (!cityName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`

    fetch(GEOCODING_API_URL).then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`No data found for ${cityName}`);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        }).catch(() => {
            alert("An error")
        })
}

searchButton.addEventListener("click", getCityCoordinates);