'use strict';

/*
Pie
 */

class Pie {

    // Elements
    svg = null;
    g = null;
    pieG = null;

    // Configs
    svgW = 120;
    svgH = 120;
    gMargin = {top: 0, right: 0, bottom: 0, left: 0};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);
    outerRadius = this.svgW / 2;
    innerRadius = this.outerRadius - 15;

    // Tools
    colorScale = d3.scaleOrdinal()
        .range(['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'])
        .domain(['dat', 'des', 'dev']);
    arc = d3.arc()
        .innerRadius(this.innerRadius)
        .outerRadius(this.outerRadius);
    pie = d3.pie()
        .value(d => d.value)
        .sort(null);

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

        // Append pie g
        vis.pieG = vis.g.append('g')
            .attr('class', 'pieG')
            .style('transform', `translate(${vis.gW / 2}px, ${vis.gH / 2}px)`);

        // Now wrangle
        vis.wrangle();
    }

    /*
    2. Wrangle
     */
    wrangle() {
        // Define this vis
        const vis = this;

        // Get displayData
        vis.displayData = d3.nest()
            .key(d => d.vis_align_1)
            .rollup(d => d.length)
            .entries(vis.data);

        // Now render
        vis.render();
    }

    /*
    3. Render
     */
    render() {
        // Define this vis
        const vis = this;

        // Append pie chart
        vis.pieG.selectAll('path')
            .data(vis.pie(vis.displayData))
            .join(
                enter => enter
                    .append('path')
                    .attr('class', 'piePath')
                    .attr('d', vis.arc)
                    .attr('fill', d => {
                        const domain = d.data.key.substring(0, 3).toLowerCase();
                        return vis.colorScale(domain);
                    })
            )

    }
}