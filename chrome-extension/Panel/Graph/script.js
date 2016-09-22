window.state = {};

const loaderElement = document.getElementById('loader')

const castrationInput = document.getElementById('castrationInput')

window.initiate = function(stateObj, isRefresh) {
  window.graph = new statechartGraph.Graph({
    metadata: stateObj,
    cfg: window.graph ? graph.cfg : {}
  });

  // Events
  window.graph.exportPathCallback = function(path) {
    document.getElementById('substateInput').value = path
  }
  window.graph.setBusyCallback = function(isBusy) {
    loaderElement.style.display = isBusy && !isRefresh ? "block" : "none"
  }

  if (typeof stateObj === 'object') {
    window.graph.buildTree();
  }

  document.getElementById("toggleEventsShowHide")
    .addEventListener("click", window.graph.toggleEvents.bind(window.graph), false)

  document.getElementById("toggleEnterExitHandlers")
    .addEventListener("click", window.graph.toggleEnterExitHandlers.bind(window.graph), false)

  document.getElementById('toggleAutoReload')
    .addEventListener('click', window.toggleAutoReload);

  castrationInput.addEventListener('change', () => {
    window.graph.cfg.castrationLevel = castrationInput.value
    window.graph.castrateState()
  })
};

initiate();
