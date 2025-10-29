import { useEffect, useState } from "react"
import { useParams } from "react-router"

const API_KEY = import.meta.env.VITE_APP_API_KEY || "366b3c8510a4440999e38a626b7a0fbc"

function CityDetail() {
  const { cityName } = useParams()
  const [cityDetails, setCityDetails] = useState(null)

  useEffect(() => {
    const getCityDetails = async () => {
      try {
        // Mock detailed data based on city name
        const mockDetails = {
          "New York": { 
            sunrise: "6:45 AM", 
            sunset: "5:30 PM", 
            feelsLike: 43.2, 
            pressure: 1013,
            visibility: 10,
            uvIndex: 3,
            dewPoint: 32.1
          },
          "Los Angeles": { 
            sunrise: "6:30 AM", 
            sunset: "5:45 PM", 
            feelsLike: 66.5, 
            pressure: 1015,
            visibility: 12,
            uvIndex: 6,
            dewPoint: 48.3
          },
          "Chicago": { 
            sunrise: "6:50 AM", 
            sunset: "5:25 PM", 
            feelsLike: 36.2, 
            pressure: 1010,
            visibility: 8,
            uvIndex: 2,
            dewPoint: 28.5
          },
          "Houston": { 
            sunrise: "6:40 AM", 
            sunset: "5:50 PM", 
            feelsLike: 71.8, 
            pressure: 1012,
            visibility: 10,
            uvIndex: 5,
            dewPoint: 55.2
          },
          "Phoenix": { 
            sunrise: "6:25 AM", 
            sunset: "5:55 PM", 
            feelsLike: 80.1, 
            pressure: 1014,
            visibility: 15,
            uvIndex: 7,
            dewPoint: 35.4
          },
          "Philadelphia": { 
            sunrise: "6:48 AM", 
            sunset: "5:28 PM", 
            feelsLike: 40.5, 
            pressure: 1011,
            visibility: 9,
            uvIndex: 3,
            dewPoint: 30.8
          },
          "San Antonio": { 
            sunrise: "6:42 AM", 
            sunset: "5:52 PM", 
            feelsLike: 73.8, 
            pressure: 1013,
            visibility: 11,
            uvIndex: 5,
            dewPoint: 52.1
          },
          "San Diego": { 
            sunrise: "6:28 AM", 
            sunset: "5:48 PM", 
            feelsLike: 64.2, 
            pressure: 1016,
            visibility: 12,
            uvIndex: 6,
            dewPoint: 45.7
          },
          "Dallas": { 
            sunrise: "6:45 AM", 
            sunset: "5:50 PM", 
            feelsLike: 68.5, 
            pressure: 1012,
            visibility: 10,
            uvIndex: 5,
            dewPoint: 48.9
          },
          "San Jose": { 
            sunrise: "6:32 AM", 
            sunset: "5:42 PM", 
            feelsLike: 59.8, 
            pressure: 1015,
            visibility: 11,
            uvIndex: 5,
            dewPoint: 43.2
          }
        }

        setCityDetails(mockDetails[cityName] || mockDetails["New York"])
      } catch (error) {
        console.error("Error fetching city details:", error)
      }
    }

    getCityDetails()
  }, [cityName])

  if (!cityDetails) {
    return <div className="loading">Loading city details...</div>
  }

  return (
    <div className="city-detail-container">
      <h1>{cityName} Weather Details</h1>
      
      <div className="detail-grid">
        <div className="detail-card">
          <h3>Sunrise</h3>
          <p className="detail-value">{cityDetails.sunrise}</p>
        </div>
        
        <div className="detail-card">
          <h3>Sunset</h3>
          <p className="detail-value">{cityDetails.sunset}</p>
        </div>
        
        <div className="detail-card">
          <h3>Feels Like</h3>
          <p className="detail-value">{cityDetails.feelsLike}°F</p>
        </div>
        
        <div className="detail-card">
          <h3>Pressure</h3>
          <p className="detail-value">{cityDetails.pressure} mb</p>
        </div>
        
        <div className="detail-card">
          <h3>Visibility</h3>
          <p className="detail-value">{cityDetails.visibility} mi</p>
        </div>
        
        <div className="detail-card">
          <h3>UV Index</h3>
          <p className="detail-value">{cityDetails.uvIndex}</p>
        </div>
        
        <div className="detail-card">
          <h3>Dew Point</h3>
          <p className="detail-value">{cityDetails.dewPoint}°F</p>
        </div>
      </div>
    </div>
  )
}

export default CityDetail