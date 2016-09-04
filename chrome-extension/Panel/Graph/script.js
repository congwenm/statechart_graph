window.state = {};

window.initiate = function(stateObj) {
  window.graph = new statechartGraph.Graph({ metadata: stateObj });
  window.graph.buildTree();


  // Events
  window.graph.exportPathCallback = function(path) {
    document.getElementById('substateInput').value = path
  }

  document.getElementById("toggleEventsShowHide")
    .addEventListener("click", window.graph.toggleEvents, false)
};

initiate();
