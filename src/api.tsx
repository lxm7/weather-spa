import { GeocodeResult, WeatherData, WeatherResponse } from "./types";
import { weatherCodeMapping } from "./weatherCodes";

const makeDate = (unixTime: number) => new Date(unixTime * 1000);
const mathRound = (value: number) => Math.round(value);

export const transformDailyWeather = (data: WeatherResponse) => {
  return data.daily.time.map((unixTime: number, index: number) => ({
    date: makeDate(unixTime).toLocaleDateString(),
    day: makeDate(unixTime).toLocaleDateString("en-US", {
      weekday: "long",
    }),
    raw_weather_code: data.daily.weather_code[index], // numeric weather code
    weather_code: weatherCodeMapping[data.daily.weather_code[index]],
    temperature_2m_max: mathRound(data.daily.temperature_2m_max[index]),
    temperature_2m_min: mathRound(data.daily.temperature_2m_min[index]),
    wind_speed_10m_max: mathRound(data.daily.wind_speed_10m_max[index]),
  }));
};

export async function fetchGeocode(query = "Berlin"): Promise<GeocodeResult[]> {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}`
  );
  if (!response.ok) {
    throw new Error("Geocode fetch failed");
  }
  const data = await response.json();
  return data.results || [];
}

// Function to fetch weather data using the provided latitude and longitude
export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&timezone=GMT&format=json&timeformat=unixtime`
  );
  const data = await response.json();

  // Transform the daily data structure.
  const daily_weather = transformDailyWeather(data);
  return { ...data, daily_weather };
}
