import { useState } from "react";
import { useSearchStore } from "./store";
import { GeocodeResult } from "./types";

export interface SearchFormProps {
  locations?: GeocodeResult[];
}

const SearchForm: React.FC<SearchFormProps> = ({ locations }) => {
  const { setSearchTerm, setConfirmedSearch, setSelectedLocationId } =
    useSearchStore();
  // Local state for the input so that we don't call the global setter on each keystroke
  const [localInput, setLocalInput] = useState("");

  return (
    <div className="text-center mb-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // On submit, update the global store with the final input value
          setSearchTerm(localInput);
          setConfirmedSearch(localInput);
          setSelectedLocationId(null);
        }}
        className="text-center mb-4"
      >
        {/* Accessible label is visually hidden */}
        <label htmlFor="locationInput" className="sr-only">
          Enter a location
        </label>
        <input
          id="locationInput"
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          type="text"
          placeholder="Enter a location..."
          aria-label="Enter a location"
          className="p-2 border rounded bg-sky-100 text-center"
        />
        {/* Render the select only if locations are provided */}
        {locations && locations.length > 0 && (
          <div className="mt-4">
            <label htmlFor="locationSelect" className="sr-only">
              Select a location:
            </label>
            <select
              id="locationSelect"
              onChange={(e) => setSelectedLocationId(Number(e.target.value))}
              className="p-2 border rounded bg-sky-100"
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
      </form>
    </div>
  );
};

export default SearchForm;
