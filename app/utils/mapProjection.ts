import * as d3Geo from 'd3-geo';
import { EpochId, MapProjectionConfig, GeoBounds } from '@/types';

// Epoch-specific projection configurations
export const EPOCH_PROJECTIONS: Record<EpochId, MapProjectionConfig> = {
  'bronze-age': {
    type: 'naturalEarth',
    center: { longitude: 30, latitude: 35 },
    scale: 900,
    rotate: [-30, 0, 0],
  },
  'classical': {
    type: 'naturalEarth',
    center: { longitude: 25, latitude: 38 },
    scale: 800,
    rotate: [-25, 0, 0],
  },
  'hellenistic-roman': {
    type: 'naturalEarth',
    center: { longitude: 40, latitude: 35 },
    scale: 500,
    rotate: [-40, 0, 0],
  },
  'revolutionary': {
    type: 'naturalEarth',
    center: { longitude: 0, latitude: 20 },
    scale: 180,
    rotate: [0, 0, 0],
  },
};

// Epoch-specific map bounds
export const EPOCH_BOUNDS: Record<EpochId, GeoBounds> = {
  'bronze-age': {
    minLon: -10,
    maxLon: 60,
    minLat: 20,
    maxLat: 50,
  },
  'classical': {
    minLon: -15,
    maxLon: 75,
    minLat: 15,
    maxLat: 55,
  },
  'hellenistic-roman': {
    minLon: -20,
    maxLon: 120,
    minLat: 10,
    maxLat: 60,
  },
  'revolutionary': {
    minLon: -180,
    maxLon: 180,
    minLat: -60,
    maxLat: 75,
  },
};

/**
 * Creates a D3 geo projection based on the epoch configuration
 */
export function createProjection(
  epochId: EpochId,
  width: number,
  height: number
): d3Geo.GeoProjection {
  const config = EPOCH_PROJECTIONS[epochId];

  let projection: d3Geo.GeoProjection;

  switch (config.type) {
    case 'albers':
      projection = d3Geo.geoAlbers();
      break;
    case 'mercator':
      projection = d3Geo.geoMercator();
      break;
    case 'equirectangular':
      projection = d3Geo.geoEquirectangular();
      break;
    case 'naturalEarth':
    default:
      projection = d3Geo.geoNaturalEarth1();
      break;
  }

  // Apply configuration
  projection
    .center([config.center.longitude, config.center.latitude])
    .scale(config.scale)
    .translate([width / 2, height / 2]);

  if (config.rotate) {
    projection.rotate(config.rotate);
  }

  return projection;
}

/**
 * Creates a D3 geo path generator for the given projection
 */
export function createPathGenerator(projection: d3Geo.GeoProjection): d3Geo.GeoPath {
  return d3Geo.geoPath().projection(projection);
}

/**
 * Projects geographic coordinates to SVG coordinates
 */
export function projectCoordinates(
  projection: d3Geo.GeoProjection,
  longitude: number,
  latitude: number
): [number, number] | null {
  return projection([longitude, latitude]);
}

/**
 * Calculates the optimal scale and translation for a given bounds
 */
export function fitBounds(
  projection: d3Geo.GeoProjection,
  bounds: GeoBounds,
  width: number,
  height: number,
  padding: number = 20
): d3Geo.GeoProjection {
  const feature: GeoJSON.Feature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [bounds.minLon, bounds.minLat],
        [bounds.maxLon, bounds.minLat],
        [bounds.maxLon, bounds.maxLat],
        [bounds.minLon, bounds.maxLat],
        [bounds.minLon, bounds.minLat],
      ]],
    },
  };

  projection.fitExtent(
    [[padding, padding], [width - padding, height - padding]],
    feature
  );

  return projection;
}

/**
 * Gets the graticule (grid lines) for the map
 */
export function createGraticule(): d3Geo.GeoGraticuleGenerator {
  return d3Geo.geoGraticule()
    .step([15, 15])
    .extent([[-180, -90], [180, 90]]);
}

/**
 * Calculates centroid of a GeoJSON feature
 */
export function getFeatureCentroid(
  feature: GeoJSON.Feature,
  projection: d3Geo.GeoProjection
): [number, number] | null {
  const path = d3Geo.geoPath().projection(projection);
  const centroid = path.centroid(feature);

  if (isNaN(centroid[0]) || isNaN(centroid[1])) {
    return null;
  }

  return centroid;
}

/**
 * Checks if a point is within the map bounds
 */
export function isPointInBounds(
  longitude: number,
  latitude: number,
  bounds: GeoBounds
): boolean {
  return (
    longitude >= bounds.minLon &&
    longitude <= bounds.maxLon &&
    latitude >= bounds.minLat &&
    latitude <= bounds.maxLat
  );
}
