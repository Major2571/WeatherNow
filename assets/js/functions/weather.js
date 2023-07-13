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
    const forecastSection = document.querySelector('[data-5-day-forecast]');

    currentWeatherSection.innerHTML = "";
    highlightSection.innerHTML = "";
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

        <li class="flex items-center">
            <span class="m-icon">location_on</span>
            <p class="title-3 meta-text" data-location></p>
        </li>
        
        <div>

            <img src="assets/images/weather_icons/${icon}.svg" width="64" height="64" alt="${description}" class="weather-icon">

            <p class="title-3">${module.getDate(dateUnix, timezone)}</p>

            <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>

            <p class="body-3">${description}</p>
        
            <div class="details">
                <div class="details-weather">
                    <div>
                        <span class="m-icon">water_drop</span>
                        </div>
                    <div>
                        <h3>Humidity</h3>
                        <p>${humidity}<sup>%</sup></p>
                    </div>
                </div>
                
                <div class="details-weather">
                    <div>
                        <span class="m-icon">thermostat</span>
                    </div>
                    <div>
                        <h3>Feels Like</h3>
                        <p>${parseInt(feels_like)}&deg;<sup>c</sup></p>
                    </div>
                </div>
            </div>
        </div>

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
                components: { no2, o3, so2, pm2_5, pm10, nh3 }
            }] = airPollution.list;




            const cardHighlights = document.createElement('div');
            cardHighlights.classList.add('card-lg', 'px-0', 'ml-5');

            cardHighlights.innerHTML = `
            <div class="highlight-list">

                <div class="card card-sm highlight-card one">

                    <h3 class="title-3">
                        Air Quality Index
                    </h3>
                    <div class="aqi-content">
                        <div class="aqi-${aqi}">
                            <span class="m-icon"> air </span>
                        </div>
                        <div class="aqi-info">
                            <p class="title-3 aqi-${aqi}"> ${module.aqiText[aqi].level} </sub>
                            <p class="aqi-message aqi-${aqi}"> ${module.aqiText[aqi].message} </sub>
                        </div>
                    </div>

                    </span>

                    <div class="wrapper">

                        <ul class="card-list aqi aqi-${aqi}">
                       
                        <li class="card-item ${module.getPollutantClass(pm2_5, 25)}">
                          <p class="title-3">PM<sub>2.5</sub></p>
                          <p class="pollutant-value">${pm2_5}</p>
                        </li>
                        <li class="card-item ${module.getPollutantClass(so2, 10)}">
                          <p class="title-3">SO<sub>2</sub></p>
                          <p class="pollutant-value">${so2}</p>
                        </li>
                        <li class="card-item ${module.getPollutantClass(no2, 20)}">
                          <p class="title-3">NO<sub>2</sub></p>
                          <p class="pollutant-value">${no2}</p>
                        </li>
                        <li class="card-item ${module.getPollutantClass(o3, 50)}">
                          <p class="title-3">O<sub>3</sub></p>
                          <p class="pollutant-value">${o3}</p>
                        </li>
                        <li class="card-item ${module.getPollutantClass(pm10, 50)}">
                          <p class="title-3">PM<sub>10</sub></p>
                          <p class="pollutant-value">${pm10}</p>
                        </li>
                        <li class="card-item ${module.getPollutantClass(nh3, 10)}">
                          <p class="title-3">NH<sub>3</sub></p>
                          <p class="pollutant-value">${nh3}</p>
                        </li>
                      
                        </ul>

                    </div>

                    
                </div>

                <div class="highlight-card">

                <div class="sunrise card card-sm">
                    <h3 class="title-3"> Sunrise & Sunset </h3>
                
                    <div class="card-list">
                        <div class="card-item">
                            <div>
                                <img src="./assets/images/weather_icons/01d.svg" alt="sunrise">
                            </div>
                            <div>
                                <p class="body-3">Sunrise</p>
                                <p class="title-2">${module.getTime(sunriseUnixUTC, timezone)}</p>
                            </div>
                        </div>
                
                        <div class="card-item">
                            <div>
                                <img src="./assets/images/weather_icons/01n.svg" alt="sunset">
                            </div>
                            <div>
                                <p class="body-3">Sunset</p>
                                <p class="title-2">${module.getTime(sunsetUnixUTC, timezone)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            
                <div class="highlight-card two">
                    <div class="card card-sm">
                        <h3 class="title-3">Pressures</h3>
                        <div class="wrapper">
                            <span class="m-icon">airwave</span>
                            <p class="title-1">${pressure}<sup>hPa</sup></p>
                        </div>
                    </div>
                
                    <div class="card card-sm">
                        <h3 class="title-3">Visibility</h3>
                        <div class="wrapper">
                            <span class="m-icon">Visibility</span>
                            <p class="title-1">${visibility / 1000}<sup>km</sup></p>
                        </div>
                    </div>
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
                                    <span class="m-icon">water_drop</span>
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
        fetchData(url.forecast(lat, lon), function (forecast) {
            const {
                list: forecastList,
                city: { timezone },
            } = forecast;

            const labels = [];
            const temperatures = [];
            const icons = [];

            forecastList.slice(0, 6).forEach((data) => {
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

            const temperatureChartElement = document.getElementById('weatherChart').getContext("2d");

            let gradientFill = temperatureChartElement.createLinearGradient(0, 0, 0, 300);
            gradientFill.addColorStop(0, "#f1dcc0");
            gradientFill.addColorStop(1, "#F5F8FD");

            temperatureChartElement.canvas.style.height = "400px";

            const weatherChart = new Chart(temperatureChartElement, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Temperature',
                            data: temperatures,
                            borderColor: '#eaaf6d',
                            backgroundColor: gradientFill,
                            pointRadius: 3,
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
                            suggestedMax: Math.max(...temperatures) + 4,
                            grid: {
                                display: true,
                            },
                            ticks: {
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
                                return Math.round(value) + '°C';
                            },
                        },
                    },
                },
                plugins: [ChartDataLabels],
            });
        });


        fetchData(url.forecast(lat, lon), function (forecast) {
            const {
                list: forecastList,
                city: { timezone },
            } = forecast;

            const windData = [];

            for (const [index, data] of forecastList.entries()) {
                if (index > 5) break;

                const {
                    dt: dateTimeUnix,
                    wind: { deg: windDirection, speed: windSpeed },
                } = data;

                const windSpeedKmh = parseInt(module.mps_to_kmh(windSpeed));

                windData.push({ dateTime: module.getHours(dateTimeUnix, timezone), windSpeedKmh });
            }

            const windInfo = windData.map((data) => data.windSpeedKmh);

            const windChartCanvas = document.getElementById('windChart').getContext("2d");

            let gradientFillWind = windChartCanvas.createLinearGradient(0, 0, 0, 300);
            gradientFillWind.addColorStop(0, "#C1D7F5");
            gradientFillWind.addColorStop(1, "#F5F8FD");


            const windChart = new Chart(windChartCanvas, {
                type: 'line',
                data: {
                    labels: windData.map((data) => data.dateTime),
                    datasets: [
                        {
                            label: 'Wind Speed (km/h)',
                            data: windInfo,
                            borderColor: '#6da2e8',
                            backgroundColor: gradientFillWind,
                            pointRadius: 3,
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
                            },
                        },
                        y: {
                            display: false,
                            suggestedMin: Math.min(...windInfo) - 3,
                            suggestedMax: Math.max(...windInfo) + 5,
                            grid: {
                                display: true,
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        datalabels: {
                            align: 'top',
                            color: 'black',
                            font: {
                                size: 12,
                                weight: 'bold',
                            },
                            formatter: function (value) {
                                return value + ' km/h';
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
