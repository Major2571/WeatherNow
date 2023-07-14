import { fetchData, url } from '../api.js';
import * as module from '../module.js';
import { chartWeather } from './graph.js';

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
                <span class="m-icon mr-3">location_on</span>
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
            cardCurrentWeather.querySelector('[data-location]').innerHTML = `${name}, ${country}`;
        });

        currentWeatherSection.appendChild(cardCurrentWeather);

        // 5 Days
        fetchData(url.forecast(lat, lon), function (forecast) {

            const {
                list: forecastList,
                city: { timezone }
            } = forecast;


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

        // Today's highlights
        // Section Graphs
        chartWeather(lat, lon);

        fetchData(url.airPollution(lat, lon), function (airPollution) {
            const [{
                main: { aqi },
                components: { no2, o3, so2, pm2_5, pm10, nh3 }
            }] = airPollution.list;
    
            const cardHighlights = document.createElement('div');
            cardHighlights.classList.add('card-lg', 'px-0', 'ml-5');
    
            const aqiLevelText = module.aqiText[aqi].level;
            const aqiMessageText = module.aqiText[aqi].message;
    
            const aqiContent = `
                <div class="aqi-content">
                    <div class="aqi-${aqi}">
                        <span class="m-icon"> air </span>
                    </div>
                    <div class="aqi-info">
                        <p class="title-3 aqi-${aqi}">${aqiLevelText}</p>
                        <p class="aqi-message aqi-${aqi}">${aqiMessageText}</p>
                    </div>
                </div>
            `;
    
            const pollutantItems = [
                { name: 'PM<sub>2.5</sub>', value: pm2_5, threshold: 25 },
                { name: 'SO<sub>2</sub>', value: so2, threshold: 10 },
                { name: 'NO<sub>2</sub>', value: no2, threshold: 20 },
                { name: 'O<sub>3</sub>', value: o3, threshold: 50 },
                { name: 'PM<sub>10</sub>', value: pm10, threshold: 50 },
                { name: 'NH<sub>3</sub>', value: nh3, threshold: 10 }
            ];
    
            const pollutantItemsHtml = pollutantItems.map(item => `
                <li class="card-item ${module.getPollutantClass(item.value, item.threshold)}">
                    <p class="title-3">${item.name}</p>
                    <p class="pollutant-value">${item.value}</p>
                </li>
            `).join('');
    
            const airPollutionHtml = `
                <div class="highlight-list">

                    <div class="card card-sm highlight-card one">

                        <h3 class="title-3">
                            Air Quality Index
                        </h3>

                        ${aqiContent}

                        <div class="wrapper">
                            <ul class="card-list aqi aqi-${aqi}">
                                ${pollutantItemsHtml}
                            </ul>
                        </div>

                    </div>

                    <div class="highlight-card">
                        <div class="sunrise card card-sm">
                            <h3 class="title-3">Sunrise & Sunset</h3>
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
    
            cardHighlights.innerHTML = airPollutionHtml;
            highlightSection.appendChild(cardHighlights);
        });
    })
}

export const error404 = () => errorContent.style.display = 'flex';
