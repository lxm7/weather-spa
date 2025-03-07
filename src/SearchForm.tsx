import { useSearchStore } from "./store";
import { GeocodeResult } from "./types";

const SearchForm = ({ locations }) => {
  const {
    searchTerm,
    setSearchTerm,
    setConfirmedSearch,
    setSelectedLocationId,
  } = useSearchStore();

  return (
    <div className="text-center mb-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // When the form submits (by pressing Enter in the text input),
          // set the confirmed search and reset any previously selected location.
          setConfirmedSearch(searchTerm);
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Enter a location..."
          aria-label="Enter a location"
          className="p-2 border rounded mr-2 bg-sky-100"
        />
        {/* Render the select only if locations are available */}
        {locations && locations.length > 0 && (
          <div className="mt-4">
            <label htmlFor="locationSelect" className="sr-only mr-2">
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
