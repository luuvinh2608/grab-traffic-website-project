'use client';
import React, { useState, useRef } from 'react';

import { Map, Marker, Popup, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import districts from '@/data/districts.json';
import { CiMapPin } from 'react-icons/ci';

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const mapRef = useRef<MapRef>(null);

  const districtsInfo = districts['Districts'];
  console.log(districtsInfo);

  const zoomToDistrict = (
    e: React.MouseEvent,
    district: (typeof districtsInfo)[number],
  ) => {
    e.stopPropagation();
    const [longitude, latitude] = [district['Longitude'], district['Latitude']];
    setSelectedDistrict(district['Name']);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 14,
      });
    }
  };

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={mapboxToken}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      initialViewState={{
        latitude: 10.8019,
        longitude: 106.6538,
        zoom: 12,
      }}
      maxZoom={22}
    >
      {districtsInfo.map((district, index) => {
        return (
          <Marker
            key={index}
            latitude={district['Latitude']}
            longitude={district['Longitude']}
          >
            <button onClick={(e) => zoomToDistrict(e, district)}>
              <CiMapPin size={50} color="red" />
            </button>
          </Marker>
        );
      })}

      {selectedDistrict && (
        <Popup
          latitude={
            districtsInfo.find((d) => d.Name === selectedDistrict)?.Latitude ??
            10.729677
          }
          longitude={
            districtsInfo.find((d) => d.Name === selectedDistrict)?.Longitude ??
            106.702215
          }
          closeButton={true}
          closeOnClick={false}
          onClose={() => setSelectedDistrict(null)}
        >
          <div className="text-black">
            <h2 className="font-bold">{selectedDistrict}</h2>
            <p>
              Details:{' '}
              {districtsInfo.find((d) => d.Name === selectedDistrict)?.Details}
            </p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
