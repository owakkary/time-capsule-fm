#!/usr/bin/env python3
"""
Generate historically-accurate empire territory GeoJSON with realistic borders.
Inland borders follow geographic features and have natural irregularity.
Coastal borders extend into water and will be clipped by clip_to_coastline.py.
"""

import json
import math
import os
import random

random.seed(42)

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEO_DIR = os.path.join(PROJECT_DIR, "public", "geo")


def perturb_edges(waypoints, amplitude=0.2, density=2.5):
    """
    Between each pair of waypoints, insert intermediate points with
    random lateral perturbation. This creates natural-looking irregular borders.

    amplitude: max lateral offset in degrees (~0.2° = ~22km)
    density: intermediate points per degree of edge length
    """
    result = []
    for i in range(len(waypoints) - 1):
        p1 = waypoints[i]
        p2 = waypoints[i + 1]
        dx = p2[0] - p1[0]
        dy = p2[1] - p1[1]
        length = math.sqrt(dx * dx + dy * dy)

        result.append([round(p1[0], 2), round(p1[1], 2)])

        if length < 0.3:
            continue

        # Normal vector (perpendicular to edge)
        nx, ny = -dy / length, dx / length

        n_pts = max(1, int(length * density))
        for j in range(1, n_pts + 1):
            t = j / (n_pts + 1)
            x = p1[0] + dx * t
            y = p1[1] + dy * t
            # Gaussian perturbation perpendicular to edge
            offset = random.gauss(0, amplitude * 0.5)
            x += nx * offset
            y += ny * offset
            result.append([round(x, 2), round(y, 2)])

    result.append([round(waypoints[-1][0], 2), round(waypoints[-1][1], 2)])
    return result


def feat(props, polygon_groups, amplitude=0.2):
    """Create a GeoJSON Feature. polygon_groups is a list of waypoint lists."""
    polys = []
    for wp in polygon_groups:
        coords = perturb_edges(wp, amplitude)
        polys.append([coords])

    if len(polys) == 1:
        return {
            "type": "Feature",
            "properties": props,
            "geometry": {"type": "Polygon", "coordinates": polys[0]},
        }
    else:
        return {
            "type": "Feature",
            "properties": props,
            "geometry": {"type": "MultiPolygon", "coordinates": polys},
        }


# ==============================================================
# BRONZE AGE (~1400 BCE)
# ==============================================================

