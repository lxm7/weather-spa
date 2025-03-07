import "./styles.css";

import { JSX, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchGeocode, fetchWeather } from "./api";
import { GeocodeResult } from "./types";
import SearchForm from "./SearchForm";
import { useSearchStore } from "./store";

function App(): JSX.Element {
  const { selectedLocationId, confirmedSearch } = useSearchStore();

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
    <div className="min-h-screen">
      <header className="text-center p-4">
        <h1 className="text-3xl font-bold">Nimbus Weather</h1>
      </header>
      <main className="flex-1 min-h-[calc(100vh-68px)] bg-[url('https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center p-4">
        <div className="max-w-4xl mx-auto">
          <SearchForm locations={locations} />

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
      </main>
    </div>
  );
}

export default App;
