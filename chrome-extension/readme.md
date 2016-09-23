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
[x] - auto reload
[x] - reinstate substatepath so we can send a small portion of the changes.
[x] - consider sending a separate event for live reload, possible use path to send a smaller patch of Change.
[ ] - Change the behavior for loader so it shows up at the correct interval
[x] - break out linear logic so that using this in chrome devtool is same as using in sandbox just with different MidwareObject.


Things needed to be considered for extracting middleware/bridge for chrome-extension vs sandbox
- receiveState from (chrome page / sandbox)
- receiveMessage from (chrome page / sandbox) - will be used for rendering path changes

- requestState from (chrome devtool / sandbox dev devtool)
- requestMessage from (chrome devtool / sandbox dev devtool)
