import { GeocodeResult, WeatherData } from "./types";

export const transformDailyWeather = (data: any) => {
  // Assuming all arrays have the same length
  return data.daily.time.map((unixTime: number, index: number) => ({
    // Convert Unix time (in seconds) to a human readable date.
    date: new Date(unixTime * 1000).toLocaleDateString(),
    day: new Date(unixTime * 1000).toLocaleDateString("en-US", {
      weekday: "long",
    }),
    weather_code: data.daily.weather_code[index],
    temperature_2m_max: data.daily.temperature_2m_max[index],
    temperature_2m_min: data.daily.temperature_2m_min[index],
    wind_speed_10m_max: data.daily.wind_speed_10m_max[index],
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
