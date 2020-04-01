'use strict';

/*
This is an object-oriented / modular approach to building with JS classes.
 */

class Count {

    // Els
    topCounterEl;

    // Configs
    resultsCount = 0;

    /*
    Constructor - builds a new object, including data / info passed over from main.js
     */
    constructor(_data, _target) {
        // Define fields
        this.data = _data;
        this.target = _target;

        // Call init
        this.init();
    }

    /*
    Init - manages the one-time operations before the building process becomes data-driven
     */
    init() {
        // Define this vis
        const vis = this;

        // Init topCounter from target
        vis.topCounterEl = d3.select(`#${vis.target}`);

        // Call wrangle
        vis.wrangle();
    }

    /*
    Wrangle - manages data structures and other configurations in preparation for rendering
     */
    wrangle() {
        // Define this vis
        const vis = this;

        // Update resultsCount from data
        vis.resultsCount = vis.data.length;

        // Call render
        vis.render();
    }

    /*
    Render - manages data binding and dom manipulation
     */
    render() {
        // Define this vis
        const vis = this;

        // Bind and modify - using 'datum' method to bind a single datum
        vis.topCounterEl.datum(vis.resultsCount)
            .text('Results Count: ')
            .append('span')
            .text(d => d);
    }

}

/*
Ref.
 https://github.com/d3/d3-selection/blob/v1.4.1/README.md#selection_datum
 */
