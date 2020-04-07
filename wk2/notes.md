## Notes, wk.2

1. D3 Pattern 1, "init-wrangle-render"
<br>a. `init()`: one-time setup operations
<br>b. `wrangle()`: data organization
<br>c. `render()`: DOM interaction
 
2. Important tools
<br>a. Continuous scales ([docs](https://github.com/d3/d3-scale/tree/v2.2.2#continuous-scales))
<br>&nbsp;&nbsp;i. Linear, Power, Log, Identity, Time
<br>&nbsp;&nbsp;ii. Input using`.domain([domain])`
<br>&nbsp;&nbsp;iii. Output using `.range([range])`
<br>b. Axes ([docs](https://github.com/d3/d3-axis/tree/v1.0.12#api-reference))
<br>&nbsp;&nbsp;i. Position using `d3.axisTop()`, `d3.axisRight()`, `d3.axisBottom()`, `d3.axisLeft()`
<br>&nbsp;&nbsp;ii. Scale by chaining `.scale(scale)`
<br>&nbsp;&nbsp;iii. Format by chaining `.ticks(configs)`
<br>&nbsp;&nbsp;iv. Execute using `selection.call(axis)`
 
3. D3 Pattern 2, "enter-update-exit"
<br>a. Managing change in data with `selection.join(enter, update, exit)` ([docs](https://github.com/d3/d3-selection/blob/v1.4.1/README.md#selection_join))
<br>&nbsp;&nbsp;i. enter => enter (added elements)
<br>&nbsp;&nbsp;ii. update => update (existing elements)
<br>&nbsp;&nbsp;iii. exit => exit (existing elements)
<br>b. Anchoring selections in `.data(data, d => d.key)`
 
  