window.state = {};

const loaderElement = document.getElementById('loader')

window.initiate = function(stateObj) {
  window.graph = new statechartGraph.Graph({ metadata: stateObj });

  // Events
  window.graph.exportPathCallback = function(path) {
    document.getElementById('substateInput').value = path
  }
  window.graph.setBusyCallback = function(isBusy) {
    loaderElement.style.display = isBusy ? "block" : "none"
  }

  window.graph.buildTree();

  document.getElementById("toggleEventsShowHide")
    .addEventListener("click", window.graph.toggleEvents.bind(window.graph), false)
};

initiate();
