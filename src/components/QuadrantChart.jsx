import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export const QuadrantChart = ({
  data,
  xRange,
  yRange,
  quadrantsList,
  xLabel,
  yLabel,
  invertX,
  invertY,
  legendTitle,
  yLabelTop,
  yLabelBottom,
  xLabelLeft,
  xLabelRight,
  regression = {m: 1, b:10}
}) => {

  const { m, b} = regression;
  
  const svgRef = useRef(null);

  const uniqueMap = data.reduce((acc, curr) => {
    if (!acc[curr.name]) {
      acc[curr.name] = curr.color;
    }
    return acc;
  }, {});

  const legend = Object.entries(uniqueMap).map(([name, color]) => ({ name, color }));

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = {
      top: 20,
      right: 65,
      bottom: 50,
      left: 65,
    };

    // the chart ought to be wider than taller
    const width = 600 - (margin.left + margin.right);
    const height = 400 - (margin.top + margin.bottom);

    console.log('dentro', svgRef.current);
    const group = d3
      .select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left} ${margin.top})`);
    // const group = svgRef.current.append('g').attr('transform', `translate(${margin.left} ${margin.top})`);

    // scales
    // for both the x and y dimensions define linear scales, using the minimum and maximum values defined earlier
    const xScale = d3
      .scaleLinear()
      .domain(
        invertX
          ? [d3.extent(Object.values(xRange))[1], d3.extent(Object.values(xRange))[0]]
          : d3.extent(Object.values(xRange))
      )
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain(
        invertY
          ? [d3.extent(Object.values(yRange))[1], d3.extent(Object.values(yRange))[0]]
          : d3.extent(Object.values(yRange))
      )
      .range([height, 0]);

    // quadrants and labels
    // position four rectangles and text elements to divvy up the larger shape in four sections

    const quadrantsGroup = group.append('g').attr('class', 'quadrants');

    // include one group for each quadrant
    const quadrants = quadrantsGroup
      .selectAll('g.quadrant')
      .data(quadrantsList)
      .enter()
      .append('g')
      .attr('class', 'quadrant')
      // position the groups at the four corners of the viz
      .attr(
        'transform',
        (d, i) => `translate(${i % 2 === 0 ? 0 : width / 2} ${i < 2 ? 0 : height / 2})`
      );

    // for each quadrant add a rectangle and a label
    quadrants
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width / 2)
      .attr('height', height / 2)
      // include a darker shade for the third quadrant
      .attr('fill', () => 'hsl(0, 100%, 100%)')
      // highlight the second and third quadrant with less transparency
      .attr('opacity', () => 0.05);

    quadrants
      .append('text')
      .attr('x', width / 4)
      .attr('y', height / 4)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text((d) => d)
      .style('text-transform', 'uppercase')
      .style('font-weight', '300')
      .style('font-size', '0.9rem')
      .attr('opacity', 0.9);

    // legend
    // include the categories in the bottom right corner of the viz
    const legendGroup = group
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width + margin.right / 2}, ${margin.top})`);

    legendGroup
      .append('text')
      .attr('x', 0)
      .attr('y', -10) // Ajusta la posición vertical según sea necesario
      .style('font-size', '0.8rem') // Ajusta el tamaño del texto según sea necesario
      .style('font-weight', 'bold') // Opcional: Ajusta el peso del texto según sea necesario
      .text(legendTitle);

    // Agregar las leyendas
    const legendItems = legendGroup
      .selectAll('g.legend-item')
      .data(legend)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0 ${i * 15})`);

    legendItems
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 4)
      .attr('fill', ({ color }) => color);

    legendItems
      .append('text')
      .attr('x', 12)
      .attr('y', 0)
      .attr('dominant-baseline', 'middle')
      .text((d) => d.name)
      .style('font-size', '0.5rem')
      .style('letter-spacing', '0.05rem');

    // axes
    const xAxis = d3.axisBottom(xScale).tickFormat((d) => d);

    const yAxis = d3.axisLeft(yScale).tickFormat((d) => `${d}`);

    // add classes to later identify the axes individually and jointly
    group
      .append('g')
      .attr('transform', `translate(0 ${height})`)
      .attr('class', 'axis x-axis')
      .call(xAxis);

    group.append('g').attr('class', 'axis y-axis').call(yAxis);

    // remove the path describing the axes
    d3.selectAll('.axis').select('path').remove();

    // style the ticks to be shorter
    d3.select('.x-axis').selectAll('line').attr('y2', 5);

    d3.select('.y-axis').selectAll('line').attr('x2', -4);

    d3.selectAll('.axis').selectAll('text').attr('font-size', '0.55rem');

    // grid
    // include dotted lines for each tick and for both axes
    d3.select('.x-axis')
      .selectAll('g.tick')
      .append('path')
      .attr('d', `M 0 0 v -${height}`)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2')
      .attr('opacity', 0.3);

    d3.select('.y-axis')
      .selectAll('g.tick')
      .append('path')
      .attr('d', `M 0 0 h ${width}`)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2')
      .attr('opacity', 0.3);

    // labels
    // add a group to position the label where needed
    // for the percentage label, this allows to also modify the transform-origin as to rotate the label from the center of the axis
    d3.select('.x-axis')
      .append('g')
      .attr('class', 'label x-label')
      .attr('transform', `translate(${width / 2} ${margin.bottom})`);

    d3.select('g.x-label')
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .text(xLabel)
      .attr('text-anchor', 'middle');

    d3.select('.y-axis')
      .append('g')
      .attr('class', 'label y-label')
      .attr('transform', `translate(-${margin.left} ${height / 2})`);

    d3.select('g.y-label')
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .text(yLabel)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .attr('transform', 'rotate(-90)');

    // Agregar etiquetas adicionales en el eje X
    group
      .append('text')
      .attr('class', 'axis-label')
      .attr('x', 0)
      .attr('y', height + margin.bottom / 1.5) // Ajusta la posición vertical según sea necesario
      .attr('text-anchor', 'start') // Alinea el texto a la izquierda
      .text(xLabelLeft);

    group
      .append('text')
      .attr('class', 'axis-label')
      .attr('x', width)
      .attr('y', height + margin.bottom / 1.5) // Ajusta la posición vertical según sea necesario
      .attr('text-anchor', 'end') // Alinea el texto a la derecha
      .text(xLabelRight);

    // Agregar etiquetas adicionales en el eje Y
    group
      .append('text')
      .attr('class', 'axis-label')
      .attr('x', 0)
      .attr('y', -20)
      .attr('dy', -5) // Ajusta la posición vertical según sea necesario
      .attr('text-anchor', 'end') // Alinea el texto a la derecha
      .text(yLabelTop)
      .attr('transform', `rotate(-90)`); // Rota el texto para que esté vertical

    group
      .append('text')
      .attr('class', 'axis-label')
      .attr('x', -height)
      .attr('y', -20)
      .attr('dy', -5) // Ajusta la posición vertical según sea necesario
      .attr('text-anchor', 'start') // Alinea el texto a la izquierda
      .text(yLabelBottom)
      .attr('transform', `rotate(-90)`); // Rota el texto para que esté vertical

    // style both labels with a heavier weight
    d3.selectAll('g.label text')
      .style('font-size', '0.65rem')
      .style('font-weight', '600')
      .style('letter-spacing', '0.05rem');

    group
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', 1);

    group
      .append('line')
      .attr('x1', width / 2)
      .attr('y1', 0)
      .attr('x2', width / 2)
      .attr('y2', height)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', 'none');

    // Agregar línea horizontal en la mitad de la gráfica
    group
      .append('line')
      .attr('x1', 0)
      .attr('y1', height / 2)
      .attr('x2', width)
      .attr('y2', height / 2)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', 'none');

    // data points
    // add a group for each data point, to group circle and text elements
    const dataGroup = group.append('g').attr('class', 'data');

    const dataPointsGroup = dataGroup
      .selectAll('g.data-point')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'data-point')
      .attr('transform', ({ x, y }) => `translate(${xScale(x)} ${yScale(y)})`);

    // circles using the defined color
    dataPointsGroup
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5)
      .attr('fill', ({ color }) => color);

    // labels describing the circle elements
    dataPointsGroup
      .append('text')
      .attr('x', 8)
      .attr('y', 0)
      .attr('class', 'name')
      .text(({ name }, i) => `${name} ${i}`)
      .attr('dominant-baseline', 'central')
      .style('font-size', '0.55rem')
      .style('letter-spacing', '0.05rem')
      .style('pointer-events', 'none');

    // Calculate the points for the line y = mx + b

    const x1 = xScale.domain()[0];
    const x2 = xScale.domain()[1];
    const y1 = ((m * x1 + b) * 100) / xScale.domain()[1];
    const y2 = ((m * x2 + b) * 100) / xScale.domain()[1];

    // Append the line to the group
    group
      .append('line')
      .attr('x1', xScale(x1))
      .attr('y1', yScale(y1))
      .attr('x2', xScale(x2))
      .attr('y2', yScale(y2))
      .attr('stroke', 'gray')
      .attr('stroke-width', 1);

    // on hover highlight the data point
    dataPointsGroup
      .on('mouseenter', function () {
        // slightly translate the text to the left and change the fill color
        const text = d3.select(this).select('text.name');

        text
          .transition()
          .attr('transform', 'translate(12 0)')
          .style('color', 'hsl(230, 29%, 19%)')
          .style('text-shadow', 'none');

        /* as the first child of the group add another group in which to gather the elements making up the tooltip
            - rectangle faking the text's background
            - circle highlighting the selected data point
            - path elements connecting the circle to the values on the axes
            - rectangles faking the background for the labels on the axes
            - text elements making up the labels on the axes
            */
        const tooltip = d3
          .select(this)
          .insert('g', ':first-child')
          .attr('class', 'tooltip')
          .attr('opacity', 0)
          .style('pointer-events', 'none');

        // for the rectangle retrieve the width and height of the text elements to have the rectangle match in size
        const textElement = text['_groups'][0][0];
        const { x, y, width: textWidth, height: textHeight } = textElement.getBBox();

        tooltip
          .append('rect')
          .attr('x', x - 3)
          .attr('y', y - 1.5)
          .attr('width', textWidth + 6)
          .attr('height', textHeight + 3)
          .attr('fill', 'hsl(227, 9%, 81%)')
          .attr('rx', '2')
          .transition()
          // transition the rectangle to match the text translation
          .attr('transform', 'translate(12 0)');

        // include the two dotted lines in a group to centralize their common properties
        const dashedLines = tooltip
          .append('g')
          .attr('fill', 'none')
          .attr('stroke', 'hsl(227, 9%, 81%)')
          .attr('stroke-width', 2)
          // have the animation move the path with a stroke-dashoffset considering the cumulative value of a dash and an empty space
          .attr('stroke-dasharray', '7 4')
          // animate the path elements to perennially move toward the axes
          .style('animation', 'dashOffset 1.5s linear infinite');

        dashedLines.append('path').attr('d', ({ y }) => `M 0 0 v ${yScale(yRange.max - y)}`);

        dashedLines.append('path').attr('d', ({ x }) => `M 0 0 h -${xScale(x)}`);

        // include two labels centered on the axes, highlighting the matching values
        const labels = tooltip
          .append('g')
          .attr('font-size', '0.6rem')
          .attr('fill', 'hsl(227, 9%, 81%)');

        const labelCount = labels
          .append('g')
          .attr('transform', ({ y }) => `translate(0 ${yScale(yRange.max - y)})`);

        const textX = labelCount
          .append('text')
          .attr('x', 0)
          .attr('y', 0)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('color', 'hsl(230, 29%, 19%)')
          .text(({ x }) => x);

        const labelPercentage = labels
          .append('g')
          .attr('transform', ({ x }) => `translate(-${xScale(x)} 0)`);

        const textY = labelPercentage
          .append('text')
          .attr('x', 0)
          .attr('y', 0)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('color', 'hsl(230, 29%, 19%)')
          .text(({ y }) => `${y}`);

        // behind the labels include two rectangles, replicating the faux background specified for the original text element
        const { width: countWidth, height: countHeight } = textX['_groups'][0][0].getBBox();
        const { width: percentageWidth, height: percentageHeight } =
          textY['_groups'][0][0].getBBox();

        labelCount
          .insert('rect', ':first-child')
          .attr('x', -countWidth / 2 - 4)
          .attr('y', -countHeight / 2 - 2)
          .attr('width', countWidth + 8)
          .attr('height', countHeight + 4)
          .attr('rx', 3);

        labelPercentage
          .insert('rect', ':first-child')
          .attr('x', -percentageWidth / 2 - 4)
          .attr('y', -percentageHeight / 2 - 2)
          .attr('width', percentageWidth + 8)
          .attr('height', percentageHeight + 4)
          .attr('rx', 3);

        // detail a circle, with a darker fill and a larger radius
        tooltip
          .append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('fill', 'hsl(0, 0%, 0%)')
          .attr('stroke', 'hsl(227, 9%, 81%)')
          .attr('stroke-width', 2)
          .attr('r', 0)
          // transition the circle its full radius
          .transition()
          .attr('r', 9.5);

        // transition the tooltip to be fully opaque
        tooltip.transition().attr('opacity', 1);
      })
      // when exiting the hover state reset the appearance of the data point and remove the tooltip
      .on('mouseout', function () {
        d3.select(this)
          .select('text.name')
          .transition()
          .delay(100)
          .attr('transform', 'translate(0 0)')
          .style('color', 'inherit')
          .style('text-shadow', 'inherit');

        // remove the tooltip after rendering it fully transparent
        d3.select(this).select('g.tooltip').transition().attr('opacity', 0).remove();
      });
  }, [
    data,
    quadrantsList,
    xRange,
    yRange,
    xLabel,
    yLabel,
    legendTitle,
    yLabelTop,
    yLabelBottom,
    xLabelLeft,
    xLabelRight,
    invertX,
    invertY,
  ]);

  return (
    <svg
      ref={svgRef}
      width={600}
      height={400}
      viewBox={`0 0 ${600} ${400}`}
    ></svg>
  );
};
