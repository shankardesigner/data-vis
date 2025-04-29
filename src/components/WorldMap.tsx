// src/components/WorldMap.tsx
import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { feature } from "topojson-client";
import { NodeType } from "../types"; // Your NodeType

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  nodes: NodeType[];
}

const WorldMap: React.FC<WorldMapProps> = ({ nodes }) => {
  const [geographies, setGeographies] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);

  useEffect(() => {
    fetch(geoUrl)
      .then(res => res.json())
      .then(worldData => {
        const countries = feature(worldData, worldData.objects.countries).features;
        setGeographies(countries);
      });
  }, []);

  const nodeLocations = nodes.map((n) => ({
    ...n,
    coordinates: getRandomCoordinates(), // Random for now
  }));

  return (
    <div className="relative bg-white rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Healthcare Network Map</h2>

      <ComposableMap projection="geoEqualEarth" width={800} height={500}>
        {geographies.length > 0 && (
          <Geographies geography={geographies}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#EAEAEC"
                  stroke="#D6D6DA"
                />
              ))
            }
          </Geographies>
        )}

        {/* Nodes */}
        {nodeLocations.map((n, i) => (
          <Marker key={i} coordinates={n.coordinates}>
            <circle
              r={n.role === "Healthcare Entity" ? 7 : n.role === "Healthcare Professional" ? 5 : 3}
              fill={n.role === "Healthcare Entity" ? "#3b82f6" : n.role === "Healthcare Professional" ? "#10b981" : "#ef4444"}
              stroke="#fff"
              strokeWidth={0.8}
              className="cursor-pointer"
              onClick={() => setSelectedNode(n)}
            />
          </Marker>
        ))}
      </ComposableMap>

      {/* Popup Modal */}
      {selectedNode && (
        <div className="absolute top-8 right-8 w-72 p-4 bg-white border rounded-lg shadow-lg z-50">
          <h3 className="text-lg font-bold mb-2">{selectedNode.name}</h3>
          <p><strong>Role:</strong> {selectedNode.role}</p>
          <p><strong>Specialty:</strong> {selectedNode.specialty || "N/A"}</p>
          <p><strong>Patients:</strong> {selectedNode.patient_count ?? "N/A"}</p>
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-4 px-3 py-1 bg-indigo-600 text-white rounded text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

// 🧠 Mock random coordinates
function getRandomCoordinates() {
  const lat = Math.random() * 140 - 70;
  const lon = Math.random() * 360 - 180;
  return [lon, lat];
}

export default WorldMap;
