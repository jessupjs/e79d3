'use strict';

// Init objects
let count = null;
let bars = null;

// Load our data
d3.csv('data/data_20200407.csv', function(d) {
    return d;
}).then(function(d) {

    // Instantiate w variables(data, target)
    count = new Count(d, 'topCounter');
    bars = new Bars(d, 'bars');

});