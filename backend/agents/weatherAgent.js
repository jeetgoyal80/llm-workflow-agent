const axios = require("axios");

async function WeatherAgent(userId, info) {
  const location = info.location || info.message || "Delhi";
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const temp = data.main.temp;
    const description = data.weather[0].description;
    const feels = data.main.feels_like;

    const reply = `🌤 Weather in ${location}: ${description}, ${temp}°C (feels like ${feels}°C)`;

    return { reply }; // ✅ Return object, not string
  } catch (error) {
    console.error("🌧 Weather fetch failed:", error.message);
    throw new Error(`Could not fetch weather for "${location}". Try another city.`);
  }
}

module.exports = { WeatherAgent };
