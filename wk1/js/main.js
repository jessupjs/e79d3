'use strict';

// Init objects
let count = null;

// Load our data
d3.csv('data/data_20200331.csv', function(d) {
    return d;
}).then(function(d) {

    // Instantiate w variables(data, target)
    count = new Count(d, 'topCounter');

});