'use strict';

/*
Radar
 */

class Radar {

    // Elements
    svg = null;
    g = null;

    // Configs
    svgW = 400;
    svgH = 400;
    gMargin = {top: 0, right: 0, bottom: 0, left: 0};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);
    r = this.svgH / 2 * 0.8;
    attrMax = 100;

    // Tools
    coordScale = d3.scaleLinear()
        .range([Math.PI, -Math.PI]);
    yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, this.r]);
    colorScale = d3.scaleLinear()
        .range(['red', 'blue']);
    lineMaker = d3.line();

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

        // Draw outline
        vis.backboardG = vis.g.append('g')
            .attr('class', 'backboardG')
            .style('transform', `translate(${vis.gW / 2}px, ${vis.gH / 2}px)`);
        // Draw shapes
        vis.shapesG = vis.g.append('g')
            .attr('class', 'shapesG')
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
        console.log('// Radar data')
        console.log(vis.data);

        // Get keyData
        vis.keyData = Object.keys(vis.data[0]).filter(d => d !== 'team');
        vis.keyData = vis.keyData.map((d, i) => {
            return {index: i, attr: d};
        });

        // Config, i
        vis.coordScale.domain([0, vis.keyData.length]);

        // Add properties to position coords
        vis.displayData = JSON.parse(JSON.stringify(vis.data));
        vis.displayData.forEach(d => {
            d.coords = [];
            let counter = 0;
            vis.keyData.forEach(k => {
                if (d.hasOwnProperty(k.attr)) {
                    const value = d[k.attr];
                    const r = vis.yScale(value);
                    const x = Math.round(r * Math.sin(vis.coordScale(counter)));
                    const y = Math.round(r * Math.cos(vis.coordScale(counter)));
                    d.coords.push([x, y]);
                }
                counter++;
            });
        });

        // Config, ii
        vis.colorScale.domain([1, vis.displayData.length]);

        // Now render
        vis.render();
    }

    /*
    3. Render
     */
    render() {
        // Define this vis
        const vis = this;

        // Draw backboardG
        vis.backboardG.selectAll('.line')
            .data(vis.keyData)
            .join('g')
            .attr('class', 'lineG')
            .each(function(d, i) {
                // Define this
                const lineG = d3.select(this);
                // Discover coords
                const x0 = 0;
                const y0 = 0;
                const x1 = Math.round(vis.r * Math.sin(vis.coordScale(d.index)));
                const y1 = Math.round(vis.r * Math.cos(vis.coordScale(d.index)));
                // Draw line
                lineG.append('line')
                    .attr('class', 'line')
                    .attr('x0', x0)
                    .attr('x1', x1)
                    .attr('y0', y0)
                    .attr('y1', y1);
                // Draw label
                lineG.append('g')
                    .attr('class', () => {
                        if (x1 > 0 && y1 < 0) {
                            return 'radarLabel rLabelQ1';
                        } else if (x1 < 0 && y1 < 0) {
                            return 'radarLabel rLabelQ2';
                        } else if (x1 < 0 && y1 > 0) {
                            return 'radarLabel rLabelQ3';
                        } else if (x1 > 0 && y1 > 0) {
                            return 'radarLabel rLabelQ4';
                        }
                        return 'radarLabel'
                    })
                    .style('transform', `translate(${x1}px, ${y1}px)`)
                    .append('text')
                    .text(d.attr);

            });

        // Draw shapesG
        vis.shapesG.selectAll('.shapeG')
            .data(vis.displayData)
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'shapeG')
                    .each(function(d, i) {
                        // Define this
                        const shapeG = d3.select(this);
                        // Draw path
                        shapeG.append('path')
                            .attr('class', 'shapePath')
                            .attr('fill', vis.colorScale(d.team))
                            .attr('d', vis.lineMaker(d.coords));
                    })
            )



    }
}