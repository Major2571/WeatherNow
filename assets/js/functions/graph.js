import { fetchData, url } from '../api.js';
import * as module from '../module.js';

function createTemperatureChart(forecastList, timezone) {
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

    const gradientFill = temperatureChartElement.createLinearGradient(0, 0, 0, 300);
    gradientFill.addColorStop(0, "#f1dcc0");
    gradientFill.addColorStop(1, "#F5F8FD");

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
};

function createWindChart(forecastList, timezone) {
    const windData = [];

    for (const [index, data] of forecastList.entries()) {
        if (index > 5) break;

        const {
            dt: dateTimeUnix,
            wind: { speed: windSpeed },
        } = data;

        const windSpeedKmh = parseInt(module.mps_to_kmh(windSpeed));

        windData.push({
            dateTime: module.getHours(dateTimeUnix, timezone),
            windSpeedKmh
        });
    }

    const windHour = windData.map((data) => data.dateTime);
    const windInfo = windData.map((data) => data.windSpeedKmh);

    const windChartCanvas = document.getElementById('windChart').getContext("2d");

    const gradientFillWind = windChartCanvas.createLinearGradient(0, 0, 0, 300);
    gradientFillWind.addColorStop(0, "#C1D7F5");
    gradientFillWind.addColorStop(1, "#F5F8FD");

    const windChart = new Chart(windChartCanvas, {
        type: 'line',
        data: {
            labels: windHour,
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
};

export const chartWeather = function (lat, lon) {
    fetchData(url.forecast(lat, lon), function (forecast) {
        const {
            list: forecastList,
            city: { timezone },
        } = forecast;

        createTemperatureChart(forecastList, timezone);
        createWindChart(forecastList, timezone);
    });
};
