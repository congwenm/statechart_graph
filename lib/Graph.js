// import './external/d3Modded';

// import hotkey from './hotkey';
import StateNode from './StateNode/index.js';
import CONFIG from './config'
import svg from './svg'
import * as legend from './legend'

const tryUncastrate = (obj, castrationLevel) => {
  if (obj.limboedChildren.length && !(obj.children && obj.children.length) ) {
    obj.children = obj.limboedChildren;
    obj.limboedChildren = []
  }
}

const tryCastrate = (obj, castrationLevel) => {
  const {children, level} = obj
  if (!children) {
    return children
  }
  else if (level >= castrationLevel) {
    obj.limboedChildren = obj.children
    obj.children = []
    return obj
  }
  else if (level < castrationLevel) {
    obj.children.map(lc => tryUncastrate(lc, castrationLevel))
  }

  obj.children.map(child =>
    tryCastrate(child, castrationLevel)
  )
  return obj
}

class Graph {
  constructor ({ metadata, substatesPath, cfg = {}, controlPanel }) {
    window.graph = this;
    this.svg = svg; // for debug purpose
    this.rootPath = substatesPath
    this.controlPanel = controlPanel

    this.cfg = Object.assign({}, CONFIG, cfg);
    this.isPending = true;
    this.root = this.metadata = Graph.metadataStore.root = metadata;
    this.treeLayout = d3.layout.tree().size([this.cfg.contentHeight, this.cfg.contentWidth]);
  }

  // unimplemented
  _$adjustHeight() {
    d3.select(self.frameElement).style("height", this.cfg.height);
  }

  // change activeStates
  changeActive(activeness) {
    this.stateNodes.changeActive(activeness)
    // this.stateNodes.toggleCollapse()
    // this.stateNodes.render();
    // this.stateNodes.toggleCollapse()
    // this.stateNodes.tryExpand()
    this.stateNodes.tryCollapse()
    this.stateNodes.render();
  }

  // builds out the tree
  buildTree() {
    this.setBusy(true); // doesn't trigger immediately, create a jsbin for this
    setTimeout(()=> {
      svg.cleanup()

      // this.castrateData()
      this.stateNodes = new StateNode(
        Object.assign({
          cfg: this.cfg, svg: this.svg, graph: this,
          metadata: this.metadata
        })
      )
      this.castrateState()
      this.stateNodes.render();
      this.stateNodes.tryCollapse();
      this.stateNodes.render();
      this.setBusy(false);
    }, 0)
  }

  setBusy(isBusy) {
    this.svg.node().style.display = isBusy ? 'none' : 'block'
    this.setBusyCallback(isBusy)
  }
  setBusyCallback () { } // noop

  // delete all nodes and links, and calls buildtree with <root> metadataStore
  reinitiateRoot() {
    this.metadata = Graph.metadataStore.root
    this.buildTree()
  }

  // TODO: may not need this
  // castrateData() {
  //   const {metadata, cfg: { castration }} = this
  //   const castrationLevel = +castration
  //   if (isNaN(castrationLevel) || castrationLevel < 2) {
  //     return this.metadata = metadata
  //   }
  //   this.metadata = tryCastrate(metadata, castrationLevel)
  // }

  castrateState() {
    var {stateNodes, cfg: {castrationLevel}} = this
    castrationLevel = +castrationLevel
    if (isNaN(castrationLevel) || castrationLevel < 1) {
      castrationLevel = 100; // meaning show all nodes
    }

    // castrate from this node forward
    tryCastrate(stateNodes, stateNodes.level + castrationLevel)
    this.stateNodes.render()
  }

  // delete all nodes and links, and calls buildtree with <current node> metadataStore
  branchoffRoot(node) {
    this.metadata = node.metadata
    this.buildTree()
  }

  toggleEvents() {
    this.cfg.showEvents = !this.cfg.showEvents
    this.svg.selectAll('.node text.eventName')[0].forEach(n => {
      n.style.display = this.cfg.showEvents ? 'block' : 'none';
    })
  }

  toggleEnterExitHandlers() {
    this.cfg.showEnterExitHandlers = !this.cfg.showEnterExitHandlers
      this.svg.selectAll('.enterHandler, .exitHandler')[0].forEach(n => {
      n.style.display = this.cfg.showEnterExitHandlers ? 'block' : 'none'
    })
  }

  // unimplemented
  exportPath(path) {
    this.exportPathCallback(path)
  }
  exportPathCallback() { } // noop
}

Graph.metadataStore = { root: null }

// for debugging purpose
window.Graph = Graph
export default Graph
