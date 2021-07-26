import {LitElement, html, css, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {ref, createRef, RefOrCallback} from 'lit/directives/ref.js';

export type ChartResultEntry = {time: string; value: number};
export type ChartResult = {name: string; values: ChartResultEntry[]};

// import * as d3 from 'd3';

/**
 */
@customElement('m-chart')
export class MChart extends LitElement {
  @property({type: Array})
  data: Array<ChartResult> = [];

  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }

    .render-canvas svg {
      overflow: visible;
      margin-left: 20px;
    }
  `;

  protected refs: {[key: string]: RefOrCallback} = {
    canvas: createRef<HTMLDivElement>(),
  };

  private __getYUpperBounds({data}: {data: ChartResult[]}) {
    const dataClone: ChartResult[] = [...data];
    const maxYValue = Math.max(
      ...dataClone.map(
        (d) => d.values.sort((a, b) => b.value - a.value)[0].value
      )
    );
    const multipliedYval = maxYValue * 1.2; // add some headroom
    const upperYValue = multipliedYval - (multipliedYval % 50000); // make it a round number
    return {upperYValue, maxYValue};
  }

  protected _createChart() {
    this.refs.canvas.value.innerHTML = '';
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 100, bottom: 30, left: 30},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(this.refs.canvas.value)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const dat = this.data;
    const {upperYValue} = this.__getYUpperBounds({data: dat});

    const dataReady = dat;
    const allGroup = dataReady.map((d) => d.name);

    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal().domain(allGroup).range(d3.schemeSet2);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear().domain([0, 30]).range([0, width]);
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear().domain([0, upperYValue]).range([height, 0]);
    svg.append('g').call(d3.axisLeft(y));

    // Add the lines
    const line = d3
      .line()
      .x((d) => x(+d.time))
      .y((d) => y(+d.value));

    svg
      .selectAll('myLines')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('class', (d) => d.name)
      .attr('d', (d) => line(d.values))
      .attr('stroke', (d) => myColor(d.name))
      .style('stroke-width', 4)
      .style('fill', 'none');

    // create a tooltip
    const Tooltip = d3
      .select('#my_dataviz')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px');

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (d) {
      Tooltip.style('opacity', 1);
    };
    const mousemove = function (d) {
      Tooltip.html('Exact value: ' + d.value)
        .style('left', d3.mouse(this)[0] + 70 + 'px')
        .style('top', d3.mouse(this)[1] + 'px');
    };
    const mouseleave = function (d) {
      Tooltip.style('opacity', 0);
    };

    // Add the points
    svg
      // First we need to enter in a group
      .selectAll('myDots')
      .data(dataReady)
      .enter()
      .append('g')
      .style('fill', (d) => myColor(d.name))
      .attr('class', (d) => d.name)
      // Second we need to enter in the 'values' part of this group
      .selectAll('myPoints')
      .data((d) => d.values)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.time))
      .attr('cy', (d) => y(d.value))
      .attr('r', 5)
      .attr('stroke', 'white')
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave);

    // Add a label at the end of each line
    svg
      .selectAll('myLabels')
      .data(dataReady)
      .enter()
      .append('g')
      .append('text')
      .attr('class', (d) => d.name)
      .datum((d) => ({name: d.name, value: d.values[d.values.length - 1]})) // keep only the last value of each time series
      .attr(
        'transform',
        (d) => 'translate(' + x(d.value.time) + ',' + y(d.value.value) + ')'
      ) // Put the text at the position of the last point
      .attr('x', 12) // shift the text a bit more right
      .text((d) => d.name)
      .style('fill', (d) => myColor(d.name))
      .style('font-size', 15);

    // Add a legend (interactive)
    svg
      .selectAll('myLegend')
      .data(dataReady)
      .enter()
      .append('g')
      .append('text')
      .attr('x', (d, i) => 30 + i * 60)
      .attr('y', 30)
      .text((d) => d.name)
      .style('fill', (d) => myColor(d.name))
      .style('font-size', 15)
      .on('click', (d) => {
        // is the element currently visible ?
        const currentOpacity = svg.selectAll('.' + d.name).style('opacity');
        // Change the opacity: from 0 to 1 or from 1 to 0
        svg
          .selectAll('.' + d.name)
          .transition()
          .style('opacity', currentOpacity == 1 ? 0 : 1);
      });
    //   }
    // );
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('data') && this.data.length) {
      this._createChart();
    }
  }

  render() {
    return html`<div class="render-canvas" ${ref(this.refs.canvas)}></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm-chart': MChart;
  }
}