def bronze_age():
    features = []

    # --- Ancient Egypt: Nile Valley + Delta (narrow strip) ---
    nile = [
        [30.5, 22.0], [30.3, 22.8], [30.2, 23.5], [30.0, 24.2],
        [30.1, 25.0], [30.2, 25.8], [30.3, 26.5], [30.2, 27.2],
        [30.0, 28.0], [29.8, 28.8], [29.5, 29.5], [29.2, 30.2],
        # NW Delta - extend into Med
        [28.8, 31.0], [28.5, 32.5], [30.0, 33.0], [31.5, 33.0], [32.8, 32.5],
        # NE Delta heading south
        [32.5, 31.2], [32.4, 30.5], [32.6, 29.8], [32.8, 29.0],
        [32.9, 28.2], [33.0, 27.5], [33.0, 26.8], [32.9, 26.0],
        [32.8, 25.2], [32.7, 24.5], [32.5, 23.8], [32.3, 23.0],
        [32.0, 22.3],
        # Southern border
        [31.5, 22.0], [31.0, 22.0], [30.5, 22.0],
    ]
    # Sinai + Levant (oversized, clipping handles coasts)
    sinai = [
        # Inland Levantine border going south
        [36.8, 35.0], [36.5, 34.5], [36.2, 34.0], [36.0, 33.5],
        [35.8, 33.0], [35.5, 32.5], [35.2, 32.0], [35.0, 31.5],
        [34.8, 31.0], [34.5, 30.5],
        # Into Gulf of Aqaba (water)
        [35.5, 29.0], [35.0, 28.0], [34.5, 27.0],
        # Sinai tip (water)
        [33.5, 26.5], [32.5, 27.0],
        # Gulf of Suez (water, going north)
        [32.0, 28.0], [31.8, 29.0], [32.0, 30.5],
        # North into Med (water)
        [32.0, 31.5], [32.0, 32.5], [33.0, 33.5],
        [34.5, 34.0], [36.0, 35.0], [36.8, 35.5],
        [36.8, 35.0],
    ]
    features.append(feat(
        {"id": "ancient-egypt", "name": "Ancient Egypt", "type": "empire",
         "interactive": True, "color": "#D4A574", "labelPosition": [31, 27]},
        [nile, sinai], amplitude=0.18
    ))

    # --- Mesopotamia: Tigris-Euphrates valley (elongated NW-SE) ---
    mesop = [
        # NW (upper Euphrates, desert edge)
        [39.0, 37.0], [39.5, 36.5], [39.8, 36.0],
        # Western border (Syrian desert edge, going SE)
        [40.2, 35.5], [40.5, 35.0], [40.8, 34.5],
        [41.2, 34.0], [41.5, 33.5], [42.0, 33.0],
        [42.5, 32.5], [43.0, 32.0], [43.5, 31.5],
        [44.0, 31.0], [44.5, 30.5],
        # Persian Gulf coast (extend into water)
        [45.0, 30.0], [46.0, 29.5], [47.0, 29.0],
        [48.0, 28.5], [49.0, 29.0], [49.5, 30.0],
        # Eastern border (Zagros foothills, very irregular, going NW)
        [49.0, 30.5], [48.5, 31.0], [48.0, 31.5],
        [47.5, 32.0], [47.0, 32.5], [46.5, 33.0],
        [46.0, 33.5], [45.5, 34.0], [45.0, 34.5],
        [44.5, 35.0], [44.0, 35.5], [43.5, 36.0],
        # Northern border (going west)
        [43.0, 36.5], [42.5, 36.8], [42.0, 37.0],
        [41.0, 37.2], [40.0, 37.2],
        [39.0, 37.0],
    ]
    features.append(feat(
        {"id": "mesopotamia", "name": "Mesopotamia", "type": "empire",
         "interactive": True, "color": "#8B7355", "labelPosition": [44, 33]},
        [mesop], amplitude=0.25
    ))

    # --- Hittite Empire: Anatolian plateau (rectangular, NOT round) ---
    hittite = [
        # NW corner (Black Sea coast, in water)
        [29.5, 42.5],
        # North border (in Black Sea, going east)
        [31.0, 43.0], [33.0, 43.0], [35.0, 42.5], [37.0, 42.0],
        # NE corner
        [38.0, 41.5],
        # Eastern border (upper Euphrates region, going south)
        [38.5, 41.0], [38.8, 40.5], [39.0, 40.0],
        [38.8, 39.5], [38.5, 39.0], [38.0, 38.5],
        [37.5, 38.0], [37.2, 37.5],
        # SE corner (Taurus-Euphrates junction)
        [37.0, 37.0],
        # Southern border (Taurus Mountains, jagged, going west)
        [36.2, 37.2], [35.5, 36.8], [34.8, 37.0],
        [34.0, 37.2], [33.2, 36.8], [32.5, 37.0],
        [31.8, 37.3], [31.0, 37.0], [30.5, 37.3],
        # SW corner
        [30.0, 37.5],
        # Western border (going north)
        [29.5, 38.0], [29.2, 38.5], [29.0, 39.2],
        [29.2, 39.8], [29.3, 40.5], [29.5, 41.0],
        [29.5, 41.5], [29.5, 42.0],
        [29.5, 42.5],
    ]
    features.append(feat(
        {"id": "hittite-empire", "name": "Hittite Empire", "type": "empire",
         "interactive": True, "color": "#A0522D", "labelPosition": [34, 39.5]},
        [hittite], amplitude=0.25
    ))

    # --- Mycenaean Greece: oversized for clipping ---
    mainland = [
        [19.5, 40.5], [20.5, 40.5], [21.5, 40.5], [22.5, 40.0],
        [23.5, 40.0], [24.5, 39.0], [24.0, 38.0], [23.5, 37.0],
        [23.0, 36.5], [22.0, 36.0], [21.5, 36.0], [21.0, 36.5],
        [20.5, 37.0], [20.0, 37.5], [19.5, 38.0], [19.5, 39.0],
        [19.5, 40.5],
    ]
    euboea = [
        [23.0, 39.5], [24.5, 39.0], [24.5, 38.0], [24.0, 37.5],
        [23.0, 38.0], [23.0, 39.5],
    ]
    features.append(feat(
        {"id": "mycenaean-greece", "name": "Mycenaean Greece", "type": "empire",
         "interactive": True, "color": "#6B5B73", "labelPosition": [22.5, 37.8]},
        [mainland, euboea], amplitude=0.1
    ))

    # --- Minoan Crete: oversized for clipping ---
    crete = [
        [23.3, 36.0], [24.0, 36.0], [25.0, 35.8], [26.0, 35.5],
        [26.5, 35.2], [26.5, 34.6], [25.5, 34.5], [24.5, 34.5],
        [23.5, 34.8], [23.2, 35.2], [23.3, 36.0],
    ]
    santorini = [
        [25.2, 36.6], [25.6, 36.6], [25.6, 36.2], [25.2, 36.2], [25.2, 36.6],
    ]
    naxos = [
        [25.2, 37.2], [25.6, 37.2], [25.6, 36.9], [25.2, 36.9], [25.2, 37.2],
    ]
    milos = [
        [24.2, 36.9], [24.6, 36.9], [24.6, 36.6], [24.2, 36.6], [24.2, 36.9],
    ]
    features.append(feat(
        {"id": "minoan-crete", "name": "Minoan Crete", "type": "empire",
         "interactive": True, "color": "#4A90A4", "labelPosition": [24.9, 35.3]},
        [crete, santorini, naxos, milos], amplitude=0.08
    ))

    return {
        "type": "FeatureCollection", "name": "bronze-age",
        "epoch": "bronze-age", "snapshotYear": -1400,
        "centerCoordinates": [30, 35], "defaultScale": 900,
        "features": features,
    }


