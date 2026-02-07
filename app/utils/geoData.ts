import { EpochId, EmpireId, TerrainFeature, TerrainType, GeoFeatureCollection } from '@/types';

// Cache for loaded GeoJSON data
const geoDataCache: Map<string, GeoFeatureCollection> = new Map();
const terrainCache: Map<string, TerrainData> = new Map();
const baseGeoCache: Map<string, GeoFeatureCollection> = new Map();

/**
 * Base geography data structure (Natural Earth data)
 */
export interface BaseGeography {
  land: GeoFeatureCollection | null;
  coastlines: GeoFeatureCollection | null;
  rivers: GeoFeatureCollection | null;
  lakes: GeoFeatureCollection | null;
  ocean: GeoFeatureCollection | null;
}

export interface TerrainData {
  mountains: TerrainFeature[];
  forests: TerrainFeature[];
  deserts: TerrainFeature[];
  cities: TerrainFeature[];
  rivers: RiverFeature[];
}

export interface RiverFeature {
  id: string;
  name: string;
  path: [number, number][];
}

/**
 * Loads GeoJSON data for a specific epoch
 */
export async function loadEpochGeoData(epochId: EpochId): Promise<GeoFeatureCollection> {
  const cacheKey = epochId;

  if (geoDataCache.has(cacheKey)) {
    return geoDataCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(`/geo/${epochId}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load geo data: ${response.statusText}`);
    }

    const data = await response.json();
    geoDataCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error loading geo data for ${epochId}:`, error);
    throw error;
  }
}

/**
 * Loads terrain features for a specific epoch
 */
export async function loadTerrainFeatures(epochId: EpochId): Promise<TerrainData> {
  const cacheKey = epochId;

  if (terrainCache.has(cacheKey)) {
    return terrainCache.get(cacheKey)!;
  }

  try {
    const response = await fetch('/geo/terrain-features.json');
    if (!response.ok) {
      throw new Error(`Failed to load terrain data: ${response.statusText}`);
    }

    const data = await response.json();
    const epochData = data[epochId];

    const terrainData: TerrainData = {
      mountains: epochData.mountains.map((m: any) => ({
        id: m.id,
        type: 'mountain' as TerrainType,
        position: { longitude: m.position[0], latitude: m.position[1] },
        name: m.name,
        scale: m.scale || 1,
      })),
      forests: epochData.forests.map((f: any) => ({
        id: f.id,
        type: 'forest' as TerrainType,
        position: { longitude: f.position[0], latitude: f.position[1] },
        name: f.name,
        scale: f.scale || 1,
      })),
      deserts: epochData.deserts.map((d: any) => ({
        id: d.id,
        type: 'desert' as TerrainType,
        position: { longitude: d.position[0], latitude: d.position[1] },
        name: d.name,
        scale: d.scale || 1,
      })),
      cities: epochData.cities.map((c: any) => ({
        id: c.id,
        type: c.type === 'capital' ? 'capital' as TerrainType : 'city' as TerrainType,
        position: { longitude: c.position[0], latitude: c.position[1] },
        name: c.name,
        scale: 1,
      })),
      rivers: epochData.rivers,
    };

    terrainCache.set(cacheKey, terrainData);
    return terrainData;
  } catch (error) {
    console.error(`Error loading terrain data for ${epochId}:`, error);
    throw error;
  }
}

/**
 * Extracts empire features from GeoJSON data
 */
export function getEmpireFeatures(
  geoData: GeoFeatureCollection,
  empireId?: EmpireId
): GeoJSON.Feature[] {
  const features = geoData.features || [];

  return features.filter((feature) => {
    const props = feature.properties;
    if (props?.type !== 'empire') return false;
    if (empireId && props?.id !== empireId) return false;
    return true;
  });
}

/**
 * Extracts landmass features from GeoJSON data
 */
export function getLandmassFeatures(geoData: GeoFeatureCollection): GeoJSON.Feature[] {
  const features = geoData.features || [];
  return features.filter((feature) => feature.properties?.type === 'landmass');
}

/**
 * Extracts water features from GeoJSON data
 */
export function getWaterFeatures(geoData: GeoFeatureCollection): GeoJSON.Feature[] {
  const features = geoData.features || [];
  return features.filter((feature) => feature.properties?.type === 'water');
}

/**
 * Gets the label position for an empire from GeoJSON properties
 */
export function getEmpireLabelPosition(
  geoData: GeoFeatureCollection,
  empireId: EmpireId
): [number, number] | null {
  const features = geoData.features || [];
  const empireFeature = features.find(
    (f) => f.properties?.type === 'empire' && f.properties?.id === empireId
  );

  if (!empireFeature?.properties?.labelPosition) {
    return null;
  }

  const pos = empireFeature.properties.labelPosition;
  return [pos[0], pos[1]];
}

/**
 * Gets the color for an empire from GeoJSON properties
 */
export function getEmpireColor(
  geoData: GeoFeatureCollection,
  empireId: EmpireId
): string | null {
  const features = geoData.features || [];
  const empireFeature = features.find(
    (f) => f.properties?.type === 'empire' && f.properties?.id === empireId
  );

  return empireFeature?.properties?.color || null;
}

/**
 * Clears all cached data (useful for testing or memory management)
 */
export function clearGeoCache(): void {
  geoDataCache.clear();
  terrainCache.clear();
  baseGeoCache.clear();
}

/**
 * Loads a single base geography file with caching
 */
async function loadBaseGeoFile(filename: string): Promise<GeoFeatureCollection | null> {
  const cacheKey = `base-${filename}`;

  if (baseGeoCache.has(cacheKey)) {
    return baseGeoCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(`/geo/base/${filename}`);
    if (!response.ok) {
      console.warn(`Base geography file not found: ${filename}`);
      return null;
    }
    const data = await response.json();
    baseGeoCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.warn(`Error loading base geography ${filename}:`, error);
    return null;
  }
}

/**
 * Loads base geography data (Natural Earth coastlines, land, rivers, lakes)
 * Uses 50m scale by default for reasonable file sizes
 */
export async function loadBaseGeography(scale: '10m' | '50m' = '50m'): Promise<BaseGeography> {
  const [land, coastlines, rivers, lakes, ocean] = await Promise.all([
    loadBaseGeoFile(`land-${scale}.json`),
    loadBaseGeoFile(`coastlines-${scale}.json`),
    loadBaseGeoFile(`rivers-${scale}.json`),
    loadBaseGeoFile(`lakes-${scale}.json`),
    loadBaseGeoFile(`ocean-${scale}.json`),
  ]);

  return { land, coastlines, rivers, lakes, ocean };
}

/**
 * Extracts non-interactive region features (neighboring states, tribal territories, etc.)
 * These are rendered with border-only styling and are not clickable
 */
export function getNonInteractiveFeatures(geoData: GeoFeatureCollection): GeoJSON.Feature[] {
  const features = geoData.features || [];
  return features.filter((feature) => {
    const props = feature.properties;
    // Non-interactive features have interactive: false
    return props?.interactive === false;
  });
}

/**
 * Extracts interactive empire features (the main clickable empires)
 */
export function getInteractiveEmpireFeatures(geoData: GeoFeatureCollection): GeoJSON.Feature[] {
  const features = geoData.features || [];
  return features.filter((feature) => {
    const props = feature.properties;
    // Interactive empires have type: 'empire' and either no interactive prop or interactive: true
    return props?.type === 'empire' && props?.interactive !== false;
  });
}

/**
 * Gets all political features (both interactive and non-interactive)
 */
export function getAllPoliticalFeatures(geoData: GeoFeatureCollection): GeoJSON.Feature[] {
  const features = geoData.features || [];
  return features.filter((feature) => {
    const props = feature.properties;
    return props?.type === 'empire' || props?.type === 'region' || props?.type === 'territory';
  });
}
