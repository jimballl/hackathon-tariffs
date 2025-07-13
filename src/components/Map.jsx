import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from './Tooltip';
import { formatNumber, formatPopulation } from '../App'; // Import formatters

const getCountryClass = (countryName, tradeData) => {
    const data = tradeData[countryName];
    if (!data) return 'country-no-data';
    const totalTrade = (data.exports2024 || 0) + (data.imports2024 || 0);
    if (totalTrade < 100) return 'country-low-trade';
    if (data.deficit2024 < 0) return 'country-deficit';
    return 'country-surplus';
};

const Map = ({ worldData, tradeData, basicInfo }) => {
    const svgRef = useRef();
    const [tooltip, setTooltip] = useState({
        visible: false,
        content: {},
        x: 0,
        y: 0,
    });

    useEffect(() => {
        if (!worldData || !tradeData) return;

        const width = 960;
        const height = 600;

        const svg = d3.select(svgRef.current)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('background', 'linear-gradient(180deg, #87CEEB 0%, #98FB98 100%)');

        // Clear previous render
        svg.selectAll('*').remove();

        const projection = d3.geoNaturalEarth1()
            .scale(160)
            .translate([width / 2, height / 2]);

        const pathGenerator = d3.geoPath().projection(projection);

        const g = svg.append('g');

        g.selectAll('path')
            .data(worldData.features)
            .enter()
            .append('path')
            .attr('d', pathGenerator)
            .attr('class', d => `country ${getCountryClass(d.properties.name, tradeData)}`)
            .on('mouseover', (event, d) => {
                const countryName = d.properties.name;
                const countryTradeData = tradeData[countryName];
                const countryBasicInfo = basicInfo[countryName];
                setTooltip(prev => ({
                    ...prev,
                    visible: true,
                    content: {
                        name: countryName,
                        trade: countryTradeData,
                        basic: countryBasicInfo,
                    },
                }));
            })
            .on('mousemove', (event) => {
                setTooltip(prev => ({ ...prev, x: event.pageX, y: event.pageY }));
            })
            .on('mouseout', () => {
                setTooltip(prev => ({ ...prev, visible: false }));
            });

        const zoom = d3.zoom()
            .scaleExtent([0.8, 8])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

    }, [worldData, tradeData, basicInfo]); // Redraw map if data changes

    return (
        <div className="map-container">
            <svg ref={svgRef}></svg>
            <Tooltip
                visible={tooltip.visible}
                content={tooltip.content}
                x={tooltip.x}
                y={tooltip.y}
            />
        </div>
    );
};

export default Map;