# ==============================================================
# CLASSICAL (~450 BCE)
# ==============================================================

def classical():
    features = []

    # Greece: oversized for clipping (mainland + islands)
    mainland = [
        [19.5, 41.5], [21.0, 41.5], [22.5, 41.0], [23.5, 40.5],
        [24.5, 39.5], [24.5, 38.5], [24.0, 37.5], [23.0, 36.5],
        [22.0, 36.0], [21.0, 36.0], [20.0, 36.5], [19.5, 37.5],
        [19.5, 38.5], [19.5, 39.5], [19.5, 41.5],
    ]
    crete = [
        [23.2, 36.0], [26.5, 35.5], [26.5, 34.5], [23.2, 34.8], [23.2, 36.0],
    ]
    euboea_lesbos = [
        [23.0, 39.5], [27.5, 39.5], [27.5, 36.5], [25.5, 36.0],
        [24.5, 37.5], [23.0, 38.0], [23.0, 39.5],
    ]
    features.append(feat(
        {"id": "classical-greece", "name": "Classical Greece", "type": "empire",
         "interactive": True, "color": "#7BA3C9", "labelPosition": [24, 38]},
        [mainland, crete, euboea_lesbos], amplitude=0.1
    ))

    # Persian Empire: huge, key inland borders on north
    persia = [
        # Western Anatolia coast (extend into Med for clipping)
        [26.0, 42.0], [27.0, 42.0], [28.0, 41.5],
        # Northern Anatolia (inland border)
        [30.0, 41.5], [32.0, 41.0], [34.0, 40.5],
        [36.0, 40.0], [38.0, 39.5],
        # Northern border across Caucasus/Central Asia
        [40.0, 40.0], [42.0, 41.0], [44.0, 41.5],
        [46.0, 42.0], [48.0, 41.5], [50.0, 40.5],
        [52.0, 40.0], [54.0, 39.0], [56.0, 38.0],
        [58.0, 37.5], [60.0, 38.0], [62.0, 37.5],
        [64.0, 37.0], [66.0, 36.0], [68.0, 35.0],
        # Eastern border (Indus area, going south)
        [70.0, 34.0], [71.0, 32.0], [71.5, 30.0],
        [71.0, 28.5], [70.0, 27.0], [69.0, 25.5],
        # Arabian Sea coast (extend into water)
        [68.0, 24.5], [66.0, 25.0], [64.0, 25.5],
        [62.0, 25.8], [60.0, 25.0],
        # Makran coast (in water)
        [58.0, 24.5], [56.5, 26.0],
        # Persian Gulf south coast (in water)
        [55.0, 26.5], [53.0, 26.0], [51.0, 26.5],
        [49.5, 27.5], [48.5, 29.0],
        # Gulf head (in water)
        [48.0, 30.5], [47.0, 29.5],
        # Arabian coast of Gulf (in water)
        [45.0, 29.0], [43.0, 29.5],
        # Through Levant coast (in water for clipping)
        [41.0, 30.0], [39.0, 31.0], [37.0, 32.0],
        [35.5, 31.0], [34.5, 30.5],
        # Med Levantine coast (in water)
        [34.0, 31.5], [33.0, 32.0], [31.0, 32.5],
        [29.0, 32.0], [28.0, 33.0],
        # Anatolian south coast (in water)
        [27.0, 36.5], [26.0, 38.0],
        # West Anatolia coast (in water)
        [26.0, 40.0], [26.0, 42.0],
    ]
    features.append(feat(
        {"id": "persian-empire", "name": "Persian Empire", "type": "empire",
         "interactive": True, "color": "#8B4513", "labelPosition": [52, 33]},
        [persia], amplitude=0.3
    ))

    # Phoenicia: narrow coastal strip
    phoenicia = [
        [35.0, 35.0], [36.0, 34.8], [36.2, 34.5],
        [36.0, 34.0], [35.8, 33.5], [35.5, 33.0],
        [35.3, 32.8], [35.0, 32.8],
        [34.8, 33.0], [34.8, 33.5], [35.0, 34.0],
        [35.0, 34.5], [35.0, 35.0],
    ]
    features.append(feat(
        {"id": "phoenicia", "name": "Phoenicia", "type": "empire",
         "interactive": True, "color": "#800080", "labelPosition": [35.7, 34.2]},
        [phoenicia], amplitude=0.08
    ))

    # Carthage: North Africa coast + islands (oversized for clipping)
    tunisia = [
        [5.0, 38.0], [7.0, 38.0], [9.0, 37.5], [10.5, 37.0],
        [11.0, 36.5], [11.5, 35.5], [11.0, 34.5], [10.0, 34.0],
        [9.0, 33.5], [8.0, 33.5], [7.0, 34.0], [6.0, 34.5],
        [5.0, 35.0], [4.5, 35.5], [4.5, 36.5], [5.0, 38.0],
    ]
    w_sicily = [
        [12.0, 39.0], [14.0, 38.5], [14.0, 37.0], [12.0, 37.0], [12.0, 39.0],
    ]
    sardinia = [
        [8.0, 41.5], [10.0, 41.5], [10.0, 38.5], [8.0, 38.5], [8.0, 41.5],
    ]
    balearics = [
        [1.0, 40.5], [4.5, 40.5], [4.5, 38.5], [1.0, 38.5], [1.0, 40.5],
    ]
    features.append(feat(
        {"id": "carthage", "name": "Carthage", "type": "empire",
         "interactive": True, "color": "#B22222", "labelPosition": [10, 36]},
        [tunisia, w_sicily, sardinia, balearics], amplitude=0.15
    ))

    # Roman Republic: Italy (oversized for clipping)
    italy = [
        [6.5, 47.0], [8.0, 46.5], [10.0, 46.5], [12.0, 46.0],
        [13.5, 46.0], [14.0, 45.0], [15.0, 43.0], [16.0, 41.5],
        [17.5, 40.0], [18.5, 39.5], [17.0, 38.5], [16.0, 37.5],
        [15.0, 37.0], [14.0, 37.5], [13.0, 38.0], [12.0, 39.0],
        [10.0, 40.0], [8.5, 41.0], [7.5, 42.0], [7.0, 43.5],
        [6.5, 44.5], [6.5, 47.0],
    ]
    e_sicily = [
        [14.5, 38.5], [16.0, 38.0], [16.0, 36.5], [14.5, 37.0], [14.5, 38.5],
    ]
    corsica = [
        [8.5, 43.5], [9.8, 43.5], [9.8, 41.2], [8.5, 41.2], [8.5, 43.5],
    ]
    features.append(feat(
        {"id": "roman-republic", "name": "Roman Republic", "type": "empire",
         "interactive": True, "color": "#8B0000", "labelPosition": [12.5, 42]},
        [italy, e_sicily, corsica], amplitude=0.1
    ))

    return {
        "type": "FeatureCollection", "name": "classical", "epoch": "classical",
        "features": features,
    }


