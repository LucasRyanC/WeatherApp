const apiKey = "c3e319b325c32e6ed762a1109cf13de8";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");

const cityElement = document.querySelector("#city");
const dateElement = document.querySelector("#date");
const tempElement = document.querySelector("#temperature");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");

const feelsLikeElement = document.querySelector("#feels-like");
const humidityElement = document.querySelector("#humidity");
const windElement = document.querySelector("#wind");
const pressureElement = document.querySelector("#pressure");
const visibilityElement = document.querySelector("#visibility");
const cloudsElement = document.querySelector("#clouds");

const weatherContent = document.querySelector("#weather-content");
const forecastContainer = document.querySelector("#forecast-data");
const errorMessage = document.querySelector("#error-message");

const getWeatherData = async (city) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  const [weatherRes, forecastRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(forecastUrl),
  ]);

  const weatherData = await weatherRes.json();
  const forecastData = await forecastRes.json();

  return { weatherData, forecastData };
};

const showWeatherData = async (city) => {
  const { weatherData, forecastData } = await getWeatherData(city);

  if (weatherData.cod === "404") {
    errorMessage.classList.remove("hide");
    weatherContent.classList.add("hide");
    return;
  }

  errorMessage.classList.add("hide");

  cityElement.innerText = `${weatherData.name}, ${weatherData.sys.country}`;
  tempElement.innerText = parseInt(weatherData.main.temp);
  descElement.innerText = weatherData.weather[0].description.toUpperCase();
  weatherIconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`,
  );

  feelsLikeElement.innerText = `${parseInt(weatherData.main.feels_like)}°C`;
  humidityElement.innerText = `${weatherData.main.humidity}%`;
  windElement.innerText = `${weatherData.wind.speed} km/h`;
  pressureElement.innerText = `${weatherData.main.pressure} hPa`;
  visibilityElement.innerText = `${weatherData.visibility / 1000} km`;
  cloudsElement.innerText = `${weatherData.clouds.all}%`;

  const options = { weekday: "long", day: "numeric", month: "short" };
  dateElement.innerText = new Date().toLocaleDateString("en-US", options);

  forecastContainer.innerHTML = "";

  const indices = [8, 16];

  indices.forEach((index) => {
    const item = forecastData.list[index];
    const date = new Date(item.dt * 1000);
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
    const dayNum = date.getDate();
    const monthNum = date.getMonth() + 1;

    const forecastHTML = `
            <div class="glass-card forecast-card">
                <div>
                    <p class="day">${dayName} ${dayNum}/${monthNum}</p>
                    <p style="opacity: 0.6; font-size: 0.8rem;">${item.weather[0].main}</p>
                </div>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icon">
                <span class="temp">${parseInt(item.main.temp)}°C</span>
            </div>
        `;
    forecastContainer.innerHTML += forecastHTML;
  });

  weatherContent.classList.remove("hide");
};

searchBtn.addEventListener("click", (e) => {
  const city = cityInput.value;
  if (city) showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;
    showWeatherData(city);
  }
});
