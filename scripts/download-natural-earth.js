#!/usr/bin/env node

/**
 * Download Natural Earth GeoJSON data for base geography
 *
 * Sources:
 * - https://github.com/martynafford/natural-earth-geojson (1:10m and 1:50m scale)
 * - https://www.naturalearthdata.com/
 *
 * This script downloads coastlines, land polygons, rivers, and lakes
 * for use as base geography in the historical maps.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master';
const OUTPUT_DIR = path.join(__dirname, '../public/geo/base');

// Files to download (using 1:50m for reasonable file sizes, 1:10m available for more detail)
const FILES = [
  {
    name: 'coastlines-50m.json',
    url: `${BASE_URL}/50m/physical/ne_50m_coastline.json`,
    description: 'World coastlines at 1:50m scale'
  },
  {
    name: 'land-50m.json',
    url: `${BASE_URL}/50m/physical/ne_50m_land.json`,
    description: 'Land polygons at 1:50m scale'
  },
  {
    name: 'lakes-50m.json',
    url: `${BASE_URL}/50m/physical/ne_50m_lakes.json`,
    description: 'Major lakes at 1:50m scale'
  },
  {
    name: 'rivers-50m.json',
    url: `${BASE_URL}/50m/physical/ne_50m_rivers_lake_centerlines.json`,
    description: 'Major rivers at 1:50m scale'
  },
  {
    name: 'ocean-50m.json',
    url: `${BASE_URL}/50m/physical/ne_50m_ocean.json`,
    description: 'Ocean polygons at 1:50m scale'
  }
];

// Higher detail versions (larger files)
const FILES_10M = [
  {
    name: 'coastlines-10m.json',
    url: `${BASE_URL}/10m/physical/ne_10m_coastline.json`,
    description: 'World coastlines at 1:10m scale (high detail)'
  },
  {
    name: 'land-10m.json',
    url: `${BASE_URL}/10m/physical/ne_10m_land.json`,
    description: 'Land polygons at 1:10m scale (high detail)'
  }
];

function downloadFile(fileInfo) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(OUTPUT_DIR, fileInfo.name);

    console.log(`Downloading ${fileInfo.name}...`);
    console.log(`  Source: ${fileInfo.url}`);

    const file = fs.createWriteStream(outputPath);

    https.get(fileInfo.url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            const stats = fs.statSync(outputPath);
            console.log(`  Saved: ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
            resolve();
          });
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(outputPath);
          console.log(`  Saved: ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
          resolve();
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

async function main() {
  console.log('Natural Earth GeoJSON Downloader');
  console.log('================================\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created directory: ${OUTPUT_DIR}\n`);
  }

  const args = process.argv.slice(2);
  const downloadHighRes = args.includes('--high-res') || args.includes('-h');

  const filesToDownload = downloadHighRes ? [...FILES, ...FILES_10M] : FILES;

  console.log(`Downloading ${filesToDownload.length} files...\n`);

  for (const fileInfo of filesToDownload) {
    try {
      await downloadFile(fileInfo);
    } catch (err) {
      console.error(`  Error downloading ${fileInfo.name}: ${err.message}`);
    }
  }

  console.log('\nDone!');
  console.log('\nUsage in the app:');
  console.log('  import { loadBaseGeography } from "@/app/utils/geoData"');
  console.log('  const baseGeo = await loadBaseGeography();');
}

main().catch(console.error);
