'use strict';

// Load our data
d3.csv('data/data_20200331.csv', function(d) {
    return d;
}).then(function(d) {

    // Define data
    const data = d;

    // Count entries
    const entryCount = data.length;

    // Post results count
    const topCounter = d3.select('#topCounter')
       .text('Results Count: ' + entryCount);

});