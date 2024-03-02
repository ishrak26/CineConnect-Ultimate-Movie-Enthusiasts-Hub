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

export default function Map({ mapTiler }) {
  const [geoData, setGeoData] = useState({ lat: 23.750246, lng: 90.413466 })

  const center = [geoData.lat, geoData.lng]

  const markerIcon = new L.Icon({
    iconUrl: '/marker.png',
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  })

  const ZOOM_LEVEL = 9
  const mapRef = useRef()

  return (
    <MapContainer center={center} zoom={ZOOM_LEVEL} style={{ height: '100vh' }}>
      <TileLayer attribution={mapTiler.attribution} url={mapTiler.url} />
      {geoData.lat && geoData.lng && (
        <Marker position={[geoData.lat, geoData.lng]} icon={markerIcon}>
          <Popup>
            <b>
              {'Dhaka'}, {'Bangladesh'}
            </b>
          </Popup>
        </Marker>
      )}
      <ChangeView coords={center} />
    </MapContainer>
  )
}
