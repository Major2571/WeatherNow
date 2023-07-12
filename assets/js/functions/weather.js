import { fetchData, url } from '../api.js';
import * as module from '../module.js';

const container = document.querySelector('[data-container]');
const loading = document.querySelector('[data-loading]');
const currentLocationBtn = document.querySelector('[data-current-location-btn]');
const errorContent = document.querySelector('.error-content')

export const updateWeather = function (lat, lon) {

    loading.style.display = 'grid';
    errorContent.style.display = 'none';
    container.style.overflowY = 'hidden';
    container.classList.remove('fade-in');

    const currentWeatherSection = document.querySelector('[data-current-weather]');
    const highlightSection = document.querySelector('[data-highlights]');
    const hourlySection = document.querySelector('[data-hourly-forecast]');
    const forecastSection = document.querySelector('[data-5-day-forecast]');

    currentWeatherSection.innerHTML = "";
    highlightSection.innerHTML = "";
    hourlySection.innerHTML = "";
    forecastSection.innerHTML = "";

    if (window.location.hash === '#/current-location') {
        currentLocationBtn.setAttribute('disabled', '');
    } else {
        currentLocationBtn.removeAttribute('disabled');
    }

    // Current weather 
    fetchData(url.currentWeather(lat, lon), function (currentWeather) {

        const {
            weather,
            dt: dateUnix,
            sys: {
                sunrise: sunriseUnixUTC,
                sunset: sunsetUnixUTC,
            },
            main: {
                temp,
                feels_like,
                pressure,
                humidity
            },
            visibility,
            timezone
        } = currentWeather
        const [{ description, icon }] = weather;

        const cardCurrentWeather = document.createElement('div');
        cardCurrentWeather.classList.add('card', 'card-lg', 'current-weather-card');

        cardCurrentWeather.innerHTML = `
            <h2 class="title-2 card-title">Now</h2>

            <div class="weapper">
                <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>
                <img src="assets/images/weather_icons/${icon}.svg" width="64" height="64" alt="${description}"
                    class="weather-icon">
            </div>

            <p class="body-3">${description}</p>

            <ul class="meta-list">
                <li class="meta-item">
                    <span class="m-icon">location_on</span>
                    <p class="title-3 meta-text" data-location></p>
                </li> 
                <li class="meta-item">
                    <span class="m-icon">calendar_today</span>
                    <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
                </li>
                <li class="meta-item">
                    <span class="m-icon">schedule</span>
                    <p class="title-3 meta-text">${module.getTime(dateUnix, timezone)}</p>
                </li>
                
            </ul>
        `;

        fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
            cardCurrentWeather.querySelector('[data-location]').innerHTML = `
            ${name}, ${country}`;
        });

        currentWeatherSection.appendChild(cardCurrentWeather);



        // Today's highlights
        fetchData(url.airPollution(lat, lon), function (airPollution) {

            const [{
                main: { aqi },
                components: { no2, o3, so2, pm2_5 }
            }] = airPollution.list;

            const cardHighlights = document.createElement('div');
            cardHighlights.classList.add('card-lg', 'pt-0');

            cardHighlights.innerHTML = `
            <h2 class="title-2" id="highlights-label">
            Today's Highlights
            </h2>
            <div class="highlight-list">

                <div class="card card-sm highlight-card one">

                    <h3 class="title-3">
                        Air Quality Index
                    </h3>

                    <div class="wrapper">
                        <span class="m-icon"> air </span>

                        <ul class="card-list">
                            <li class="card-item">
                                <p class="title-1">${pm2_5.toPrecision(3)}</p>
                                <p class="label-1">PM<sub>2.5</sub>
                                </p>
                            </li>
                            <li class="card-item">
                                <p class="title-1">${so2.toPrecision(3)}</p>
                                <p class="label-1">SO<sub>2</sub>
                                </p>
                            </li>
                            <li class="card-item">
                                <p class="title-1">${no2.toPrecision(3)}</p>
                                <p class="label-1">NO<sub>2</sub>
                                </p>
                            </li>
                            <li class="card-item">
                                <p class="title-1">${o3.toPrecision(3)}</p>
                                <p class="label-1">O<sub>3</sub>
                                </p>
                            </li>
                        </ul>

                    </div>

                    <span class="badge aqi-${aqi}" title="${module.aqiText[aqi].message}">
                        ${module.aqiText[aqi].level}
                    </span>
                </div>

                <div class="card card-sm highlight-card two">

                    <h3 class="title-3"> Sunrise & Sunset </h3>

                    <div class="card-list">

                        <div class="card-item">
                            <span class="m-icon">clear_day</span>
                            <div>
                                <p class="label-1">Sunrise</p>
                                <p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>
                            </div>
                        </div>

                        <div class="card-item">
                            <span class="m-icon">clear_night</span>
                            <div>
                                <p class="label-1">Sunset</p>
                                <p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>
                            </div>
                        </div>

                    </div>

                </div>

                <div class="card card-sm highlight-card">
                    <h3 class="title-3">Humidity</h3>
                    <div class="wrapper">
                        <span class="m-icon">humidity_percentage</span>
                        <p class="title-1">${humidity}<sup>%</sup></p>
                    </div>
                </div>

                <div class="card card-sm highlight-card">
                    <h3 class="title-3">Pressures</h3>
                    <div class="wrapper">
                        <span class="m-icon">airwave</span>
                        <p class="title-1">${pressure}<sup>hPa</sup></p>
                    </div>
                </div>

                <div class="card card-sm highlight-card">
                    <h3 class="title-3">Visibility</h3>
                    <div class="wrapper">
                        <span class="m-icon">Visibility</span>
                        <p class="title-1">${visibility / 1000}<sup>km</sup></p>
                    </div>
                </div>

                <div class="card card-sm highlight-card">
                    <h3 class="title-3">Feels Like</h3>
                    <div class="wrapper">
                        <span class="m-icon">thermostat</span>
                        <p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
                    </div>
                </div>
            </div>
            `;

            highlightSection.appendChild(cardHighlights);

        });



        // 24h Forecast section
        fetchData(url.forecast(lat, lon), function (forecast) {

            const {
                list: forecastList,
                city: { timezone }
            } = forecast;

            hourlySection.innerHTML = `
            <div class="card-lg">
            <h2 class="title-2">Today at</h2>

            <div class="slider-container">

                <ul class="slider-list" data-temp></ul>

                <ul class="slider-list" data-wind></ul>

            </div>
            </div>
            `;

            for (const [index, data] of forecastList.entries()) {
                if (index > 7) break;

                const {
                    dt: dateTimeUnix,
                    main: { temp },
                    weather,
                    wind: {
                        deg: windDirection,
                        speed: windSpeed
                    }
                } = data;

                const [{ icon, description }] = weather;

                // Temp
                const tempLi = document.createElement('li');
                tempLi.classList.add('slider-item');

                tempLi.innerHTML = `
                    <div class="card card-sm slider-card">
                        <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
                        <img src="./assets/images/weather_icons/${icon}.svg" width="48" height="48" alt="${description}"
                            loading="lazy" class="weather-icon" title="${description}">
                        <p class="body-3">${parseInt(temp)}&deg;</p>
                    </div>
                `;

                hourlySection.querySelector('[data-temp]').appendChild(tempLi);

                // Wind 
                const windLi = document.createElement('li');
                windLi.classList.add('slider-item');

                windLi.innerHTML = `
                    <div class="card card-sm slider-card">

                        <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

                        <img src="./assets/images/weather_icons/direction.png" width="48" height="48" alt="direction"
                            loading="lazy" class="weather-icon" style="transform: rotate(${windDirection - 180}deg)" >
                        <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>

                    </div>
                `;

                hourlySection.querySelector('[data-wind]').appendChild(windLi);

            }


            // 5 Day forecast

            forecastSection.innerHTML = `
                
                <div class="forecast-card">
                    <ul data-forecast-list>
                    </ul>
                </div>
            `;

            for (let i = 7, len = forecastList.length; i < len; i += 8) {

                const {
                    main: { temp_max, humidity },
                    weather,
                    dt_txt,
                    wind: {
                        speed: windSpeed
                    }
                } = forecastList[i];

                const [{ icon, description }] = weather;
                const date = new Date(dt_txt);

                const li = document.createElement('li');
                li.classList.add('card-item');

                li.innerHTML = `
                    <div class="icon-wrapper">

                        <div class="flex justify-between items-center content-center">
                            <div>
                                <p class="label-1"> ${module.weekDayNames[date.getDay()]} </p>
                                <p class="body-3">${description}</p>
                            </div>
                            <img src="./assets/images/weather_icons/${icon}.svg" width="55" height="55" alt="${description}"
                                class="weather-icon" title=${description}>
                        </div>

                        <div class="flex justify-between items-center content-center">
                            <div>
                                <div class="flex items-center">
                                    <span class="m-icon">humidity_percentage</span>
                                    <p class="forecast-info">${humidity}<sup>%</sup></p>
                                </div>
                                <div class="flex items-center">
                                    <span class="m-icon">airwave</span>
                                    <p class="forecast-info">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>
                                </div>
                            </div>
                            <div class="forecast-temp">
                                <p classe="title-2">${parseInt(temp_max)}&deg;</p>
                            </div>
                        </div>
                    </div>
                `;

                forecastSection.querySelector('[data-forecast-list]').appendChild(li);

            }

            loading.style.display = 'none';
            container.style.overflowY = 'overlay';
            container.classList.add('fade-in');

        });


        // 24h Forecast section
        // 24h Forecast section
        fetchData(url.forecast(lat, lon), function (forecast) {
            const {
                list: forecastList,
                city: { timezone },
            } = forecast;

            const labels = [];
            const temperatures = [];
            const icons = [];

            forecastList.slice(0, 8).forEach((data) => {
                const {
                    dt: dateTimeUnix,
                    main: { temp },
                    weather,
                } = data;

                const formattedTime = module.getHours(dateTimeUnix, timezone);
                const [{ icon }] = weather;

                labels.push(formattedTime);
                temperatures.push(temp);
                icons.push(icon);
            });

            const chartElement = document.getElementById('weatherChart').getContext("2d");

            var gradientFill = chartElement.createLinearGradient(0, 0, 0, 200);
            gradientFill.addColorStop(0, "#C1D7F5");
            gradientFill.addColorStop(1, "#F5F8FD");

            const weatherChart = new Chart(chartElement, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Temperature',
                            data: temperatures,
                            borderColor: '#6da2e8',
                            backgroundColor: gradientFill,
                            pointRadius: 0,
                            lineTension: 0.3,
                            borderWidth: 2,
                            fill: true,
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                            },
                            grid: {
                                display: false,
                            },
                            ticks: {
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            }
                        },
                        y: {
                            display: false,
                            suggestedMin: Math.min(...temperatures) - 3,
                            suggestedMax: Math.max(...temperatures) + 3,
                            grid: {
                                display: false,
                            },
                        },
                    },
                    plugins: {
                        legend: false,
                        datalabels: {
                            align: 'top',
                            color: 'black',
                            font: {
                                size: 14,
                                weight: 'bold',
                            },
                            formatter: function (value) {
                                return Math.round(value) + '°';
                            },
                        },
                    },
                },
                plugins: [ChartDataLabels],
            });
        });






    })
}

export const error404 = () => errorContent.style.display = 'flex';
