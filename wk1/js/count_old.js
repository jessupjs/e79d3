'use strict';

/*
This is the a very simple way to get data and do something with D3.
 */

// Wrap in an immediately invoke function expression (IIFE) to keep variables scoped
(() => {

// Load our data asynchronously and then do something
    d3.csv('data/data_20200331.csv', function(d) {
        return d;
    }).then(function(d) {

        // Post results count
        d3.select('#topCounter')
            .html(`Results Count: <span>${d.length}</span>`);

    }).catch(err => console.log(err));

})();