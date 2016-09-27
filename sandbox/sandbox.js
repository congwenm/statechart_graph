// Most of this is going to be abstract and does provide any real value,
// the purpose is to make it accept same input as the `middleware` of chrome-extension/../panel.js

// Instantiated on page load
window.StatechartMiddlewareSingleton = (function() {
  var instance;

  // Constructor, aka initiation
  function StatechartMiddleware({ panelWindow }) {

    this.globalVarInput = document.getElementById('globalVarInput')
    this.loadGraphBtn = document.getElementById('loadGraphBtn')
    this.substateInput = document.getElementById('substateInput')


    this.loaderElement = document.getElementById('loader')
    this.castrationInput = document.getElementById('castrationInput')

    this.toggleEventsShowHide = document.getElementById("toggleEventsShowHide")
    this.toggleEnterExitHandlers = document.getElementById("toggleEnterExitHandlers")
    this.toggleAutoReloadBtn = document.getElementById('toggleAutoReloadBtn')


    this.loadGraphBtn.addEventListener('click', (e) => {
      this.requestState(this.globalVarInput.value, this.substateInput.value)
    });
  }

  Object.assign(StatechartMiddleware.prototype, {

    // COMMUNICATION TO THE APPLICATION
    requestState(globalVar, substatesPath) {
      // all that background.js relay and stuff all shrinked into this
      console.debug('request path', 'word', substatesPath)
      window.statechartAnalyzer.sendState('word', substatesPath)
    },

    updateSubstatesPath(path) {
      window.statechartAnalyzer._cachedSubstatesPath = path
    },

    receiveRootstate(output) {
      // this.initiate(window.cmm_state, output.isRefresh) // intercepting the response
      this.initiate(output.state, output.substatesPath, output.isRefresh)
    },
    receiveRootstateActiveness(output) {
      this.graph.changeActive(output.state, output.substatesPath);
    },

    toggleAutoReload(swich) {
      window.statechartAnalyzer.toggleAutoReload(swich)
    },

    // COMMUNIATION TO THE GRAPH
    initiate(stateObj, substatesPath, isRefresh) {
      this.graph = new statechartGraph.Graph({
        metadata: stateObj,
        substatesPath,
        cfg: this.graph && this.graph.cfg,
        controlPanel: this
      })

      // this.loadGraphBtn.addEventListener('click', this.graph.reinitiateRoot.bind(this.graph))
      this.castrationInput.addEventListener('change', ()=> {
        this.graph.cfg.castrationLevel = castrationInput.value
        this.graph.castrateState()
      })

      this.graph.exportPathCallback = (path) => {
        this.substateInput.value = path
      }

      this.graph.setBusyCallback = (isBusy) => {
        this.loaderElement.style.display = isBusy ? 'block' : 'none'
      }

      this.toggleEventsShowHide.addEventListener(
        'click', (e) => this.graph.toggleEvents()
      );

      this.toggleEnterExitHandlers.addEventListener(
        'click', this.graph.toggleEnterExitHandlers.bind(this.graph), false
      );

      this.toggleAutoReloadBtn.addEventListener('click', (e) =>  {
        this.toggleAutoReload(e.target.checked)
      });

      this.graph.buildTree()
      this.toggleAutoReloadBtn.click()
    }
  });

  return {
    getInstance() {
      if(!instance) {
        instance = new StatechartMiddleware(...arguments)
      }
      return instance;
    }
  }
}())

window.statechartMiddleware = StatechartMiddlewareSingleton.getInstance({
  panelWindow: window
})

statechartMiddleware.requestState()

// testing
// window.hotkey.register(['q', 'e', 'w'], () => {
//   const clickElement = (elem) => (
//     () => elem.dispatchEvent(new MouseEvent('click'))
//   )
//   let nodes = document.querySelectorAll('g.node')
//   let root = nodes[0]
//   let firstChild = nodes[1]

//   setTimeout(clickElement(root), 0);
//   setTimeout(clickElement(root), 800);
//   setTimeout(clickElement(firstChild), 1300);
//   setTimeout(clickElement(firstChild), 2300);
// }, {
//   continuous: true
// });
