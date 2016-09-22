Upcoming work
--------------
[x] - highlight current active tab (bbox)
[x] - smart parse subStates
[x] - select node to be viewed from
[x] - expand active states
[x] - white background with a border for non-active state
[x] - make a button that triggers branchOff on each state
    * Made `contextmenu (right click)` trigger branchOff
[ ] - create a pane for stats and info
[x] - when branching off a state, dumps state path onto the input box (pre-route)
[x] - create a legend
      * dotted vs straight line
      * empty vs filled node
      * black vs light box
      * events
[x] - enter / exit indicator
[x] - castration
[ ] - ui format (lost context)
[ ] - performance (performance of rendering)
[ ] - remove node
[ ] - auto reload
[ ] - refactor ideas
      * [ ] break out linear logic so that using this in chrome devtool is same as using in sandbox just with different MidwareObject.
      * [ ] Change the behavior for loader so it shows up at the correct interval
      * [ ] consider sending a separate event for live reload, possible use path to send a smaller patch of Change.

Observed Improvable
-------------------
[ ] - event names stack, suggest for dynamically enlarge svg height
[x] - width can be increased
[x] - bold the line from `state.current().last` route
