import { useState, useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet'
import L from 'leaflet'
import styles from '@styles/TheatreHome.module.css'

export function ChangeView({ coords }) {
  const map = useMap()
  map.setView(coords, 12)
  return null
}

export default function Map({ mapTiler, movieId }) {
  const [geoData, setGeoData] = useState({ lat: 23.750246, lng: 90.413466 })
  const [theatres, setTheatres] = useState([])

  const center = [geoData.lat, geoData.lng]

  const markerIcon = new L.Icon({
    iconUrl: '/marker.png',
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  })

  const ZOOM_LEVEL = 9
  const mapRef = useRef()

  useEffect(() => {
    const getTheatres = async () => {
      const theatreResponse = await fetch(
        `http://localhost:4000/v1/movie/${movieId}/theatre?lat=${geoData.lat}&lng=${geoData.lng}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          // credentials: 'include',
        }
      )

      // Check the response status code before proceeding to parse the JSON
      if (theatreResponse.ok) {
        // If the response is successful (status in the range 200-299)
        const theatreData = await theatreResponse.json() // Now it's safe to parse JSON
          setTheatres(theatreData)
      } else {
        // If the response is not successful, log or handle the error
        console.error(
          'Error with request:',
          theatreResponse.status,
          theatreResponse.statusText
        )
        // Optionally, you can still read and log the response body
        // const responseBody = await ratingResponse.text()
        // console.log('Response Body:', responseBody)
      }
    }

    getTheatres()
  }, [])

  return (
    <div className=" col-span-3">
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        style={{ height: '80vh' }}
      >
        <TileLayer attribution={mapTiler.attribution} url={mapTiler.url} />
          {theatres.map((theatre, idx) => (
            <Marker
              position={[theatre.lat, theatre.lng]}
              icon={markerIcon}
              key={idx}
            >
              <Popup>
                <b>
                  {theatre.name}
                </b>
              </Popup>
            </Marker>
          ))}
        <ChangeView coords={center} />
      </MapContainer>
    </div>
  )
}
