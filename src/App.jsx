import { useEffect, useState } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_APP_API_KEY || "366b3c8510a4440999e38a626b7a0fbc"

// Mock weather data for development (to avoid API rate limits)
const MOCK_DATA = [
  { city_name: "New York", state_code: "NY", temp: 45.3, rh: 65, wind_spd: 8.5, precip: 0, weather: { icon: "c02d", description: "Scattered clouds" } },
  { city_name: "Los Angeles", state_code: "CA", temp: 68.2, rh: 55, wind_spd: 6.2, precip: 0, weather: { icon: "c01d", description: "Clear sky" } },
  { city_name: "Chicago", state_code: "IL", temp: 38.7, rh: 72, wind_spd: 12.3, precip: 0.1, weather: { icon: "c04d", description: "Overcast clouds" } },
  { city_name: "Houston", state_code: "TX", temp: 72.5, rh: 78, wind_spd: 5.8, precip: 0, weather: { icon: "c02d", description: "Scattered clouds" } },
  { city_name: "Phoenix", state_code: "AZ", temp: 82.4, rh: 25, wind_spd: 4.2, precip: 0, weather: { icon: "c01d", description: "Clear sky" } },
  { city_name: "Philadelphia", state_code: "PA", temp: 42.8, rh: 68, wind_spd: 9.1, precip: 0, weather: { icon: "c03d", description: "Broken clouds" } },
  { city_name: "San Antonio", state_code: "TX", temp: 75.3, rh: 62, wind_spd: 7.4, precip: 0, weather: { icon: "c02d", description: "Scattered clouds" } },
  { city_name: "San Diego", state_code: "CA", temp: 65.9, rh: 58, wind_spd: 5.5, precip: 0, weather: { icon: "c01d", description: "Clear sky" } },
  { city_name: "Dallas", state_code: "TX", temp: 70.1, rh: 55, wind_spd: 8.8, precip: 0, weather: { icon: "c02d", description: "Scattered clouds" } },
  { city_name: "San Jose", state_code: "CA", temp: 61.5, rh: 60, wind_spd: 6.7, precip: 0, weather: { icon: "c01d", description: "Clear sky" } }
]

// Set to true to use mock data, false to use real API
const USE_MOCK_DATA = true

// List of cities to fetch weather data for (reduced to 10 for free tier)
const CITIES = [
  { name: "New York", lat: 40.7128, lon: -74.0060 },
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "Chicago", lat: 41.8781, lon: -87.6298 },
  { name: "Houston", lat: 29.7604, lon: -95.3698 },
  { name: "Phoenix", lat: 33.4484, lon: -112.0740 },
  { name: "Philadelphia", lat: 39.9526, lon: -75.1652 },
  { name: "San Antonio", lat: 29.4241, lon: -98.4936 },
  { name: "San Diego", lat: 32.7157, lon: -117.1611 },
  { name: "Dallas", lat: 32.7767, lon: -96.7970 },
  { name: "San Jose", lat: 37.3382, lon: -121.8863 }
]

