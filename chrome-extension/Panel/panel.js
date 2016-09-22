// From this point on create a middleware that takes care of handling `resonses` and `request` instead of jumping through portals

// Instantiated when devtool is shown,
// TODO: check that this is not invoked over and over each time user load the statechart tab
window.StatechartMiddlewareSingleton = (function () {
  var instance;

  function StatechartMiddleware({ panelWindow, devtools }) {
    this.panelWindow = panelWindow;
    this.devtools = devtools;

    this.globalVarInput = document.getElementById('globalVarInput')
    this.loadGraphBtn = document.getElementById('loadGraphBtn')
    this.substateInput = document.getElementById('substateInput')

    this.loaderElement = document.getElementById('loader')
    this.castrationInput = document.getElementById('castrationInput')

    this.toggleEventsShowHide = document.getElementById("toggleEventsShowHide")
    this.toggleEnterExitHandlers = document.getElementById("toggleEnterExitHandlers")
    this.toggleAutoReloadBtn = document.getElementById('toggleAutoReloadBtn')



    // createChannel, listen for relayed messages
    this.port = chrome.extension.connect({ name: 'statechart' });

    // receive root and receive root activeness
    this.port.onMessage.addListener((message) => {
      if (message.type === 'activeness') {
        this.graph.changeActive(message.state, message.substatesPath)
      } else {
        this.initiate(message.state, message.substatesPath, message.isRefresh)
      }
    })

    this.loadGraphBtn.addEventListener('click', (e) => {
      console.log('CLICKED BUTTON', this.requestState, this.globalVarInput.value);
      this.requestState(this.globalVarInput.value, this.substateInput.value);
    })
  }

  Object.assign(StatechartMiddleware.prototype, {

    // communicate to the application
    // overriding defaulting '' to undefined
    requestState(globalVar, substatesPath) {
      globalVar = globalVar ? `'${globalVar}'` : undefined
      substatesPath = substatesPath ? `'${substatesPath}'` : undefined

      console.log('REQUESTING STATE', globalVar, substatesPath)
      this.devtools.inspectedWindow.eval(
        `statechartAnalyzer.sendState(${globalVar}, ${substatesPath})`
      );
    },
    toggleAutoReload(swich) {
      this.devtools.inspectedWindow.eval(
        `statechartAnalyzer.toggleAutoReload(${!!swich})`
      );
    },

    updateSubstatesPath(path) {
      this.devtools.inspectedWindow.eval(
        `statechartAnalyzer._cachedSubstatesPath = '${path}'`
      );
    },

    // communicate to the graph
    initiate(stateObj, substatesPath, isRefresh) {
      this.graph = new statechartGraph.Graph({
        metadata: stateObj,
        substatesPath,
        cfg: this.graph && this.graph.cfg,
        controlPanel: this
      });

      this.graph.exportPathCallback = (path) => {
        this.substateInput.value = path
      };

      this.graph.setBusyCallback = (isBusy) => {
        this.loaderElement.style.display = isBusy && !isRefresh ? "block" : "none"
      };

      if (typeof stateObj === 'object') {
        this.graph.buildTree();
      }

      this.toggleEventsShowHide.addEventListener(
        'click', this.graph.toggleEvents.bind(this.graph)
      );

      this.toggleEnterExitHandlers.addEventListener(
        'click', this.graph.toggleEnterExitHandlers.bind(this.graph), false
      );

      this.toggleAutoReloadBtn.addEventListener('click', (e) => {
        this.toggleAutoReload(e.target.checked)
      });

      this.castrationInput.addEventListener('change', () => {
        this.graph.cfg.castrationLevel = this.castrationInput.value
        this.graph.castrateState()
      });
    },
  });

  return {
    getInstance () {
      if (!instance) {
        instance = new StatechartMiddleware(...arguments)
      }
      return instance;
    },
  }
}())
