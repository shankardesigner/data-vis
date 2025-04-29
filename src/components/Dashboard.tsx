import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import { NodeType, LinkType, Attribute } from '../types';
import NetworkGraph from './NetworkGraph';
import NetworkSummaryBarChart from './NetworkSummaryBarChart';

const Dashboard: React.FC = () => {
  const [nodes, setNodes] = useState<NodeType[]>([])
    const [links, setLinks] = useState<LinkType[]>([])
    const [attributes, setAttributes] = useState<Record<number, Attribute>>({})
  
    useEffect(() => {
      async function loadData() {
        const data = await d3.csv('src/data/attributes.csv')
        const nodesData = await d3.json('src/data/Nodes-1.json') as NodeType[]
        const linksData = await d3.json('src/data/links.json') as LinkType[]
        const parsedData: Record<number, Attribute> = {}
        
        data.forEach((d: any) => {
          if (d.id) {
            parsedData[+d.id] = {
              id: +d.id,
              ...d,
            }
          }
        })
  
        setNodes(nodesData)
        setLinks(linksData)
        setAttributes(parsedData)
      }
  
      loadData()
    }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Main Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Pages / Main Dashboard</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <NetworkGraph
          nodes={nodes}
          links={links}
          // attributes={attributes}
        />
         <NetworkSummaryBarChart nodes={nodes} links={links} />
      </div>
     
    </div>
  );
};

export default Dashboard;