function App() {
  const [weatherData, setWeatherData] = useState([])
  const [searchInput, setSearchInput] = useState("")
  const [filteredResults, setFilteredResults] = useState([])
  const [weatherFilter, setWeatherFilter] = useState("all")

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Use mock data if enabled
        if (USE_MOCK_DATA) {
          setWeatherData(MOCK_DATA)
          setFilteredResults(MOCK_DATA)
          return
        }

        // Fetch cities one at a time with a delay to avoid rate limiting
        const weatherArray = []
        
        for (const city of CITIES) {
          try {
            const response = await fetch(`/api/v2.0/current?lat=${city.lat}&lon=${city.lon}&key=${API_KEY}&units=I`)
            
            // Check if response is ok
            if (!response.ok) {
              console.warn(`Failed to fetch data for ${city.name}: ${response.status}`)
              continue
            }
            
            const data = await response.json()
            
            if (data.data && data.data[0]) {
              weatherArray.push(data.data[0])
            }
          } catch (cityError) {
            console.warn(`Error fetching ${city.name}:`, cityError.message)
            // Continue to next city even if one fails
          }
          
          // Increase delay to 500ms between requests
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        
        setWeatherData(weatherArray)
        setFilteredResults(weatherArray)
      } catch (error) {
        console.error("Error fetching weather data:", error)
      }
    }

    fetchWeatherData()
  }, [])

  // Calculate summary statistics
  const avgTemp = weatherData.length > 0 
    ? (weatherData.reduce((sum, city) => sum + city.temp, 0) / weatherData.length).toFixed(1)
    : 0

  const maxTemp = weatherData.length > 0
    ? Math.max(...weatherData.map(city => city.temp)).toFixed(1)
    : 0

  const minTemp = weatherData.length > 0
    ? Math.min(...weatherData.map(city => city.temp)).toFixed(1)
    : 0

  const precipCount = weatherData.filter(city => city.precip > 0).length

  // Search functionality
  const searchCities = (searchValue) => {
    setSearchInput(searchValue)
    
    let filtered = weatherData

    if (searchValue !== "") {
      filtered = filtered.filter(city =>
        city.city_name.toLowerCase().includes(searchValue.toLowerCase())
      )
    }

    if (weatherFilter !== "all") {
      filtered = filtered.filter(city => {
        const condition = city.weather.description.toLowerCase()
        return condition.includes(weatherFilter.toLowerCase())
      })
    }

    setFilteredResults(filtered)
  }

  // Filter functionality
  const filterByWeather = (filterValue) => {
    setWeatherFilter(filterValue)
    
    let filtered = weatherData

    if (searchInput !== "") {
      filtered = filtered.filter(city =>
        city.city_name.toLowerCase().includes(searchInput.toLowerCase())
      )
    }

    if (filterValue !== "all") {
      filtered = filtered.filter(city => {
        const condition = city.weather.description.toLowerCase()
        return condition.includes(filterValue.toLowerCase())
      })
    }

    setFilteredResults(filtered)
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Weather Dashboard</h1>
        <p>Current weather conditions across major US cities</p>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Average Temperature</h3>
          <p className="stat-value">{avgTemp}°F</p>
        </div>
        <div className="stat-card">
          <h3>Highest Temperature</h3>
          <p className="stat-value">{maxTemp}°F</p>
        </div>
        <div className="stat-card">
          <h3>Lowest Temperature</h3>
          <p className="stat-value">{minTemp}°F</p>
        </div>
        <div className="stat-card">
          <h3>Cities with Precipitation</h3>
          <p className="stat-value">{precipCount}</p>
        </div>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by city name..."
          value={searchInput}
          onChange={(e) => searchCities(e.target.value)}
          className="search-input"
        />

        <select
          value={weatherFilter}
          onChange={(e) => filterByWeather(e.target.value)}
          className="weather-filter"
        >
          <option value="all">All Weather Conditions</option>
          <option value="clear">Clear</option>
          <option value="cloud">Cloudy</option>
          <option value="rain">Rainy</option>
          <option value="snow">Snow</option>
          <option value="fog">Fog</option>
          <option value="mist">Mist</option>
        </select>
      </div>

      <div className="weather-list">
        <div className="list-header">
          <span>City</span>
          <span>Temperature</span>
          <span>Condition</span>
          <span>Humidity</span>
          <span>Wind Speed</span>
        </div>
        
        {filteredResults.length > 0 ? (
          filteredResults.map((city) => (
            <div key={city.city_name} className="weather-row">
              <span className="city-name">{city.city_name}, {city.state_code}</span>
              <span className="temp">{city.temp}°F</span>
              <span className="condition">
                <img 
                  src={`https://www.weatherbit.io/static/img/icons/${city.weather.icon}.png`}
                  alt={city.weather.description}
                  className="weather-icon"
                />
                {city.weather.description}
              </span>
              <span>{city.rh}%</span>
              <span>{city.wind_spd.toFixed(1)} mph</span>
            </div>
          ))
        ) : (
          <div className="no-results">No cities found matching your criteria</div>
        )}
      </div>
    </div>
  )
}

export default App