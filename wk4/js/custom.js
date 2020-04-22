'use strict';

/*
Custom
 */

class Custom {

    // Vars
    sort = 'abc';
    filter_1 = 'all';
    filter_2 = 'all';
    filter_3 = 'all';

    // Elements
    svg = null;
    g = null;
    radialG = null;

    // Configs
    svgW = 960;
    svgH = 540;
    gMargin = {top: 0, right: 0, bottom: 0, left: 0};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);
    bigR = this.svgH / 4;
    bigRInc = 50
    lilR = this.bigR / 8;
    lilRDec = -4;
    curveInc = 0.33;
    whiteCircInc = 5;

    // Tools
    coordScale = d3.scaleLinear().range([Math.PI, -Math.PI]);
    colorScale = d3.scaleOrdinal()
        .range(['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'])
        .domain(['dat', 'des', 'dev']);
    lineMaker = d3.line().curve(d3.curveCardinal);

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

        // Create g's
        vis.radialG = vis.g.append('g')
            .attr('class', 'radialG')
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

        // Prepare display data / deep copy
        vis.displayData = JSON.parse(JSON.stringify(vis.data));
        console.log(vis.displayData);

        // Filter condition
        vis.displayData = vis.displayData.filter(d => {
            if (vis.filter_1 === 'all' || checkFilter(d.vis_align_1,vis.filter_1)) {
                console.log(vis.filter_1);
                if (vis.filter_2 === 'all' || checkFilter(d.vis_align_2, vis.filter_2)) {
                    if (vis.filter_3 === 'all' || checkFilter(d.vis_align_3, vis.filter_3)) {
                        return d;
                    }
                }
            }
        });

        /* function */
        function checkFilter(align, filter) {
            const abbrev = align.toLowerCase().substring(0, 3);
            return abbrev === filter;
        }

        // Sort condition
        if (vis.sort === 'abc') {
            vis.displayData.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                } else if (b.name > a.name) {
                    return 1;
                }
                return 0;
            })
        }

        // Config
        vis.coordScale.domain([0, vis.displayData.length]);

        // Now render
        vis.render();
    }

    /*
    3. Render
     */
    render() {
        // Define this vis
        const vis = this;

        // Vars
        let lineCoords = [];

        // Build radialG
        vis.radialG.selectAll('.userG')
            .data(vis.displayData, d => d.name)
            .join(
                // Enter
                enter => enter
                    .append('g')
                    .attr('class', 'userG')
                    .each(function(d, i) {
                        // Define this
                        const userG = d3.select(this);
                        // Reset lineCoords
                        lineCoords = [];
                        // Append line
                        const userPath = userG.append('path')
                            .attr('class', 'userPath');
                        // Append an alignG1
                        const alignG1 = userG.append('g')
                            .attr('class', 'alignG alignG1')
                        alignG1.transition()
                                .style('transform', getCoords(vis.bigR, i));
                        alignG1.append('circle')
                            .attr('class', 'whiteCirc whiteCirc1')
                            .attr('r', vis.lilR + vis.whiteCircInc)
                            .attr('fill', 'white');
                        alignG1.append('circle')
                            .attr('class', 'alignCirc alignCirc1')
                            .attr('r', vis.lilR)
                            .attr('fill', getFill(d.vis_align_1));
                        alignG1.append('text')
                            .attr('class', 'alignText')
                            .text(() => {
                                let initials = d.name.split(' ');
                                return initials[0].substring(0, 1) + initials[initials.length - 1].substring(0, 1);
                            });
                        // Append an alignG2
                        const alignG2 = userG.append('g')
                            .attr('class', 'alignG alignG2');
                        alignG2.transition()
                            .style('transform', getCoords(vis.bigR + vis.bigRInc, i + vis.curveInc));
                        alignG2.append('circle')
                            .attr('class', 'whiteCirc whiteCirc2')
                            .attr('r', vis.lilR + vis.lilRDec + vis.whiteCircInc)
                            .attr('fill', 'white');
                        alignG2.append('circle')
                            .attr('class', 'alignCirc alignCirc2')
                            .attr('r', vis.lilR + vis.lilRDec)
                            .attr('fill', getFill(d.vis_align_2));
                        // Append an alignG3
                        const alignG3 = userG.append('g')
                            .attr('class', 'alignG alignG3');
                        alignG3.transition()
                            .style('transform', getCoords(vis.bigR + vis.bigRInc * 2, i + vis.curveInc * 2));
                        alignG3.append('circle')
                            .attr('class', 'whiteCirc whiteCirc3')
                            .attr('r', vis.lilR + vis.lilRDec * 2 + vis.whiteCircInc)
                            .attr('fill', 'white');
                        alignG3.append('circle')
                            .attr('class', 'alignCirc alignCirc3')
                            .attr('r', vis.lilR + vis.lilRDec * 2)
                            .attr('fill', getFill(d.vis_align_3));
                        // Append line
                        userPath.transition().attr('d', vis.lineMaker(lineCoords));

                    }),
                // Update
                update => update
                    .each(function(d, i) {
                        // Define this
                        const userG = d3.select(this)
                        // Reset lineCoords
                        lineCoords = [];
                        // Append line
                        const userPath = userG.select('.userPath');
                        // Append an alignG1
                        const alignG1 = userG.select('.alignG1')
                            .transition()
                            .style('transform', getCoords(vis.bigR, i));
                        alignG1.select('.whiteCirc1')
                            .attr('r', vis.lilR + vis.whiteCircInc);
                        alignG1.select('.alignCirc1')
                            .attr('r', vis.lilR);
                        // Append an alignG2
                        const alignG2 = userG.select('.alignG2')
                            .transition()
                            .style('transform', getCoords(vis.bigR + vis.bigRInc, i + vis.curveInc));
                        alignG2.select('.whiteCirc2')
                            .attr('r', vis.lilR + vis.lilRDec + vis.whiteCircInc);
                        alignG2.select('.alignCirc2')
                            .attr('r', vis.lilR + vis.lilRDec);
                        // Append an alignG3
                        const alignG3 = userG.select('.alignG3')
                            .transition()
                            .style('transform', getCoords(vis.bigR + vis.bigRInc * 2, i + vis.curveInc * 2));
                        alignG3.select('.whiteCirc3')
                            .attr('r', vis.lilR + vis.lilRDec * 2 + vis.whiteCircInc);
                        alignG3.select('.alignCirc3')
                            .attr('r', vis.lilR + vis.lilRDec * 2);
                        // Append line
                        userPath.transition()
                            .attr('d', vis.lineMaker(lineCoords));
                    }),
                exit => exit.remove()

            )

        /* getCoords */
        function getCoords(r, i) {
            const x = Math.round(r * Math.sin(vis.coordScale(i)));
            const y = Math.round(r * Math.cos(vis.coordScale(i)));
            lineCoords.push([x, y])
            return `translate(${x}px, ${y}px)`;
        }

        /* getFill */
        function getFill(align) {
            const domain = align.toLowerCase().substring(0, 3);
            return vis.colorScale(domain);
        }

    }

    /*
    handle_filter_event
     */
    handle_filter_event(sel) {
        // Define this
        const vis = this;

        // Split and assign
        let split = sel.split('_');
        split[1] = split[1].toLowerCase().substring(0, 3);
        if (+split[0] === 1) {
            vis.filter_1 = split[1];
        } else if (+split[0] === 2) {
            vis.filter_2 = split[1];
        } else if (+split[0] === 3) {
            vis.filter_3 = split[1];
        }
        vis.wrangle();
    }
}