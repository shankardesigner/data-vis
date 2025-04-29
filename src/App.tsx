import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import NetworkGraph from './components/NetworkGraph';
import NetworkSummaryBarChart from './components/NetworkSummaryBarChart';
import * as d3 from 'd3';
import { NodeType, LinkType, Attribute } from './types';
import WorldMap from './components/WorldMap';
import DashboardCards from './components/DashboardCards';

const App: React.FC = () => {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [attributes, setAttributes] = useState<Record<number, Attribute>>({});

  useEffect(() => {
    async function loadData() {
      const data = await d3.csv("/data/attributes.csv");
      const nodesData = (await d3.json("/data/Nodes-1.json")) as NodeType[];
      const linksData = (await d3.json("/data/links.json")) as LinkType[];
      const parsedData: Record<number, Attribute> = {};

      data.forEach((d: any) => {
        if (d.id) {
          parsedData[+d.id] = {
            id: +d.id,
            ...d,
          };
        }
      });

      setNodes(nodesData);
      setLinks(linksData);
      setAttributes(parsedData);
    }

    loadData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<DashboardCards />} />
          <Route
            path="graph"
            element={<NetworkGraph nodes={nodes} links={links} />}
          />
          <Route
            path="summary"
            element={<NetworkSummaryBarChart nodes={nodes} links={links} />}
          />
          <Route path="Map" element={<WorldMap nodes={nodes} />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
