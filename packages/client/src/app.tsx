import { useState, type ChangeEvent } from 'react';
import { getCodeSandboxHost } from '@codesandbox/utils';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HotelPage from './pages/HotelPage';
import CityPage from './pages/CityPage';
import CountryPage from './pages/CountryPage';
import { City, Country, Hotel } from './types/types';

// areas of improvement
// 2.	Accessibility & Mobile Optimization
// •	Search results lack keyboard navigation.
// •	Fix: Implement keyboard navigation for a11y (e.g., arrow keys to navigate results).

// 3.	UI Enhancements
// •	Add loading states to indicate when results are being fetched.
// •	Add error handling (e.g., if the API is down, show an error message).

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost
  ? `https://${codeSandboxHost}`
  : 'http://localhost:3001';

const fetchSearchResults = async (query: string) => {
  const response = await fetch(`${API_URL}/search?query=${query}`);
  if (!response.ok) return { hotels: [], cities: [], countries: [] };

  return (await response.json()) as {
    hotels: Hotel[];
    cities: City[];
    countries: Country[];
  };
};

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [showClearBtn, setShowClearBtn] = useState(false);

  // The fetchData function fires on every keystroke. -> introduce debouncing to delay the API call until the user stops typing
  const fetchData = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setSearchValue(event.target.value);
    if (value === '') {
      clearSearch();
      return;
    }
    const { hotels, cities, countries } = await fetchSearchResults(value);
    setShowClearBtn(true);
    setHotels(hotels);
    setCities(cities);
    setCountries(countries);
  };

  const clearSearch = () => {
    setSearchValue('');
    setHotels([]);
    setCities([]);
    setCountries([]);
    setShowClearBtn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Main Search Page */}
        <Route
          path="/"
          element={
            <div className="App">
              <div className="container">
                <div className="row height d-flex justify-content-center align-items-center">
                  <div className="col-md-6">
                    <div className="dropdown">
                      {/*Instructions for User */}
                      <div className="instructions">
                        <h2 className="app-title">Find Your Destination</h2>
                        <p className="instruction-text">
                          Start typing the name of a hotel, city, or country to
                          search.
                        </p>
                      </div>

                      {/*Search Bar */}
                      <div className="form">
                        <i className="fa fa-search search-icon"></i>
                        <input
                          type="text"
                          className="form-control form-input"
                          placeholder="Search for hotels, cities, or countries..."
                          value={searchValue}
                          onChange={fetchData}
                        />
                        {showClearBtn && (
                          <span
                            className="left-pan"
                            onClick={clearSearch}
                            style={{ cursor: 'pointer' }}
                          >
                            <i className="fa fa-close"></i>
                          </span>
                        )}
                      </div>

                      {/*Search Results */}
                      {!!hotels.length ||
                      !!cities.length ||
                      !!countries.length ? (
                        <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
                          {/* Hotels Section */}
                          <h2>🏨 Hotels</h2>
                          {hotels.length ? (
                            hotels.map((hotel) => (
                              <li key={hotel._id}>
                                <Link
                                  to={`/hotels/${hotel._id}`}
                                  className="dropdown-item"
                                  state={{ hotel }}
                                >
                                  <i className="fa fa-building mr-2"></i>
                                  {hotel.hotel_name}
                                </Link>
                                <hr className="divider" />
                              </li>
                            ))
                          ) : (
                            <p className="no-results">No hotels found.</p>
                          )}

                          {/*Countries Section */}
                          <h2>🌍 Countries</h2>
                          {countries.length ? (
                            countries.map((country, index) => (
                              <li key={index}>
                                <Link
                                  to={`/countries/${country.country}`}
                                  className="dropdown-item"
                                >
                                  <i className="fa fa-globe mr-2"></i>{' '}
                                  {country.country}
                                </Link>
                                <hr className="divider" />
                              </li>
                            ))
                          ) : (
                            <p className="no-results">No countries found.</p>
                          )}

                          {/*Cities Section */}
                          <h2>🏙️ Cities</h2>
                          {cities.length ? (
                            cities.map((city, index) => (
                              <li key={index}>
                                <Link
                                  to={`/cities/${city.name}`}
                                  className="dropdown-item"
                                >
                                  <i className="fa fa-map-marker mr-2"></i>{' '}
                                  {city.name}
                                </Link>
                                <hr className="divider" />
                              </li>
                            ))
                          ) : (
                            <p className="no-results">No cities found.</p>
                          )}
                        </div>
                      ) : (
                        <div className="popular-searches">
                          <h3>Popular Searches:</h3>
                          <ul>
                            <li>🏨 Hilton Hotel</li>
                            <li>🌍 United Kingdom</li>
                            <li>🏙️ Paris</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/hotels/:id" element={<HotelPage />} />
        <Route path="/cities/:name" element={<CityPage />} />
        <Route path="/countries/:name" element={<CountryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
