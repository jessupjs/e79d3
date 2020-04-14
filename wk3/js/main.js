'use strict';

// Init objects
let count = null;
let bars = null;
let pie = null;
let scatter = null;

// Load our data
d3.csv('data/data_20200407.csv', function (d) {

    // Mod/parse data
    d.years_prog_exp_adj = 0;
    if (d.hasOwnProperty('years_prog_exp') && (d.years_prog_exp.toLowerCase() !== 'n/a' && d.years_prog_exp !== '')) {
        d.years_prog_exp_adj = +d.years_prog_exp;
    }
    d.years_prof_exp = Math.random() * 19;
    d.min_time_constraint = +d.time_constraint.split('-')[0];
    d.time_constraint = +d.time_constraint;

    return d;

}).then(function (d) {

    // Instantiate w variables(data, target)
    count = new Count(d, 'topCounter');
    bars = new Bars(d, 'bars');
    pie = new Pie(d, 'pie');
    scatter = new Scatter(d, 'scatter');

}).catch(err => console.log(err));