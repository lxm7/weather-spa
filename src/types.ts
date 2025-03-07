export type GeocodeResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
};

export type WeatherData = {
  daily_weather: DayWeather[];
};

// Define a union of all the keys coming from the API.
type WeatherKeys =
  | "time"
  | "weather_code"
  | "raw_weather_code"
  | "temperature_2m_max"
  | "temperature_2m_min"
  | "wind_speed_10m_max";

// Daily units: each of these keys maps to a string (representing the unit)
export type DailyUnits = { [K in WeatherKeys]: string };

// Daily data: each property is an array of numbers.
export type DailyData = { [K in WeatherKeys]: number[] };

// For a single day’s weather, we want to omit the "time" property and add our own "day" and "date" values.
// First, define the keys that appear in a single day (we exclude "time").
type SingleWeatherKeys = Exclude<WeatherKeys, "time">;

// Now build the type: a DayWeather has custom fields for day and date, and then each of the remaining keys maps to a number.
export type DayWeather = {
  day: number;
  date: number;
} & { [K in SingleWeatherKeys]: number };

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: DailyUnits;
  daily: DailyData;
}
