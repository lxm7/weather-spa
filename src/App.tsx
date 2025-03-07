import "./styles.css";

import { JSX, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchGeocode, fetchWeather } from "./api";
import { GeocodeResult } from "./types";

function App(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedSearch, setConfirmedSearch] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );

  const {
    data: locations,
    isLoading: geocodeLoading,
    error: geocodeError,
  } = useQuery({
    queryKey: ["geocode", confirmedSearch],
    queryFn: () => fetchGeocode(confirmedSearch),
  });

  // Find the selected location object (if any)
  const selectedLocation: GeocodeResult | undefined = locations?.find(
    (loc: GeocodeResult) => loc.id === selectedLocationId
  );

  // Weather query: only enabled when a location has been selected
  const {
    data: weather,
    isLoading: weatherLoading,
    error: weatherError,
  } = useQuery({
    queryKey: [
      "weather",
      selectedLocation?.latitude,
      selectedLocation?.longitude,
    ],
    queryFn: () =>
      fetchWeather(selectedLocation!.latitude, selectedLocation!.longitude),
  });

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Weather App</h1>
        <div className="mb-4">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Enter location..."
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={() => {
              setConfirmedSearch(searchTerm);
              // Reset the selected location on a new search
              setSelectedLocationId(null);
            }}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Search
          </button>
        </div>
        {locations && locations.length > 0 && (
          <div className="mb-4">
            <label htmlFor="locationSelect" className="mr-2">
              Select a location:
            </label>
            <select
              id="locationSelect"
              onChange={(e) => {
                setSelectedLocationId(Number(e.target.value));
              }}
              className="p-2 border rounded"
              defaultValue=""
            >
              <option value="" disabled>
                --Select a location--
              </option>
              {locations.map((loc: GeocodeResult) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}, {loc.country_code} (Lat: {loc.latitude}, Lon:{" "}
                  {loc.longitude})
                </option>
              ))}
            </select>
          </div>
        )}
      </header>
      {selectedLocation && weatherLoading && <p>Loading weather data...</p>}
      {weatherError && <p>Error loading weather data.</p>}
      {weather && (
        <>
          <h2 className="text-2xl mb-2">5 day weather</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-around">
            {weather.daily_weather.slice(0, 5).map((day, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded shadow md:mb-0 md:flex-1 text-center"
              >
                <p>
                  Day: {day.day} - {day.date}
                </p>
                <p>Condition: {day.weather_code}</p>
                <p>
                  Min: {day.temperature_2m_min}°C - Max:{" "}
                  {day.temperature_2m_max}°C
                </p>
                <p>Max wind speed: {day.wind_speed_10m_max} km/h</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
