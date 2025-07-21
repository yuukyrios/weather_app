const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const forecastContainer = document.querySelector('.forecast-cards');

search.addEventListener('click', () => {
    const APIKey = '4dc942476a3abf76b447d9991004f670';
    const city = document.querySelector('.search-box input').value.trim();

    if (city === '') return;

    // Fetch current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                forecastContainer.innerHTML = '';
                document.querySelector('.daily-forecast').style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            // Set current weather UI
            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;
                case 'Rain':
                    image.src = 'images/rain.png';
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;
                case 'Haze':
                    image.src = 'images/mist.png';
                    break;
                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            document.querySelector('.daily-forecast').style.display = 'block';
            container.style.height = '780px'; // Adjust height for forecast

            // Fetch 5-day/3-hour forecast
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`);
        })
        .then(response => response.json())
        .then(forecastJson => {
            if (!forecastJson || !forecastJson.list) {
                forecastContainer.innerHTML = '';
                return;
            }

            // Extract daily forecast - take data around 12:00 PM for each day
            const dailyData = {};
            forecastJson.list.forEach(item => {
                if (item.dt_txt.includes('12:00:00')) {
                    const date = new Date(item.dt_txt);
                    const options = { weekday: 'short' };
                    const dayName = date.toLocaleDateString(undefined, options);
                    dailyData[dayName] = item;
                }
            });

            // Clear previous forecast
            forecastContainer.innerHTML = '';

            // Generate forecast cards HTML
            for (const day in dailyData) {
                const dayForecast = dailyData[day];
                let icon = '';
                switch (dayForecast.weather[0].main) {
                    case 'Clear':
                        icon = 'images/clear.png';
                        break;
                    case 'Rain':
                        icon = 'images/rain.png';
                        break;
                    case 'Snow':
                        icon = 'images/snow.png';
                        break;
                    case 'Clouds':
                        icon = 'images/cloud.png';
                        break;
                    case 'Haze':
                        icon = 'images/mist.png';
                        break;
                    default:
                        icon = '';
                }
                const temp = `${parseInt(dayForecast.main.temp)}°C`;
                const card = document.createElement('div');
                card.classList.add('forecast-card');
                card.innerHTML = `
                    <div class="day">${day}</div>
                    <img src="${icon}" alt="${dayForecast.weather[0].main}">
                    <div class="temp">${temp}</div>
                `;
                forecastContainer.appendChild(card);
            }
        })
        .catch(error => {
            console.error(error);
            container.style.height = '400px';
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
            forecastContainer.innerHTML = '';
            document.querySelector('.daily-forecast').style.display = 'none';
            error404.style.display = 'block';
            error404.classList.add('fadeIn');
        });
});
