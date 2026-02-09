#!/usr/bin/env python3
"""
Clip GeoJSON territory polygons to Natural Earth land boundaries.
This ensures no territory extends into ocean/sea — coastlines follow real geography.
"""

import json
import os
import shapefile  # pyshp
from shapely.geometry import shape, mapping, MultiPolygon, Polygon
from shapely.ops import unary_union
from shapely.validation import make_valid

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
GEO_DIR = os.path.join(PROJECT_DIR, "public", "geo")
LAND_SHP = "/tmp/ne_50m_land/ne_50m_land.shp"

# Epoch GeoJSON files to process
EPOCH_FILES = [
    "bronze-age.json",
    "classical.json",
    "hellenistic-roman.json",
    "revolutionary.json",
]


def load_land_polygon():
    """Load Natural Earth land polygons and union them into one MultiPolygon."""
    print("Loading Natural Earth land polygons...")
    sf = shapefile.Reader(LAND_SHP)
    land_parts = []
    for sr in sf.shapeRecords():
        geom = shape(sr.shape.__geo_interface__)
        geom = make_valid(geom)
        if geom.is_valid and not geom.is_empty:
            land_parts.append(geom)

    print(f"  Loaded {len(land_parts)} land features, merging...")
    land = unary_union(land_parts)
    land = make_valid(land)
    print(f"  Land polygon ready: {land.geom_type}")
    return land


def buffer_polygon(geom, amount=0.3):
    """
    Buffer the territory polygon outward slightly to ensure it fully covers
    coastal areas. This prevents thin slivers of coast from being missed
    when the original polygon edge runs close to (but slightly inland of)
    the actual coastline.
    """
    buffered = geom.buffer(amount, resolution=4)
    return make_valid(buffered)


def simplify_result(geom, tolerance=0.02):
    """Simplify the clipped geometry to reduce point count while preserving shape."""
    simplified = geom.simplify(tolerance, preserve_topology=True)
    return make_valid(simplified)


def count_points(geom):
    """Count total coordinate points in a geometry."""
    if geom.geom_type == 'Polygon':
        return sum(len(ring.coords) for ring in [geom.exterior] + list(geom.interiors))
    elif geom.geom_type == 'MultiPolygon':
        total = 0
        for poly in geom.geoms:
            total += sum(len(ring.coords) for ring in [poly.exterior] + list(poly.interiors))
        return total
    return 0


def clip_feature(feature, land):
    """Clip a single GeoJSON feature to land boundaries."""
    props = feature["properties"]
    name = props.get("name", "unknown")

    geom = shape(feature["geometry"])
    geom = make_valid(geom)

    if geom.is_empty:
        print(f"    WARNING: {name} has empty geometry, skipping")
        return feature

    # Minimal buffer - just enough to avoid thin-strip issues at coastlines.
    # Large buffers (0.4°) round off inland borders, destroying irregularity.
    buffered = buffer_polygon(geom, amount=0.02)

    # Intersect with land
    try:
        clipped = buffered.intersection(land)
    except Exception as e:
        print(f"    WARNING: Intersection failed for {name}: {e}")
        try:
            clipped = geom.intersection(land)
        except Exception as e2:
            print(f"    ERROR: Second attempt also failed for {name}: {e2}")
            return feature

    if clipped.is_empty:
        print(f"    WARNING: {name} clipped to nothing! Keeping original.")
        return feature

    clipped = make_valid(clipped)

    # Simplify to keep file sizes reasonable
    clipped = simplify_result(clipped, tolerance=0.015)

    # Remove tiny polygon fragments (< 0.01 sq degrees, roughly < 100 sq km)
    if clipped.geom_type == 'MultiPolygon':
        significant = [p for p in clipped.geoms if p.area > 0.005]
        if significant:
            clipped = MultiPolygon(significant) if len(significant) > 1 else significant[0]
    elif clipped.geom_type == 'GeometryCollection':
        polys = [g for g in clipped.geoms if g.geom_type in ('Polygon', 'MultiPolygon') and g.area > 0.005]
        if polys:
            clipped = unary_union(polys)
        else:
            print(f"    WARNING: {name} resulted in empty collection, keeping original.")
            return feature

    # Ensure result is Polygon or MultiPolygon
    if clipped.geom_type not in ('Polygon', 'MultiPolygon'):
        print(f"    WARNING: {name} resulted in {clipped.geom_type}, extracting polygons")
        if hasattr(clipped, 'geoms'):
            polys = [g for g in clipped.geoms if g.geom_type in ('Polygon', 'MultiPolygon')]
            if polys:
                clipped = unary_union(polys)
            else:
                return feature
        else:
            return feature

    pts_before = count_points(geom)
    pts_after = count_points(clipped)
    print(f"    {name}: {geom.geom_type} ({pts_before} pts) -> {clipped.geom_type} ({pts_after} pts)")

    # Build new feature
    new_feature = {
        "type": "Feature",
        "properties": props,
        "geometry": mapping(clipped),
    }

    # Round coordinates to 2 decimal places to keep file size down
    new_feature["geometry"] = round_coords(new_feature["geometry"])

    return new_feature


def round_coords(geom_dict, decimals=2):
    """Round all coordinates in a GeoJSON geometry to N decimal places."""
    def round_ring(ring):
        return [[round(c, decimals) for c in pt] for pt in ring]

    gtype = geom_dict["type"]
    coords = geom_dict["coordinates"]

    if gtype == "Polygon":
        geom_dict["coordinates"] = [round_ring(ring) for ring in coords]
    elif gtype == "MultiPolygon":
        geom_dict["coordinates"] = [[round_ring(ring) for ring in poly] for poly in coords]

    return geom_dict


def process_epoch_file(filepath, land):
    """Process one epoch GeoJSON file."""
    filename = os.path.basename(filepath)
    print(f"\nProcessing {filename}...")

    with open(filepath, 'r') as f:
        data = json.load(f)

    new_features = []
    for feature in data["features"]:
        clipped = clip_feature(feature, land)
        new_features.append(clipped)

    data["features"] = new_features

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

    # Report file size
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Saved {filename} ({size_kb:.1f} KB)")


def main():
    land = load_land_polygon()

    for filename in EPOCH_FILES:
        filepath = os.path.join(GEO_DIR, filename)
        if os.path.exists(filepath):
            process_epoch_file(filepath, land)
        else:
            print(f"  WARNING: {filepath} not found, skipping")

    print("\nDone! All territories clipped to coastlines.")


if __name__ == "__main__":
    main()
