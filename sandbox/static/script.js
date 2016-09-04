const {Graph, serialize} = statechartGraph;

function setup() {
  window.stateObj = serialize(window.word);

  window.graph = new Graph({ metadata: window.stateObj })
  // graph.initiate();
  window.graph.buildTree();
}

setup();

document.getElementById('loadGraphBtn')
  .addEventListener('click', graph.reinitiateRoot.bind(graph))


const substateInput = document.getElementById('substateInput')
window.graph.exportPathCallback = function(path) {
  substateInput.value = path
}


 // testing
window.hotkey.register(['q', 'e', 'w'], () => {
  const clickElement = (elem) => (
    () => elem.dispatchEvent(new MouseEvent('click'))
  )
  let nodes = document.querySelectorAll('g.node')
  let root = nodes[0]
  let firstChild = nodes[1]

  setTimeout(clickElement(root), 0);
  setTimeout(clickElement(root), 800);
  setTimeout(clickElement(firstChild), 1300);
  setTimeout(clickElement(firstChild), 2300);
}, {
  continuous: true
});
