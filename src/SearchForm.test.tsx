import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import SearchForm from "./SearchForm";
import "@testing-library/jest-dom";
import { useSearchStore } from "./store";
import { GeocodeResult } from "./types";

// Mock the Zustand store hook
jest.mock("./store");

const mockSetSearchTerm = jest.fn();
const mockSetConfirmedSearch = jest.fn();
const mockSetSelectedLocationId = jest.fn();

const mockedUseSearchStore = useSearchStore as unknown as jest.Mock;

const sampleLocations: GeocodeResult[] = [
  {
    id: 1,
    name: "Berlin",
    latitude: 52.52,
    longitude: 13.405,
    country_code: "DE",
  },
  {
    id: 2,
    name: "Paris",
    latitude: 48.8566,
    longitude: 2.3522,
    country_code: "FR",
  },
];

beforeEach(() => {
  // Clear previous mock calls
  mockSetSearchTerm.mockClear();
  mockSetConfirmedSearch.mockClear();
  mockSetSelectedLocationId.mockClear();

  // Set default return value for the store hook
  mockedUseSearchStore.mockReturnValue({
    searchTerm: "",
    setSearchTerm: mockSetSearchTerm,
    confirmedSearch: "",
    setConfirmedSearch: mockSetConfirmedSearch,
    selectedLocationId: null,
    setSelectedLocationId: mockSetSelectedLocationId,
  });
});

describe("SearchForm", () => {
  test("updates input value and submits form", async () => {
    render(<SearchForm locations={[]} />);
    const input = screen.getByLabelText(/enter a location/i);
    const user = userEvent.setup();

    // Simulate typing in the input
    await user.type(input, "Berlin{enter}");
    expect(mockSetSearchTerm).toHaveBeenLastCalledWith("Berlin");
    expect(input).toHaveValue("Berlin");

    // Simulate form submission by pressing Enter in the input
    const form = input.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    // Verify that the form submission calls the required setters
    expect(mockSetConfirmedSearch).toHaveBeenCalledWith("Berlin");
    expect(mockSetSelectedLocationId).toHaveBeenCalledWith(null);
  });

  test("renders the select dropdown when locations are provided", () => {
    render(<SearchForm locations={sampleLocations} />);

    // The select element should be rendered using its screen-reader accessible label
    const select = screen.getByLabelText(/select a location/i);
    expect(select).toBeInTheDocument();

    // Verify that the dropdown renders the placeholder option and the provided location options
    expect(
      screen.getByRole("option", { name: /--Select a location--/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /Berlin, DE/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /Paris, FR/i })
    ).toBeInTheDocument();
  });

  test("calls setSelectedLocationId when a location is selected", () => {
    render(<SearchForm locations={sampleLocations} />);
    const select = screen.getByLabelText(/select a location/i);

    // Simulate selecting the location with id 2 (Paris)
    fireEvent.change(select, { target: { value: "2" } });
    expect(mockSetSelectedLocationId).toHaveBeenCalledWith(2);
  });
});
