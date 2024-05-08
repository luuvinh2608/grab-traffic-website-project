/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react'
import { Map, MapRef, Source, Layer, MapLayerMouseEvent } from 'react-map-gl'
import districts from '../../../data/districts.json'
import { FeatureCollection, Point } from 'geojson'
import { useAppDispatch, setShowDetails } from '../../libs/redux'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const mapRef = useRef<MapRef>(null)
  const mapContainer = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  // const [isLoading, setIsLoading] = useState(true);

  const geojson: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: districts.map((district) => ({
      type: 'Feature',
      properties: { place: district.place, request: district.request },
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(district.long), parseFloat(district.lat)]
      }
    }))
  }
  const clusterLayer = {
    id: 'clusters',
    type: 'circle',
    source: 'districts',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
    }
  }
  const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'districts',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  }

  const unclusteredPointLayer = {
    id: 'unclustered-point',
    type: 'circle',
    source: 'districts',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 20,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  }

  const zoomToDistrict = (e: MapLayerMouseEvent, district: (typeof districts)[number]) => {
    e.originalEvent.stopPropagation()
    const { long, lat, place } = district
    setSelectedDistrict(place)
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [parseFloat(long), parseFloat(lat)],
        zoom: 16
      })
    }
  }

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const features = event.features
    const unclusteredPoints = features?.filter((f) => f.layer?.id === 'unclustered-point')

    if (unclusteredPoints && unclusteredPoints.length > 0) {
      const clickedFeature = unclusteredPoints[0]
      const districtData = districts.find((d) => d.place === clickedFeature.properties?.place)

      if (districtData) {
        console.log('District data:', districtData)
        zoomToDistrict(event, districtData)
        dispatch(setShowDetails({ showDetails: true, district: districtData.place }))
      }
    } else {
      setSelectedDistrict(null)
    }
  }

  const trafficLayer = {
    id: 'traffic',
    type: 'line',
    source: 'traffic',
    'source-layer': 'traffic',
    paint: {
      'line-color': [
        'case',
        ['==', ['get', 'congestion'], 'low'],
        '#00ff00',
        ['==', ['get', 'congestion'], 'moderate'],
        '#ffff00',
        ['==', ['get', 'congestion'], 'heavy'],
        '#ff0000',
        ['==', ['get', 'congestion'], 'severe'],
        '#8b0000',
        '#000000'
      ],
      'line-width': 2
    }
  }

  const map = useRef<mapboxgl.Map | null>(null)
  const [lng, setLng] = useState(-70.9)
  const [lat, setLat] = useState(42.35)
  const [zoom, setZoom] = useState(9)

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/standard',
      center: [lng, lat],
      accessToken: mapboxToken!,
      zoom: zoom
    })

    map.current.on('move', () => {
      setLng(map?.current?.getCenter().lng ?? 0)
      setLat(map?.current?.getCenter().lat ?? 0)
      setZoom(map?.current?.getZoom() ?? 0)
    })
  })

  return <div ref={mapContainer} className="map-container" style={{ width: '1000px', height: '800px' }} />
}
