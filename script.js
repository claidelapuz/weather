document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'c2f526b880064c2ea7a125501240509'; 
    let cityName = 'Iligan';

    const locationInput = document.getElementById('location-input');
    const suggestionsList = document.getElementById('suggestions');

    async function getWeather(city) {
        const apiEndpoint = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;
        const weatherContainer = document.getElementById('weather-container');
        weatherContainer.innerHTML = `<p>Loading weather data... <i class="fas fa-spinner fa-spin"></i></p>`;

        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error(`Error fetching weather data: ${response.statusText}`);
            }
            const weatherData = await response.json();
            weatherContainer.innerHTML = '';

            weatherData.forecast.forecastday.forEach(element => {
                const weatherBox = document.createElement('div');
                weatherBox.classList.add('weather-box');
                weatherBox.innerHTML = `
                    <h2>${city}</h2>
                    <p><i class="fas fa-calendar-day"></i> <strong>Date:</strong> ${element.date}</p>
                    <p><img src="https:${element.day.condition.icon}" alt="Weather icon"></p>
                    <p><i class="fas fa-thermometer-half"></i> <strong>Temperature:</strong> ${element.day.avgtemp_c} °C</p>
                    <p><i class="fas fa-cloud"></i> <strong>Weather:</strong> ${element.day.condition.text}</p>
                    <p><i class="fas fa-tint"></i> <strong>Humidity:</strong> ${element.day.avghumidity}%</p>
                `;
                weatherContainer.appendChild(weatherBox);
            });
        } catch (error) {
            weatherContainer.innerHTML = `<p>Unable to retrieve weather data: ${error.message}</p>`;
        }
    }

    getWeather(cityName);

    async function fetchCitySuggestions(query) {
        const philippineCities = ['Manila', 'Cebu', 'Davao', 'Iligan', 'Makati'];
        return philippineCities.filter(city => city.toLowerCase().startsWith(query.toLowerCase()));
    }

    locationInput.addEventListener('input', async function () {
        const query = locationInput.value;
        if (query.length > 1) {
            const suggestions = await fetchCitySuggestions(query);
            suggestionsList.innerHTML = '';
            suggestions.forEach(city => {
                const li = document.createElement('li');
                li.textContent = city;
                li.addEventListener('click', function () {
                    locationInput.value = city;
                    suggestionsList.innerHTML = '';
                    cityName = city;
                    getWeather(cityName);
                });
                suggestionsList.appendChild(li);
            });
        } else {
            suggestionsList.innerHTML = '';
        }
    });

    document.getElementById('search-btn').addEventListener('click', function () {
        const userCity = locationInput.value;
        if (userCity) {
            cityName = userCity;
            getWeather(cityName);
            suggestionsList.innerHTML = '';
        }
    });

    locationInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            const userCity = event.target.value;
            if (userCity) {
                cityName = userCity;
                getWeather(cityName);
                suggestionsList.innerHTML = '';
            }
        }
    });
});
