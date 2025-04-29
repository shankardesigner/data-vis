import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NodeType, LinkType } from '../types';

interface NetworkSummaryBarChartProps {
  nodes: NodeType[];
  links: LinkType[];
  height?: number;
}

const NetworkSummaryBarChart: React.FC<NetworkSummaryBarChartProps> = ({
  nodes,
  links,
  height = 500,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const hospitalCount = nodes.filter(n => n.role === 'Healthcare Entity').length;
    const doctorCount = nodes.filter(n => n.role === 'Healthcare Professional').length;
    const patientCount = nodes.filter(n => n.role === 'Patient').length;

    const data = [
      { name: 'Hospitals', value: hospitalCount, color: '#60a5fa' },   // Blue
      { name: 'Doctors', value: doctorCount, color: '#34d399' },       // Green
      { name: 'Patients', value: patientCount, color: '#f87171' },     // Red
    ];

    const container = containerRef.current;
    const width = container?.clientWidth || 400;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 30, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)!])
      .nice()
      .range([innerHeight, 0]);

    const tooltip = d3.select(container)
      .append('div')
      .style('position', 'absolute')
      .style('background', '#111')
      .style('color', '#fff')
      .style('padding', '4px 8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Axis
    chartGroup.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-30)')
      .style('text-anchor', 'end')
      .style('font-size', '10px');

    // Y Axis
    chartGroup.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .style('font-size', '10px');

    // Bars
    chartGroup.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name)!)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', d => d.color)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', d3.color(d.color)?.darker(0.8)?.formatHex() || d.color);
        tooltip
          .style('opacity', 1)
          .html(`${d.name}: ${d.value}`)
          .style('left', `${event.offsetX + 10}px`)
          .style('top', `${event.offsetY - 30}px`);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.offsetX + 10}px`)
          .style('top', `${event.offsetY - 30}px`);
      })
      .on('mouseout', function (event, d) {
        d3.select(this).attr('fill', d.color);
        tooltip.style('opacity', 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [nodes, links, height]);

  return (
    <div ref={containerRef} className="w-full relative">
      {/* <div className="bg-gray-50 border border-gray-200 rounded-lg shadow p-4"> */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Network Summary</h3>
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          className="rounded bg-white"
        />
      </div>
    // </div>
  );
};

export default NetworkSummaryBarChart;
