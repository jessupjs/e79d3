'use strict';

/*
Template
 */

class Template {

    // Elements
    svg = null;
    g = null;

    // Configs
    svgW = 960;
    svgH = 540;
    gMargin = {top: 0, right: 0, bottom: 0, left: 0};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.left);

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
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // Now wrangle
        vis.wrangle();
    }

    /*
    2. Wrangle
     */
    wrangle() {
        // Define this vis
        const vis = this;

        // Now render
        vis.render();
    }

    /*
    3. Render
     */
    render() {
        // Define this vis
        const vis = this;

    }
}