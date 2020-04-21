## Notes, wk.3
 
1. D3 Pattern 2, "enter-update-exit"
<br>a. Managing change in data with `selection.join(enter, update, exit)` ([docs](https://github.com/d3/d3-selection/blob/v1.4.1/README.md#selection_join))
<br>&nbsp;&nbsp;i. enter => enter (added elements)
<br>&nbsp;&nbsp;ii. update => update (existing elements)
<br>&nbsp;&nbsp;iii. exit => exit (existing elements)
<br>b. Anchoring selections in `.data(data, d => d.key)`
 
  