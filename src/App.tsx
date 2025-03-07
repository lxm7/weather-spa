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
      <h1 className="text-3xl font-bold mb-4">Weather App</h1>
    </div>
  );
}

export default App;