# ==============================================================
# HELLENISTIC-ROMAN (~100 BCE)
# ==============================================================

def hellenistic_roman():
    features = []

    # Macedonian Empire (Seleucid remnant ~100 BCE)
    seleucid = [
        # Med coast (in water for clipping)
        [35.0, 38.0], [36.0, 38.0], [37.0, 37.5],
        # Northern border (inland, going east)
        [38.0, 37.5], [39.0, 37.8], [40.0, 38.0],
        [41.0, 37.5], [42.0, 37.2],
        # Eastern border (going south)
        [43.0, 37.0], [44.0, 36.5], [45.0, 36.0],
        [46.0, 35.5], [47.0, 35.0], [48.0, 34.5],
        [49.0, 34.0], [50.0, 33.5],
        # Southern border (going west)
        [50.0, 33.0], [49.0, 33.0], [48.0, 33.2],
        [47.0, 33.5], [46.0, 33.8], [45.0, 33.5],
        [44.0, 33.0], [43.0, 33.0], [42.0, 33.5],
        [41.0, 34.0], [40.0, 34.5],
        # Through Levant coast (in water)
        [39.0, 35.0], [38.0, 35.5], [37.0, 36.0],
        [36.0, 36.5], [35.0, 37.0], [35.0, 38.0],
    ]
    features.append(feat(
        {"id": "macedonian-empire", "name": "Macedonian Empire", "type": "empire",
         "interactive": True, "color": "#DAA520", "labelPosition": [42, 36]},
        [seleucid], amplitude=0.22
    ))

    # Roman Empire (~100 BCE): oversized coastal for clipping
    # Continental Europe + Med coast
    continental = [
        # Iberia west coast (in water)
        [-10.0, 37.0], [-10.0, 40.0], [-10.0, 44.0],
        # Gaul
        [-5.0, 44.0], [-2.0, 44.0], [0.0, 43.0], [2.0, 43.0],
        [3.5, 43.5], [5.0, 44.0], [7.0, 45.0],
        # Alps/Rhine
        [8.0, 47.0], [10.0, 47.5], [12.0, 47.0],
        # Balkans
        [14.0, 46.0], [16.0, 45.5], [18.0, 45.0],
        [20.0, 44.5], [22.0, 44.0], [24.0, 43.5],
        [26.0, 43.0], [28.0, 43.0],
        # Anatolia
        [30.0, 42.0], [32.0, 41.5], [34.0, 41.0],
        [36.0, 40.5], [38.0, 40.0],
        # Levant coast (in water)
        [36.0, 35.0], [35.0, 33.0], [34.0, 31.5],
        # North Africa coast (in water, going west)
        [33.0, 31.0], [30.0, 31.0], [25.0, 31.5],
        [20.0, 31.0], [15.0, 30.5],
        # N Africa inland border (desert edge)
        [10.0, 30.0], [5.0, 30.5], [0.0, 31.0],
        [-5.0, 31.0], [-8.0, 31.5],
        # Iberia south coast (in water)
        [-10.0, 34.0], [-10.0, 37.0],
    ]
    # Italy
    italy = [
        [6.5, 47.0], [13.5, 46.0], [18.5, 39.5], [16.0, 37.5],
        [15.0, 37.0], [12.0, 39.0], [8.5, 41.0], [6.5, 44.0], [6.5, 47.0],
    ]
    sicily = [
        [12.0, 39.0], [16.0, 38.5], [16.0, 36.5], [12.0, 37.0], [12.0, 39.0],
    ]
    sardinia = [
        [8.0, 41.5], [10.0, 41.5], [10.0, 38.5], [8.0, 38.5], [8.0, 41.5],
    ]
    corsica = [
        [8.5, 43.5], [9.8, 43.5], [9.8, 41.2], [8.5, 41.2], [8.5, 43.5],
    ]
    britain = [
        [-6.0, 50.0], [2.0, 50.0], [2.0, 55.0], [-6.0, 55.0], [-6.0, 50.0],
    ]
    greece = [
        [19.0, 41.0], [24.5, 40.0], [24.5, 36.0],
        [23.0, 34.5], [19.0, 36.0], [19.0, 41.0],
    ]
    features.append(feat(
        {"id": "roman-empire", "name": "Roman Empire", "type": "empire",
         "interactive": True, "color": "#C9534D", "labelPosition": [15, 42]},
        [continental, italy, sicily, sardinia, corsica, britain, greece],
        amplitude=0.2
    ))

    # Parthian Empire
    parthia = [
        # Western border (Euphrates, going south)
        [38.5, 38.0], [39.0, 37.5], [39.5, 37.0],
        [40.0, 36.5], [40.5, 36.0], [41.0, 35.5],
        [41.5, 35.0], [42.0, 34.5], [42.5, 34.0],
        [43.0, 33.5], [43.5, 33.0], [44.0, 32.5],
        [44.5, 32.0], [45.0, 31.5], [45.5, 31.0],
        # Persian Gulf coast (in water)
        [46.0, 30.5], [47.0, 29.5], [48.0, 29.0],
        [49.0, 28.5], [50.0, 28.0],
        [51.0, 27.0], [52.0, 26.5], [53.0, 26.5],
        [54.5, 27.0], [56.0, 26.5],
        # Makran coast (in water)
        [58.0, 24.5], [60.0, 25.0], [62.0, 25.5],
        [64.0, 26.0], [66.0, 27.0],
        # Eastern border (going north)
        [67.0, 28.0], [67.5, 30.0], [67.0, 32.0],
        [66.0, 33.0], [65.0, 34.0], [64.0, 35.0],
        # Northern border (steppe/mountains, going west)
        [63.0, 35.5], [61.0, 36.0], [59.0, 37.0],
        [57.0, 37.5], [55.0, 37.5], [53.0, 37.0],
        [51.0, 37.5], [49.0, 38.0], [47.0, 39.0],
        [45.0, 40.0], [43.0, 40.5], [41.0, 39.5],
        [39.5, 38.5], [38.5, 38.0],
    ]
    features.append(feat(
        {"id": "parthian-empire", "name": "Parthian Empire", "type": "empire",
         "interactive": True, "color": "#556B2F", "labelPosition": [53, 33]},
        [parthia], amplitude=0.28
    ))

    # Ptolemaic Egypt
    ptolemy = [
        # Western border (Cyrenaica to desert, going south)
        [20.0, 33.0], [21.0, 32.5], [22.0, 32.0],
        [23.0, 31.5], [24.0, 31.0], [25.0, 30.5],
        # Nile west bank desert margin
        [29.0, 31.0], [29.5, 30.5], [30.0, 29.5],
        [30.2, 28.5], [30.3, 27.5], [30.2, 26.5],
        [30.0, 25.5], [30.0, 24.5], [30.2, 23.5],
        [30.5, 22.5],
        # Southern border
        [31.0, 22.0], [32.0, 22.0],
        # Nile east bank desert margin (going north)
        [32.5, 23.0], [32.8, 24.0], [33.0, 25.0],
        [33.0, 26.0], [32.8, 27.0], [32.5, 28.0],
        [32.5, 29.0], [32.3, 30.0],
        # Delta / Med coast (in water)
        [32.5, 31.0], [33.0, 32.0], [34.0, 32.0],
        [34.0, 31.0], [33.5, 30.5],
        # Red Sea coast (in water going south then north on west bank)
        [34.0, 29.0], [34.5, 28.0], [34.0, 27.0],
        [33.5, 26.0], [33.0, 25.0],
        # Cyrenaica coast (in water, going west)
        [30.0, 32.5], [25.0, 33.0], [20.0, 33.5],
        [20.0, 33.0],
    ]
    features.append(feat(
        {"id": "ptolemaic-egypt", "name": "Ptolemaic Egypt", "type": "empire",
         "interactive": True, "color": "#4169E1", "labelPosition": [30, 28]},
        [ptolemy], amplitude=0.18
    ))

    # Han Dynasty China
    han = [
        # Northern border (inland, going east)
        [98.0, 40.0], [100.0, 41.0], [102.0, 42.0],
        [104.0, 42.5], [106.0, 42.0], [108.0, 41.5],
        [110.0, 42.0], [112.0, 42.0], [114.0, 41.0],
        [116.0, 41.5], [118.0, 40.5],
        # Pacific coast (in water for clipping, going south)
        [120.0, 40.0], [122.0, 39.0], [123.0, 38.0],
        [122.0, 37.0], [121.0, 36.0], [120.0, 35.0],
        [120.0, 34.0], [121.0, 32.0], [122.0, 31.0],
        [122.0, 30.0], [121.0, 29.0], [120.0, 28.0],
        [119.0, 27.0], [118.0, 26.0], [117.0, 25.0],
        [116.0, 24.0], [115.0, 23.0], [114.0, 22.0],
        [113.0, 21.5], [112.0, 21.0], [111.0, 20.0],
        [110.0, 19.0], [109.0, 18.0],
        # Southern coast (in water, going west)
        [108.0, 17.5], [107.0, 18.0],
        # Southern/Western border (inland, going north)
        [106.0, 21.0], [105.0, 22.5], [104.0, 23.0],
        [103.0, 23.0], [102.0, 22.5], [101.0, 22.0],
        [100.0, 22.5], [99.0, 23.5], [98.0, 24.5],
        [97.5, 25.5], [98.0, 27.0], [98.5, 28.5],
        [99.0, 30.0], [100.0, 32.0],
        # Western border (going north through Tibet/steppe)
        [100.0, 33.5], [99.0, 35.0], [98.0, 36.0],
        [97.5, 37.0], [97.5, 38.0], [98.0, 39.0],
        [98.0, 40.0],
    ]
    features.append(feat(
        {"id": "han-china", "name": "Han Dynasty China", "type": "empire",
         "interactive": True, "color": "#DC143C", "labelPosition": [110, 34]},
        [han], amplitude=0.3
    ))

    return {
        "type": "FeatureCollection", "name": "hellenistic-roman",
        "epoch": "hellenistic-roman",
        "features": features,
    }


