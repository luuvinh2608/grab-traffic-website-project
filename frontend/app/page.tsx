'use client';
import React, { useState, useRef } from 'react';
import {
  Map,
  Popup,
  MapRef,
  Source,
  Layer,
  MapLayerMouseEvent,
} from 'react-map-gl';
import districts from '@/data/districts.json';
import { FeatureCollection, Point } from 'geojson';

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const mapRef = useRef<MapRef>(null);

  const geojson: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: districts.map((district) => ({
      type: 'Feature',
      properties: { place: district.place, request: district.request },
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(district.long), parseFloat(district.lat)],
      },
    })),
  };
  const clusterLayer = {
    id: 'clusters',
    type: 'circle',
    source: 'districts',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1',
      ],
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
    },
  };

  const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'districts',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
    },
  };

  const unclusteredPointLayer = {
    id: 'unclustered-point',
    type: 'circle',
    source: 'districts',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 20,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
    },
  };

  const zoomToDistrict = (
    e: MapLayerMouseEvent,
    district: (typeof districts)[number],
  ) => {
    e.originalEvent.stopPropagation();
    const { long, lat, place } = district;
    console.log('Zooming to district:', place);
    console.log('Long: ', long);
    console.log('Lat: ', lat);
    setSelectedDistrict(place);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [parseFloat(long), parseFloat(lat)],
        zoom: 16,
      });
    }
  };

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const features = event.features;
    const unclusteredPoints = features?.filter(
      (f) => f.layer?.id === 'unclustered-point',
    );

    if (unclusteredPoints && unclusteredPoints.length > 0) {
      const clickedFeature = unclusteredPoints[0];
      const districtData = districts.find(
        (d) => d.place === clickedFeature.properties?.place,
      );

      if (districtData) {
        console.log('District data:', districtData);
        zoomToDistrict(event, districtData);
      }
    } else {
      setSelectedDistrict(null);
    }
  };

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={mapboxToken}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      initialViewState={{
        latitude: 10.770496918,
        longitude: 106.692330564,
        zoom: 12,
      }}
      maxZoom={22}
      interactiveLayerIds={['unclustered-point']}
      onClick={handleMapClick}
    >
      <Source
        id="districts"
        type="geojson"
        data={geojson}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...(clusterLayer as any)} />
        <Layer {...(clusterCountLayer as any)} />
        <Layer {...(unclusteredPointLayer as any)} />
      </Source>

      {selectedDistrict && (
        <Popup
          latitude={parseFloat(
            districts.find((d) => d.place === selectedDistrict)?.lat ??
              '10.729677',
          )}
          longitude={parseFloat(
            districts.find((d) => d.place === selectedDistrict)?.long ??
              '106.660172',
          )}
          closeButton={true}
          onClose={() => setSelectedDistrict(null)}
        >
          <div className="text-black">
            <h2 className="font-bold">{selectedDistrict}</h2>
            <p>
              Details:{' '}
              {districts.find((d) => d.place === selectedDistrict)?.request ??
                'No details available.'}
            </p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
