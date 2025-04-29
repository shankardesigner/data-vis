import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { NodeType, LinkType } from '../types';

interface NetworkGraphProps {
  nodes: NodeType[];
  links: LinkType[];
  width?: number;
  height?: number;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  nodes,
  links,
  width = 1200,
  height = 800,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dynamicWidth, setDynamicWidth] = useState(width);
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

  const [interactionTypeFilter, setInteractionTypeFilter] = useState<string>('All');
  const [hospitalFilter, setHospitalFilter] = useState<string>('All');
  const [doctorFilter, setDoctorFilter] = useState<string>('All');

  const interactionTypes = Array.from(new Set(links.map(l => l.interaction_type)));
  const hospitals = nodes.filter(n => n.role === 'Healthcare Entity');
  const doctors = nodes.filter(n => n.role === 'Healthcare Professional');

  const doctorIds = new Set(doctors.map(n => n.id.toString()));
  const hospitalIds = new Set(hospitals.map(n => n.id.toString()));

  const patientIdsLinked = new Set(
    links
      .filter(l => {
        const s = l.source.toString();
        const t = l.target.toString();
        return (
          (doctorIds.has(s) && isPatient(t)) ||
          (doctorIds.has(t) && isPatient(s)) ||
          (hospitalIds.has(s) && isPatient(t)) ||
          (hospitalIds.has(t) && isPatient(s))
        );
      })
      .flatMap(l => [l.source.toString(), l.target.toString()])
      .filter(id => isPatient(id))
  );

  function isPatient(id: string): boolean {
    const node = nodes.find(n => n.id.toString() === id);
    return node?.role === 'Patient';
  }

  // Initial nodes
  const baseNodes: NodeType[] = nodes
    .filter((n) => {
      if (n.role === 'Healthcare Entity') return true;
      if (n.role === 'Healthcare Professional') return true;
      if (n.role === 'Patient' && patientIdsLinked.has(n.id.toString())) return true;
      return false;
    })
    .map((n) => ({
      ...n,
      id: n.id.toString(),
    }));

  const baseNodeIds = new Set(baseNodes.map(n => n.id));

  // Processed links according to selected filters
  const processedLinks = links
    .filter((l) => {
      const s = l.source.toString();
      const t = l.target.toString();
      if (interactionTypeFilter !== 'All' && l.interaction_type !== interactionTypeFilter) return false;
      if (hospitalFilter !== 'All' && !(s === hospitalFilter || t === hospitalFilter)) return false;
      if (doctorFilter !== 'All' && !(s === doctorFilter || t === doctorFilter)) return false;
      return baseNodeIds.has(s) && baseNodeIds.has(t);
    })
    .map((l) => ({
      ...l,
      source: l.source.toString(),
      target: l.target.toString(),
    }));

  // Final nodes = only those who are linked
  const connectedNodeIds = new Set(
    processedLinks.flatMap(l => [l.source.toString(), l.target.toString()])
  );

  const processedNodes = baseNodes.filter(n => connectedNodeIds.has(n.id));

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (entry.contentRect) {
            setDynamicWidth(entry.contentRect.width);
          }
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 5])
      .on('zoom', (event) => {
        svgGroup.attr('transform', event.transform);
      });

    svg.call(zoom);

    const svgGroup = svg.append('g');

    const simulation = d3.forceSimulation<NodeType>(processedNodes)
      .force('link', d3.forceLink<NodeType, LinkType>(processedLinks).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-250))
      .force('collision', d3.forceCollide(50))
      .on('tick', ticked);

    const link = svgGroup.append('g')
      .attr('stroke', '#ccc')
      .selectAll('line')
      .data(processedLinks)
      .join('line')
      .attr('stroke-width', 2); // No arrows anymore

    const node = svgGroup.append('g')
      .selectAll('circle')
      .data(processedNodes)
      .join('circle')
      .attr('r', 12)
      .attr('fill', (d) =>
        d.role === 'Healthcare Entity' ? '#4caf50' :
        d.role === 'Healthcare Professional' ? '#2196f3' :
        '#f44336'
      )
      .call(drag(simulation))
      .on('mouseover', (event, d) => {
        const bounds = svgRef.current?.getBoundingClientRect();
        if (!bounds) return;

        node.style('opacity', o => isConnected(d, o) ? 1 : 0.9);
        link.style('opacity', l => (l.source === d.id || l.target === d.id) ? 1 : 0.9);

        setTooltip({
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
          content: `${d.name}
Role: ${d.role}
Specialty: ${d.specialty || 'N/A'}
Patients: ${d.patient_count ?? 'N/A'}`,
        });
      })
      .on('mouseout', () => {
        node.style('opacity', 1);
        link.style('opacity', 1);
        setTooltip(null);
      })
      .on('click', (event, d) => setSelectedNode(d));

    function isConnected(a: NodeType, b: NodeType) {
      return processedLinks.some(
        (l) =>
          (l.source === a.id && l.target === b.id) ||
          (l.source === b.id && l.target === a.id)
      );
    }

    function ticked() {
      node
        .attr('cx', (d) => {
          d.x = Math.max(20, Math.min(dynamicWidth - 20, d.x!));
          return d.x;
        })
        .attr('cy', (d) => {
          d.y = Math.max(20, Math.min(height - 20, d.y!));
          return d.y;
        });

      link
        .attr('x1', (d) => (typeof d.source !== 'string' ? d.source.x! : 0))
        .attr('y1', (d) => (typeof d.source !== 'string' ? d.source.y! : 0))
        .attr('x2', (d) => (typeof d.target !== 'string' ? d.target.x! : 0))
        .attr('y2', (d) => (typeof d.target !== 'string' ? d.target.y! : 0));
    }
  }, [nodes, links, interactionTypeFilter, hospitalFilter, doctorFilter, dynamicWidth, height]);

  function drag(simulation: d3.Simulation<NodeType, LinkType>) {
    return d3.drag<SVGCircleElement, NodeType>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-2">
        <div>
          <label className="text-sm mr-2 font-medium">Interaction:</label>
          <select
            value={interactionTypeFilter}
            onChange={(e) => setInteractionTypeFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="All">All</option>
            {interactionTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm mr-2 font-medium">Hospital:</label>
          <select
            value={hospitalFilter}
            onChange={(e) => setHospitalFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="All">All</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id.toString()}>{h.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm mr-2 font-medium">Doctor:</label>
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="All">All</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id.toString()}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <svg ref={svgRef} width="100%" height={height} className="border rounded bg-white"></svg>

      {tooltip && (
        <div
          className="absolute bg-black text-white p-2 text-xs rounded shadow z-50"
          style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
        >
          <pre>{tooltip.content}</pre>
        </div>
      )}

      <div
        className={`absolute top-0 right-0 bg-white shadow-lg w-64 h-full transform transition-transform duration-300 ease-in-out ${
          selectedNode ? 'translate-x-0 ml-0' : 'translate-x-full ml-4'
        }`}
      >
        {selectedNode && (
          <div className="p-4 h-full overflow-auto relative">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-lg"
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-2">{selectedNode.name}</h2>
            <p><strong>Role:</strong> {selectedNode.role}</p>
            <p><strong>Specialty:</strong> {selectedNode.specialty || 'N/A'}</p>
            <p><strong>Patient Count:</strong> {selectedNode.patient_count ?? 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkGraph;
