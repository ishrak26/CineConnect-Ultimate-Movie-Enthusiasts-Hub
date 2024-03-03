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

export default function Map({ mapTiler, center, theatres, location }) {

  const markerIcon = new L.Icon({
    iconUrl: '/marker.png',
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  })

  const ZOOM_LEVEL = 9

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
          <Marker
              position={[location.coordinates.lat, location.coordinates.lng]}
              icon={markerIcon}
            >
              <Popup>
                <b>
                  {'You are here'}
                </b>
              </Popup>
            </Marker>
        <ChangeView coords={center} />
      </MapContainer>
      {/* <div className="row my-4">
        <div className="col d-flex justify-content-center">
          <button className="btn btn-primary" onClick={showMyLocation}>
            Locate Me
          </button>
        </div>
      </div> */}
    </div>
  )
}
