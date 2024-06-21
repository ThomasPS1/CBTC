const apiKey = '7e76ed1e26feafb7a31798345dd2d361';

const apiUrl = 'https://api.openweathermap.org/data/2.5/';

document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeatherByCoords, showError);
    } else {
        alert('Geolocation is not supported by your browser.');
    }

    document.getElementById('toggle-humidity').addEventListener('click', () => {
        document.getElementById('humidity').classList.toggle('hidden');
    });

    document.getElementById('toggle-wind').addEventListener('click', () => {
        document.getElementById('wind').classList.toggle('hidden');
    });

    document.getElementById('change-location').addEventListener('click', () => {
        const location = document.getElementById('location-input').value;
        if (location) {
            fetchWeatherByLocation(location);
        } else {
            alert('Please enter a location.');
        }
    });
});

function fetchWeatherByCoords(position) {
    const { latitude, longitude } = position.coords;
    const currentWeatherUrl = `${apiUrl}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    const forecastUrl = `${apiUrl}forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    fetchWeatherData(currentWeatherUrl, forecastUrl);
}

function fetchWeatherByLocation(location) {
    const currentWeatherUrl = `${apiUrl}weather?q=${location}&units=metric&appid=${apiKey}`;
    const forecastUrl = `${apiUrl}forecast?q=${location}&units=metric&appid=${apiKey}`;

    fetchWeatherData(currentWeatherUrl, forecastUrl);
}

function fetchWeatherData(currentWeatherUrl, forecastUrl) {
    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            document.getElementById('error-message').classList.add('hidden');
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            document.getElementById('error-message').classList.remove('hidden');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast:', error));
}

function displayCurrentWeather(data) {
    const locationElement = document.getElementById('location');
    const descriptionElement = document.getElementById('description');
    const temperatureElement = document.getElementById('temperature');
    const humidityElement = document.getElementById('humidity');
    const windElement = document.getElementById('wind');
    const weatherIconElement = document.getElementById('weather-icon');

    locationElement.textContent = `${data.name}, ${data.sys.country}`;
    descriptionElement.textContent = data.weather[0].description;
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    windElement.textContent = `Wind: ${data.wind.speed} m/s`;
    weatherIconElement.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function displayForecast(data) {
    const forecastElement = document.getElementById('forecast');
    forecastElement.innerHTML = '';

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    dailyForecasts.forEach((day, index) => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        const date = new Date(day.dt_txt).toLocaleDateString();
        const temperature = `${Math.round(day.main.temp)}°C`;
        const description = day.weather[0].description;
        const humidity = `Humidity: ${day.main.humidity}%`;
        const wind = `Wind: ${day.wind.speed} m/s`;
        const iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

        forecastItem.innerHTML = `
            <div class="forecast-item-header">
                <div>
                    <span>${date}</span>
                    <span>${temperature}</span>
                    <span>${description}</span>
                </div>
                <img src="${iconUrl}" alt="Weather Icon">
            </div>
            <div class="forecast-details hidden" id="details-${index}">
                <p>${humidity}</p>
                <p>${wind}</p>
            </div>
            <div class="forecast-buttons">
                <button onclick="toggleDetails(${index})">Toggle Details</button>
            </div>
        `;

        forecastElement.appendChild(forecastItem);
    });
}

function toggleDetails(index) {
    const detailsElement = document.getElementById(`details-${index}`);
    detailsElement.classList.toggle('hidden');
}

function showError(error) {
    console.warn(`ERROR(${error.code}): ${error.message}`);
}
