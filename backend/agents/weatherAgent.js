const axios = require("axios");

async function WeatherAgent(userId, info) {
  const location = info.location || info.message || "Delhi";
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const temp = data.main.temp;
    const feels = data.main.feels_like;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const reply = `🌤 Weather in ${location}:
- Condition: ${description}
- Temperature: ${temp}°C (feels like ${feels}°C)
- Humidity: ${humidity}%
- Wind Speed: ${windSpeed} m/s`;

    return {
      reply,
      weather: {
        location,
        description,
        temperature: temp,
        feelsLike: feels,
        humidity,
        windSpeed
      }
    };
  } catch (error) {
    console.error("🌧 Weather fetch failed:", error.message);
    throw new Error(`Could not fetch weather for "${location}". Try another city.`);
  }
}

module.exports = { WeatherAgent };
