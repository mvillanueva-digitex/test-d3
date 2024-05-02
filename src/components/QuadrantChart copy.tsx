import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  name: string;
  x: number;
  y: number;
}

interface Props {
  data: DataPoint[];
  xRange: number[];
  yRange: number[];
  xLabelTop: string;
  xLabelBottom: string;
  yLabelLeft: string;
  yLabelRight: string;
  invertX: boolean;
  invertY: boolean;
}

const QuadrantChart: React.FC<Props> = ({
  data,
  xRange,
  yRange,
  xLabelTop,
  xLabelBottom,
  yLabelLeft,
  yLabelRight,
  invertX,
  invertY,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 65, bottom: 50, left: 65 };
    const width = 600 - (margin.left + margin.right);
    const height = 400 - (margin.top + margin.bottom);

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width + (margin.left + margin.right)} ${height + (margin.top + margin.bottom)}`);

    const group = svg.append('g')
      .attr('transform', `translate(${margin.left} ${margin.top})`);

    const countScale = d3.scaleLinear()
      .domain(invertX ? xRange.reverse() : xRange)
      .range([0, width]);

    const percentageScale = d3.scaleLinear()
      .domain(invertY ? yRange.reverse() : yRange)
      .range([height, 0]);

    const countAxis = d3.axisBottom(countScale).tickFormat(d => d.toString());
    const percentageAxis = d3.axisLeft(percentageScale).tickFormat(d => `${d}%`);

    group.append('g')
      .attr('transform', `translate(0 ${height})`)
      .attr('class', 'axis axis-count')
      .call(countAxis);

    group.append('g')
      .attr('class', 'axis axis-percentage')
      .call(percentageAxis);

    d3.selectAll('.axis').select('path').remove();

    d3.select('.axis-count').selectAll('line').attr('y2', 5);
    d3.select('.axis-percentage').selectAll('line').attr('x2', -4);
    d3.selectAll('.axis').selectAll('text').attr('font-size', '0.55rem');

    d3.select('.axis-count').append('g')
      .attr('class', 'label label-count')
      .attr('transform', `translate(${width / 2} ${margin.bottom})`)
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .text(xLabelBottom)
      .attr('text-anchor', 'middle')
      .style('font-size', '0.65rem')
      .style('font-weight', '600')
      .style('letter-spacing', '0.05rem');

    d3.select('.axis-count').append('g')
      .attr('class', 'label label-count')
      .attr('transform', `translate(${width / 2} ${height + margin.top + margin.bottom - 5})`)
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .text(xLabelTop)
      .attr('text-anchor', 'middle')
      .style('font-size', '0.65rem')
      .style('font-weight', '600')
      .style('letter-spacing', '0.05rem');

    d3.select('.axis-percentage').append('g')
      .attr('class', 'label label-percentage')
      .attr('transform', `translate(-${margin.left} ${height / 2})`)
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .text(yLabelLeft)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .attr('transform', 'rotate(-90)')
      .style('font-size', '0.65rem')
      .style('font-weight', '600')
      .style('letter-spacing', '0.05rem');

    d3.select('.axis-percentage').append('g')
      .attr('class', 'label label-percentage')
      .attr('transform', `translate(${width + margin.left + margin.right - 5} ${height / 2})`)
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .text(yLabelRight)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .attr('transform', 'rotate(-90)')
      .style('font-size', '0.65rem')
      .style('font-weight', '600')
      .style('letter-spacing', '0.05rem');

    // Draw data points
    const dataGroup = group.append('g').attr('class', 'data');

    const dataPointsGroup = dataGroup.selectAll('g.data-point')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'data-point')
      .attr('transform', ({ x, y }) => `translate(${countScale(x)} ${percentageScale(y)})`);

    dataPointsGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5)
      .attr('fill', 'steelblue');

    dataPointsGroup.append('text')
      .attr('x', 8)
      .attr('y', 0)
      .attr('class', 'name')
      .text(({ name }) => name)
      .attr('dominant-baseline', 'central')
      .style('font-size', '0.55rem')
      .style('letter-spacing', '0.05rem')
      .style('pointer-events', 'none');

  }, [data, xRange, yRange, xLabelTop, xLabelBottom, yLabelLeft, yLabelRight, invertX, invertY]);

  return <svg ref={svgRef}></svg>;
};

export default QuadrantChart;

// import React, { useRef, useEffect } from 'react';
// import * as d3 from 'd3';

// interface DataPoint {
//   name: string;
//   x: number;
//   y: number;
// }

// interface Props {
//   data: DataPoint[];
//   quad: string[];
//   xRange: number[];
//   yRange: number[];
//   xLabelTop: string;
//   xLabelBottom: string;
//   yLabelLeft: string;
//   yLabelRight: string;
//   invertX: boolean;
//   invertY: boolean;
// }


// const QuadrantChart: React.FC<Props> = ({ data, quad, xRange, yRange, xLabelTop, xLabelBottom, yLabelLeft, yLabelRight, invertX, invertY }) => {
//   const svgRef = useRef<SVGSVGElement>(null);

//   useEffect(() => {
//     const margin = { top: 20, right: 65, bottom: 50, left: 65 };
//     const width = 600 - (margin.left + margin.right);
//     const height = 400 - (margin.top + margin.bottom);

//     const svg = d3.select(svgRef.current)
//       .attr('viewBox', `0 0 ${width + (margin.left + margin.right)} ${height + (margin.top + margin.bottom)}`);

//     const group = svg.append('g')
//       .attr('transform', `translate(${margin.left} ${margin.top})`);

//     const countScale = d3.scaleLinear()
//       .domain(invertX ? xRange.reverse() : xRange)
//       .range([0, width]);

//     const percentageScale = d3.scaleLinear()
//       .domain(invertY ? yRange.reverse() : yRange)
//       .range([height, 0]);

//     const quadrantsGroup = group.append('g')
//       .attr('class', 'quadrants');

//     const quadrants = quadrantsGroup.selectAll('g.quadrant')
//       .data(quad)
//       .enter()
//       .append('g')
//       .attr('class', 'quadrant')
//       .attr('transform', (d, i) => `translate(${i % 2 === 0 ? 0 : width / 2} ${i < 2 ? 0 : height / 2})`);

//     quadrants.append('rect')
//       .attr('x', 0)
//       .attr('y', 0)
//       .attr('width', width / 2)
//       .attr('height', height / 2)
//       .attr('fill', (d, i) => (i === 2 ? 'hsl(0, 0%, 0%)' : 'hsl(0, 100%, 100%)'))
//       .attr('opacity', (d, i) => ((i === 1 || i === 2) ? 0.15 : 0.05));

//     quadrants.append('text')
//       .attr('x', width / 4)
//       .attr('y', height / 4)
//       .attr('text-anchor', 'middle')
//       .attr('dominant-baseline', 'middle')
//       .text(d => d)
//       .style('text-transform', 'uppercase')
//       .style('font-weight', '300')
//       .style('font-size', '0.9rem')
//       .attr('opacity', 0.9);

//     const countAxis = d3.axisBottom(countScale).tickFormat(d => d.toString());
//     const percentageAxis = d3.axisLeft(percentageScale).tickFormat(d => `${d}%`);

//     group.append('g')
//       .attr('transform', `translate(0 ${height})`)
//       .attr('class', 'axis axis-count')
//       .call(countAxis);

//     group.append('g')
//       .attr('class', 'axis axis-percentage')
//       .call(percentageAxis);

//     d3.selectAll('.axis').select('path').remove();

//     d3.select('.axis-count').selectAll('line').attr('y2', 5);
//     d3.select('.axis-percentage').selectAll('line').attr('x2', -4);
//     d3.selectAll('.axis').selectAll('text').attr('font-size', '0.55rem');

//     d3.select('.axis-count').append('g')
//       .attr('class', 'label label-count')
//       .attr('transform', `translate(${width / 2} ${margin.bottom})`)
//       .append('text')
//       .attr('x', 0)
//       .attr('y', 0)
//       .text(xLabelBottom)
//       .attr('text-anchor', 'middle')
//       .style('font-size', '0.65rem')
//       .style('font-weight', '600')
//       .style('letter-spacing', '0.05rem');

//     d3.select('.axis-count').append('g')
//       .attr('class', 'label label-count')
//       .attr('transform', `translate(${width / 2} ${height + margin.top + margin.bottom - 5})`)
//       .append('text')
//       .attr('x', 0)
//       .attr('y', 0)
//       .text(xLabelTop)
//       .attr('text-anchor', 'middle')
//       .style('font-size', '0.65rem')
//       .style('font-weight', '600')
//       .style('letter-spacing', '0.05rem');

//     d3.select('.axis-percentage').append('g')
//       .attr('class', 'label label-percentage')
//       .attr('transform', `translate(-${margin.left} ${height / 2})`)
//       .append('text')
//       .attr('x', 0)
//       .attr('y', 0)
//       .text(yLabelLeft)
//       .attr('text-anchor', 'middle')
//       .attr('dominant-baseline', 'hanging')
//       .attr('transform', 'rotate(-90)')
//       .style('font-size', '0.65rem')
//       .style('font-weight', '600')
//       .style('letter-spacing', '0.05rem');

//     d3.select('.axis-percentage').append('g')
//       .attr('class', 'label label-percentage')
//       .attr('transform', `translate(${width + margin.left + margin.right - 5} ${height / 2})`)
//       .append('text')
//       .attr('x', 0)
//       .attr('y', 0)
//       .text(yLabelRight)
//       .attr('text-anchor', 'middle')
//       .attr('dominant-baseline', 'hanging')
//       .attr('transform', 'rotate(-90)')
//       .style('font-size', '0.65rem')
//       .style('font-weight', '600')
//       .style('letter-spacing', '0.05rem');

//   }, [data, xRange, yRange, xLabelTop, xLabelBottom, yLabelLeft, yLabelRight, invertX, invertY]);

//   return <svg ref={svgRef}></svg>;
// };

// export default QuadrantChart;







// import React, { useRef, useEffect } from 'react';
// import * as d3 from 'd3';

// interface DataPoint {
//   name: string;
//   x: number;
//   y: number;
// }

// interface QuadrantChartProps {
//   data: DataPoint[];
//   xRange: number[];
//   yRange: number[];
//   xAxisLabelTop?: string;
//   xAxisLabelBottom?: string;
//   yAxisLabelLeft?: string;
//   yAxisLabelRight?: string;
//   invertX?: boolean;
//   invertY?: boolean;
// }

// const QuadrantChart: React.FC<QuadrantChartProps> = ({
//   data,
//   xRange,
//   yRange,
//   xAxisLabelTop,
//   xAxisLabelBottom,
//   yAxisLabelLeft,
//   yAxisLabelRight,
//   invertX = false,
//   invertY = false,
// }) => {
//   const svgRef = useRef<SVGSVGElement>(null);

//   useEffect(() => {
//     if (!svgRef.current) return;

//     const margin = { top: 20, right: 20, bottom: 50, left: 50 };
//     const width = svgRef.current.clientWidth - margin.left - margin.right;
//     const height = svgRef.current.clientHeight - margin.top - margin.bottom;

//     const svg = d3
//       .select(svgRef.current)
//       .attr('width', width + margin.left + margin.right)
//       .attr('height', height + margin.top + margin.bottom)
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);

//     const xScale = d3.scaleLinear().domain(xRange).range([0, width]);
//     const yScale = d3.scaleLinear().domain(yRange).range([height, 0]);

//     if (invertX) xScale.range([width, 0]);
//     if (invertY) yScale.range([0, height]);

//     svg.append('g')
//       .attr('transform', `translate(0,${height})`)
//       .call(d3.axisBottom(xScale));

//     svg.append('g').call(d3.axisLeft(yScale));

//     // Draw data points
//     svg.selectAll('circle')
//       .data(data)
//       .enter()
//       .append('circle')
//       .attr('cx', d => xScale(d.x))
//       .attr('cy', d => yScale(d.y))
//       .attr('r', 5);

//     // Add axis labels
//     if (xAxisLabelTop) {
//       svg.append('text')
//         .attr('x', width / 2)
//         .attr('y', -10)
//         .style('text-anchor', 'middle')
//         .text(xAxisLabelTop);
//     }

//     if (xAxisLabelBottom) {
//       svg.append('text')
//         .attr('x', width / 2)
//         .attr('y', height + 40)
//         .style('text-anchor', 'middle')
//         .text(xAxisLabelBottom);
//     }

//     if (yAxisLabelLeft) {
//       svg.append('text')
//         .attr('transform', 'rotate(-90)')
//         .attr('y', -margin.left)
//         .attr('x', -height / 2)
//         .attr('dy', '1em')
//         .style('text-anchor', 'middle')
//         .text(yAxisLabelLeft);
//     }

//     if (yAxisLabelRight) {
//       svg.append('text')
//         .attr('transform', 'rotate(-90)')
//         .attr('y', width + margin.right)
//         .attr('x', -height / 2)
//         .attr('dy', '1em')
//         .style('text-anchor', 'middle')
//         .text(yAxisLabelRight);
//     }
//   }, [data, xRange, yRange, xAxisLabelTop, xAxisLabelBottom, yAxisLabelLeft, yAxisLabelRight, invertX, invertY]);

//   return <svg ref={svgRef}></svg>;
// };

// export default QuadrantChart;