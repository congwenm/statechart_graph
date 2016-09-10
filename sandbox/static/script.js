const {Graph, serialize} = statechartGraph;

const substateInput = document.getElementById('substateInput')

const loaderElement = document.getElementById('loader')

const castrationInput = document.getElementById('castrationInput')

function setup() {
  // window.stateObj = serialize(window.word);
  window.stateObj = window.cmm_state;

  window.graph = new Graph({ metadata: window.stateObj })

  // events
  document.getElementById('loadGraphBtn').addEventListener('click', ()=> {
    graph.reinitiateRoot()
  })

  castrationInput.addEventListener('change', () => {
    graph.cfg.castrationLevel = castrationInput.value
    graph.castrateState()
  })

  window.graph.exportPathCallback = function(path) {
    substateInput.value = path
  }

  window.graph.setBusyCallback = function(isBusy) {
    loaderElement.style.display = isBusy ? "block" : "none"
  }

  window.graph.buildTree();
}


setup();

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
