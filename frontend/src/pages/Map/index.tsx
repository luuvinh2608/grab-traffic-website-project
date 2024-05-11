import { useState, useRef, useEffect } from 'react'
import {
  Map,
  MapRef,
  Source,
  Layer,
  MapLayerMouseEvent,
  GeolocateControl,
  LayerProps,
  NavigationControl,
  ScaleControl
} from 'react-map-gl'
import districts from '../../../data/districts.json'
// import { locationService, Location } from '../../services/locationService';
import { FeatureCollection, Point } from 'geojson'
import { useAppDispatch, setShowDetails } from 'libs/redux'
import { Details } from 'components/Details'
import 'mapbox-gl/dist/mapbox-gl.css'
import './index.css'
import reactIcon from 'assets/react.svg'

export const MapPage = () => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  const [, setSelectedDistrict] = useState<string | null>(null)
  const mapRef = useRef<MapRef>(null)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useAppDispatch()

  // useEffect(() => {
  //   const fetchLocations = async () => {
  //     try {
  //       const data = await locationService.getAllLocations();
  //       setLocations(data);
  //       setIsLoading(false);
  //     } catch (error: unknown) {
  //       if (error instanceof Error) {
  //         setError(error.message);
  //       } else {
  //         setError("Error fetching locations");
  //       }
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchLocations();
  // }, []);

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

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
      'line-width': 4
    }
  }

  useEffect(() => {
    if (mapRef.current) {
      // add an image for the camera icon after the map has loaded
      if (mapRef.current.getMap()) {
        const image = new Image()
        image.src = reactIcon
        image.onload = () => {
          mapRef.current?.getMap().addImage('camera', image)
        }
      }
    }
  }, [mapRef, isLoading])

  return (
    <div className="flex h-full w-full flex-1">
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        reuseMaps
        style={{ width: '100%' }}
        mapStyle="mapbox://styles/mapbox/standard"
        initialViewState={{
          latitude: 10.770496918,
          longitude: 106.692330564,
          zoom: 16,
          pitch: 70,
          bearing: 0
        }}
        maxZoom={22}
        minZoom={16}
        onLoad={() => {
          setIsLoading(false)
        }}
        interactiveLayerIds={['unclustered-point']}
        onClick={handleMapClick}
        attributionControl={false}>
        <ScaleControl maxWidth={100} unit="metric" />
        <NavigationControl showCompass showZoom position="bottom-right" />
        <GeolocateControl positionOptions={{ enableHighAccuracy: true }} trackUserLocation position="bottom-right" />
        {isLoading && (
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white bg-opacity-75">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900" />
          </div>
        )}
        <Source id="traffic" type="vector" url="mapbox://mapbox.mapbox-traffic-v1">
          <Layer {...(trafficLayer as LayerProps)} />
        </Source>

        <Source id="districts" type="geojson" data={geojson} cluster={true} clusterMaxZoom={14} clusterRadius={50}>
          <Layer {...(clusterLayer as LayerProps)} />
          <Layer {...(clusterCountLayer as LayerProps)} />
          <Layer {...(unclusteredPointLayer as LayerProps)} />
        </Source>
      </Map>
      <Details />
    </div>
  )
}