# ==============================================================
# REVOLUTIONARY (~1800 CE)
# ==============================================================

def revolutionary():
    features = []

    # British Empire: oversized polygons for clipping
    britain = [
        [-7.0, 49.5], [2.5, 49.5], [2.5, 59.0], [-7.0, 59.0], [-7.0, 49.5],
    ]
    ireland = [
        [-11.0, 51.0], [-5.5, 51.0], [-5.5, 55.5], [-11.0, 55.5], [-11.0, 51.0],
    ]
    india = [
        [67.0, 35.0], [78.0, 35.0], [80.0, 30.0], [92.0, 28.0],
        [93.0, 22.0], [92.0, 20.0], [88.0, 21.0], [85.0, 20.0],
        [80.0, 15.0], [78.0, 8.0], [76.0, 8.0], [73.0, 15.0],
        [72.0, 20.0], [68.0, 23.0], [67.0, 25.0], [67.0, 35.0],
    ]
    australia = [
        [113.0, -10.0], [145.0, -10.0], [154.0, -25.0],
        [150.0, -38.0], [141.0, -39.0], [130.0, -33.0],
        [115.0, -35.0], [113.0, -25.0], [113.0, -10.0],
    ]
    south_africa = [
        [17.0, -29.0], [30.0, -29.0], [30.0, -35.0],
        [17.0, -35.0], [17.0, -29.0],
    ]
    canada = [
        [-141.0, 60.0], [-60.0, 60.0], [-55.0, 50.0],
        [-67.0, 44.0], [-80.0, 44.0], [-95.0, 49.0],
        [-141.0, 49.0], [-141.0, 60.0],
    ]
    features.append(feat(
        {"id": "british-empire", "name": "British Empire", "type": "empire",
         "interactive": True, "color": "#DC143C", "labelPosition": [78, 22]},
        [britain, ireland, india, australia, south_africa, canada],
        amplitude=0.15
    ))

    # French Empire
    france = [
        [-5.0, 48.5], [-2.0, 48.8], [0.0, 49.5], [2.0, 51.0],
        [4.0, 50.0], [6.0, 49.5], [8.0, 49.0], [8.0, 47.5],
        [7.5, 45.0], [6.5, 44.0], [7.5, 43.8], [6.0, 43.0],
        [3.5, 43.0], [3.0, 42.5], [0.0, 42.7], [-1.8, 43.3],
        [-1.5, 44.5], [-1.2, 46.0], [-2.0, 47.0], [-4.5, 48.5],
        [-5.0, 48.5],
    ]
    algeria = [
        [-2.0, 36.5], [9.5, 37.5], [10.0, 34.0], [9.0, 30.0],
        [3.0, 27.0], [-2.0, 30.0], [-2.0, 36.5],
    ]
    indochina = [
        [100.0, 23.0], [106.0, 23.0], [109.0, 21.5],
        [109.0, 18.0], [107.0, 15.0], [105.0, 10.0],
        [103.0, 8.5], [100.0, 13.0], [100.0, 18.0], [100.0, 23.0],
    ]
    senegal = [
        [-17.5, 16.5], [-11.5, 16.5], [-11.5, 12.0],
        [-17.5, 12.0], [-17.5, 16.5],
    ]
    features.append(feat(
        {"id": "french-empire", "name": "French Empire", "type": "empire",
         "interactive": True, "color": "#002654", "labelPosition": [2.5, 46.5]},
        [france, algeria, indochina, senegal], amplitude=0.15
    ))

    # United States (oversized for clipping)
    usa = [
        [-124.5, 48.5], [-122.0, 49.0], [-110.0, 49.0],
        [-100.0, 49.0], [-95.0, 49.0], [-90.0, 48.0],
        [-85.0, 47.0], [-82.0, 45.0], [-79.0, 43.0],
        [-75.0, 44.5], [-71.0, 45.0], [-67.0, 45.0],
        # Atlantic coast (in water)
        [-66.0, 43.0], [-70.0, 41.5], [-74.0, 40.5],
        [-75.5, 38.0], [-76.0, 36.0], [-78.0, 34.0],
        [-80.0, 32.0], [-81.0, 30.0], [-80.0, 27.0],
        [-82.0, 25.0],
        # Gulf coast (in water)
        [-83.0, 28.0], [-85.0, 29.5], [-88.0, 30.0],
        [-90.0, 29.0], [-94.0, 29.0], [-97.0, 26.0],
        # Mexican border (inland)
        [-99.0, 26.5], [-103.0, 30.5], [-106.5, 32.0],
        [-111.0, 31.5], [-114.5, 32.5],
        # Pacific coast (in water)
        [-117.5, 32.5], [-120.0, 34.5], [-122.5, 37.0],
        [-124.0, 40.0], [-124.5, 44.0], [-124.5, 48.5],
    ]
    features.append(feat(
        {"id": "united-states", "name": "United States", "type": "empire",
         "interactive": True, "color": "#3D5A80", "labelPosition": [-98, 39]},
        [usa], amplitude=0.15
    ))

    # Qing Dynasty China
    qing = [
        # Pamirs (western extreme)
        [73.5, 39.5],
        # Northern border (inland, going east through Xinjiang/Mongolia)
        [76.0, 41.0], [80.0, 42.0], [85.0, 42.0],
        [88.0, 43.5], [90.0, 46.0], [93.0, 47.5],
        [97.0, 48.5], [100.0, 49.5], [104.0, 50.5],
        [108.0, 50.0], [112.0, 50.0], [116.0, 50.5],
        [120.0, 51.5], [123.0, 53.0], [127.0, 53.5],
        [130.0, 52.5], [133.0, 50.0], [135.0, 48.0],
        # Pacific coast (in water, going south)
        [135.5, 47.0], [134.0, 46.0], [131.5, 44.5],
        [130.0, 42.5], [128.0, 41.0], [125.0, 40.0],
        [123.0, 39.0], [121.5, 37.0], [120.0, 35.0],
        [120.0, 33.0], [122.0, 30.0], [121.5, 28.0],
        [120.0, 26.0], [118.0, 24.0], [116.0, 22.5],
        [114.0, 22.5], [112.0, 21.0], [110.0, 20.0],
        [109.0, 20.5],
        # Southern border (inland, going west)
        [108.0, 21.5], [106.5, 22.5], [104.0, 23.0],
        [102.0, 22.0], [100.0, 22.0], [99.0, 23.0],
        [98.0, 24.5], [97.5, 25.5], [98.0, 27.0],
        [97.0, 28.0], [93.0, 28.0], [88.0, 28.0],
        [84.0, 28.5], [80.0, 30.5], [78.0, 34.0],
        [76.0, 36.5], [74.0, 38.0],
        [73.5, 39.5],
    ]
    features.append(feat(
        {"id": "qing-china", "name": "Qing Dynasty China", "type": "empire",
         "interactive": True, "color": "#FFD700", "labelPosition": [105, 35]},
        [qing], amplitude=0.3
    ))

    # Russian Empire
    russia_main = [
        # Western border (Poland/Finland area, going north)
        [20.0, 54.5], [21.0, 55.5], [24.0, 57.0],
        [26.0, 59.5], [28.0, 61.0], [27.0, 64.0],
        [25.5, 67.0], [26.0, 69.5], [30.0, 70.5],
        # Arctic coast (in water, going east)
        [40.0, 69.0], [50.0, 69.0], [60.0, 69.5],
        [70.0, 70.5], [80.0, 72.0], [90.0, 72.5],
        [100.0, 73.0], [110.0, 73.5], [120.0, 73.0],
        [130.0, 72.5], [140.0, 71.5], [150.0, 70.0],
        [160.0, 67.0], [163.0, 64.0],
        # Pacific coast (in water, going south)
        [160.0, 61.0], [155.0, 59.0], [150.0, 56.5],
        [145.0, 53.0], [142.0, 50.0], [140.0, 48.0],
        [137.0, 46.5], [135.5, 48.0],
        # Southern border (inland, going west)
        [133.0, 50.0], [130.0, 52.5], [125.0, 53.0],
        [120.0, 52.0], [116.0, 51.0], [112.0, 50.5],
        [108.0, 50.5], [104.0, 51.5], [100.0, 50.0],
        [96.0, 50.0], [92.0, 50.5], [88.0, 50.0],
        [85.0, 47.5], [80.0, 45.0], [75.0, 43.5],
        [70.0, 42.0], [66.0, 40.5], [62.0, 40.0],
        [58.0, 40.5], [54.0, 41.5], [50.0, 43.0],
        [46.0, 44.0], [44.0, 43.0], [42.0, 41.5],
        [40.0, 42.0], [40.0, 44.0], [42.0, 46.5],
        [44.0, 48.0], [47.0, 49.5], [46.0, 51.5],
        [42.0, 51.0], [38.0, 51.5], [34.0, 52.0],
        [30.0, 52.5], [26.0, 52.5], [22.0, 53.5],
        [20.0, 54.5],
    ]
    alaska = [
        [-170.0, 64.0], [-168.0, 65.5], [-162.0, 64.0],
        [-156.0, 61.0], [-150.0, 59.0], [-141.0, 60.0],
        [-141.0, 69.0], [-155.0, 71.5], [-168.0, 69.0],
        [-170.0, 67.0], [-170.0, 64.0],
    ]
    features.append(feat(
        {"id": "russian-empire", "name": "Russian Empire", "type": "empire",
         "interactive": True, "color": "#1C1C1C", "labelPosition": [80, 60]},
        [russia_main, alaska], amplitude=0.3
    ))

    # Meiji Japan (oversized for clipping)
    honshu = [
        [129.0, 34.0], [132.0, 35.0], [135.0, 36.0],
        [138.0, 35.5], [140.0, 36.5], [141.5, 39.0],
        [141.5, 41.5], [139.0, 41.0], [137.0, 37.0],
        [135.0, 35.5], [132.0, 33.5], [130.0, 32.5], [129.0, 34.0],
    ]
    hokkaido = [
        [139.5, 42.0], [145.5, 43.5], [145.5, 41.5],
        [140.0, 41.5], [139.5, 42.0],
    ]
    kyushu = [
        [129.0, 34.0], [132.0, 34.0], [132.0, 31.0],
        [129.0, 31.0], [129.0, 34.0],
    ]
    shikoku = [
        [132.0, 34.5], [135.0, 34.5], [135.0, 33.0],
        [132.0, 33.0], [132.0, 34.5],
    ]
    features.append(feat(
        {"id": "meiji-japan", "name": "Meiji Japan", "type": "empire",
         "interactive": True, "color": "#BC002D", "labelPosition": [138, 36]},
        [honshu, hokkaido, kyushu, shikoku], amplitude=0.1
    ))

    return {
        "type": "FeatureCollection", "name": "revolutionary",
        "epoch": "revolutionary",
        "features": features,
    }


# ==============================================================
# Main
# ==============================================================

def save(data, filename):
    path = os.path.join(GEO_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    size = os.path.getsize(path) / 1024
    print(f"  {filename}: {len(data['features'])} features, {size:.1f} KB")


def main():
    print("Generating territory GeoJSON files...")
    save(bronze_age(), "bronze-age.json")
    save(classical(), "classical.json")
    save(hellenistic_roman(), "hellenistic-roman.json")
    save(revolutionary(), "revolutionary.json")
    print("Done! Now run clip_to_coastline.py to clip to real coastlines.")


if __name__ == "__main__":
    main()
