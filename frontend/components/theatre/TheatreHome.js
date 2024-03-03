import { useState, useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet'
import L from 'leaflet'
import styles from '@styles/TheatreHome.module.css'
import Link from 'next/link'

export function ChangeView({ coords }) {
  const map = useMap()
  map.setView(coords, 12)
  return null
}

export default function Map({ mapTiler, movieId }) {
  const [center, setCenter] = useState({ lat: 22.750246, lng: 90.413466 })
  const [theatres, setTheatres] = useState([])
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: '', lng: '' },
  })
  const [locationError, setLocationError] = useState(null)

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
      let url = `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/movie/${movieId}/theatre?`
      if (location.coordinates.lat && location.coordinates.lng) {
        url += `lat=${location.coordinates.lat}&lng=${location.coordinates.lng}`
      } else {
        url += `lat=${center.lat}&lng=${center.lng}`
      }
      const theatreResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // ...(cookie ? { Cookie: cookie } : {}),
        },
        // credentials: 'include',
      })

      // Check the response status code before proceeding to parse the JSON
      if (theatreResponse.ok) {
        // If the response is successful (status in the range 200-299)
        const theatreData = await theatreResponse.json() // Now it's safe to parse JSON
        // console.log('theatreData', theatreData)
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
  }, [location.coordinates.lat, location.coordinates.lng])

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          loaded: true,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        setLocationError(error.message)
      }
    )
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
              <b>{theatre.name}</b>
              <br />
              <span>Visit </span>
              <Link
                href={theatre.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-2 text-primary-600 hover:text-primary-700"
                // passHref
              >
                {theatre.website_url}
              </Link>
            </Popup>
          </Marker>
        ))}
        {/* {location.loaded && <Marker
            position={[location.coordinates.lat, location.coordinates.lng]}
            icon={markerIcon}
          >
            <Popup>
              <b>Your Location</b>
            </Popup>
          </Marker>} */}
        <ChangeView coords={center} />
      </MapContainer>
    </div>
  )
}
