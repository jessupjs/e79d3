'use strict';

/*
Scatter
 */

class Scatter {

    // Elements
    svg = null;
    g = null;
    scatterG = null;

    // Configs
    svgW = 500;
    svgH = 400;
    gMargin = {top: 50, right: 30, bottom: 70, left: 70};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);
    plotR = 5;
    xAxisOffset = 15;
    yAxisOffset = -10;
    xLabelOffset = 40;
    yLabelOffset = this.yAxisOffset - 30;

    // Tools
    yScale = d3.scaleLinear()
        .range([this.gH, 0]);
    xScale = d3.scaleLinear()
        .range([0, this.gW]);
    colorScale = d3.scaleOrdinal()
        .range(['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'])
        .domain(['dat', 'des', 'dev']);
    yAxis = d3.axisLeft().ticks(5);
    xAxis = d3.axisBottom();

    // Init
    hoursFilter = '';

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

        // Create scatterG, axisG
        vis.scatterG = vis.g.append('g')
            .attr('class', 'scatterG');
        vis.xAxisG = vis.g.append('g')
            .style('transform', `translateY(${vis.gH + vis.xAxisOffset}px)`)
            .attr('class', 'axisG');
        vis.yAxisG = vis.g.append('g')
            .style('transform', `translateX(${vis.yAxisOffset}px)`)
            .attr('class', 'axisG');

        // Write labels
        vis.xAxisG.append('text')
            .attr('class', 'labelText text')
            .style('transform', `translate(${vis.gW / 2}px, ${vis.xLabelOffset}px)`)
            .text('Yrs Professional Exp');
        vis.yAxisG.append('text')
            .attr('class', 'labelText text')
            .style('transform', `rotate(270deg) translate(${-vis.gH / 2}px, ${vis.yLabelOffset}px)`)
            .text('Yrs Programming Exp');

        // Now wrangle
        vis.wrangle();
    }

    /*
    2. Wrangle
     */
    wrangle() {
        // Define this vis
        const vis = this;
        console.log('// Data');
        console.log(vis.data);

        // Define displayData
        if (vis.hoursFilter !== '') {
            vis.displayData = vis.data.filter(d => d.min_time_constraint === +vis.hoursFilter);
        } else {
            vis.displayData = vis.data.filter(d => d);
        }

        // Config
        vis.xScale.domain([0, Math.ceil(d3.max(vis.data, d => d.years_prof_exp))]);
        if (vis.xScale.domain()[1] % 2 !== 0) {
            vis.xScale.domain([0, vis.xScale.domain()[1] + 1]);
        }
        vis.yScale.domain([0, d3.max(vis.data, d => d.years_prog_exp_adj)]);
        vis.xAxis.scale(vis.xScale);
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

        // Build scatterG
        vis.scatterG.selectAll('.plotCirc')
            .data(vis.displayData, d => d.name)
            .join(
                enter => enter
                    .each(function(d) {})
                    .append('circle')
                    .attr('class', 'plotCirc')
                    .attr('r', vis.plotR)
                    .each(function(d) {
                        // Define this
                        const plotCirc = d3.select(this);
                        // Add properties
                        plotCirc.transition()
                            .attr('cx', d => vis.xScale(d.years_prof_exp))
                            .attr('cy', d => vis.yScale(d.years_prog_exp_adj))
                            .attr('fill', d => {
                                if (d.hasOwnProperty('vis_align_1')) {
                                    const domain = d.vis_align_1.substring(0, 3).toLowerCase();
                                    return vis.colorScale(domain);
                                }
                                return 'rgb(0, 0, 0)';
                            })
                    }),
                update => update
                    .transition()
                    .duration(1000)
                    .attr('cx', d => vis.xScale(d.years_prof_exp))
                    .attr('cy', d => vis.yScale(d.years_prog_exp_adj)),
                exit => exit.remove().transition()
            );

        // Build axes
        vis.xAxisG.transition().call(vis.xAxis);
        vis.yAxisG.transition().call(vis.yAxis);

    }
}