'use strict';

// Init objects
let count = null;
let bars = null;
let pie = null;
let scatter = null;
let custom = null;

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

    // Eventually with new load
    custom = new Custom(d, 'custom');

}).catch(err => console.log(err));

// Build data structure and add dummies
const radarData = [];
for (let i = 1; i < 4; i++) {
    radarData.push(
        {team: i, radness: getRandom(), badness: getRandom(), gladness: getRandom(), sadness: getRandom(), madness: getRandom()}
    )
}

/*
getRandom() - generates mock data (between 50 - 100)
 */
function getRandom() {
    return Math.round(Math.random() * 50 + 50);
}

// Instantiate Radar object
const radar = new Radar(radarData, 'radar');

/*
filterCustom()
 */
function filterCustom(sel) {
    custom.handle_filter_event(sel.value);
}

/*
updateScatter()
 */
function updateScatter(e) {
    // Set data object
    const eventData = e;
    // Init same
    let same = false;
    // Evaluate
    if (e.key === scatter.hoursFilter) {
        scatter.hoursFilter = ''
        same = true
    } else {
        scatter.hoursFilter = e.key;
    }
    // Re-wrangle data
    scatter.wrangle();

    return same;
}