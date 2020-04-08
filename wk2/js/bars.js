'use strict';

/*
Bars
 */

class Bars {

    // Elements
    svg = null;
    g = null;
    barsG = null;
    xAxisG = null;
    yAxisG = null;

    // Configs
    svgW = 500;
    svgH = 400;
    gMargin = {top: 50, right: 50, bottom: 100, left: 100};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.left);
    barG_w = 0;
    barRect_wPct = 0.75;
    barRect_w = 0;
    xLabelOffset = 20;
    xAxisOffset = 50;
    yAxisOffset = -20;

    // Tools
    yScale = d3.scaleLinear()
        .range([this.gH, 0]);
    xScale = d3.scaleLinear()
        .range([0, this.gW]);
    yAxis = d3.axisLeft();


    /*
    Constructor
     */
    constructor(_data, _target) {
        // Assign parameters as object fields
        this.data = _data;
        this.target = _target;

        // Now init
        this.init();
    }

    /*
    1. Init
     */
    init() {
        // Define this vis
        const vis = this;

        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)
            .append('svg')
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // Create barsG, axisG
        vis.barsG = vis.g.append('g')
            .attr('class', 'barsG');
        vis.xAxisG = vis.g.append('g')
            .style('transform', `translateY(${vis.gH + vis.xAxisOffset}px)`)
            .attr('class', 'axisG');
        vis.yAxisG = vis.g.append('g')
            .style('transform', `translateX(${vis.yAxisOffset}px)`)
            .attr('class', 'axisG');

        // Write labels
        vis.xAxisG.append('text')
            .attr('class', 'labelText text')
            .style('transform', `translateX(${vis.gW / 2}px)`)
            .text('Min Project Hrs/Wk');
        vis.yAxisG.append('text')
            .attr('class', 'labelText text')
            .style('transform', `rotate(270deg) translate(${-vis.gH / 2}px, ${vis.yAxisOffset * 2}px)`)
            .text('# of Responses');

        // Now wrangle
        vis.wrangle();
    }

    /*
    2. Wrangle
     */
    wrangle() {
        // Define this vis
        const vis = this;

        // Create new data property called min_time_constraint
        vis.data.forEach(d => {
            d.min_time_constraint = +d.time_constraint.split('-')[0];
        });

        // Nest into displayData
        vis.displayData = d3.nest()
            .key(d => d.min_time_constraint)
            .rollup(d => d.length)
            .entries(vis.data);
        vis.displayData.sort((a, b) => a.key - b.key);

        // Config
        vis.barG_w = Math.round(vis.gW / vis.displayData.length);
        vis.barRect_w = Math.round(vis.barG_w * vis.barRect_wPct);
        vis.yScale.domain([0, d3.max(vis.displayData, d => d.value)]);
        vis.xScale.domain([0, vis.displayData.length]);
        vis.yAxis.scale(vis.yScale);

        // Now render
        vis.render();
    }

    /*
    3. Render
     */
    render() {
        // Define this vis
        const vis = this;

        // Build barsG
        vis.barsG.selectAll('.barG')
            .data(vis.displayData)
            .join(
                // Enter
                enter => enter
                    .append('g')
                    .attr('class', 'barG')
                    .each(function (d, i) {
                        // Define this barG
                        const barG = d3.select(this)
                            .attr('width', vis.barG_w)
                            .style('transform', `translateX(${Math.round(vis.xScale(i))}px)`);
                        // Append rect element
                        barG.append('rect')
                            .attr('class', 'barRect')
                            .attr('x', Math.round((vis.barG_w - vis.barRect_w) / 2))
                            .attr('y', Math.round(vis.yScale(d.value)))
                            .attr('width', vis.barRect_w)
                            .attr('height', Math.round(vis.gH - vis.yScale(d.value)));
                        // Append text label
                        barG.append('text')
                            .attr('class', 'barText text')
                            .attr('x', vis.barG_w / 2)
                            .attr('y', vis.gH + vis.xLabelOffset)
                            .text(d.key)
                    })
            );

        // Build axis
        vis.yAxisG.call(vis.yAxis);
    }
}