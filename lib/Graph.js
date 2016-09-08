import './external/d3Modded';

// import hotkey from './hotkey';
import StateNode from './StateNode/index.js';
import CONFIG from './config'
import svg from './svg'
import * as legend from './legend'

class Graph {
  constructor ({ metadata, cfg = CONFIG }) {
    window.graph = this;
    this.svg = svg; // for debug purpose

    this.cfg = cfg;
    this.isPending = true;
    this.root = this.metadata = Graph.metadataStore.root = metadata;
    this.treeLayout = d3.layout.tree().size([this.cfg.contentHeight, this.cfg.contentWidth]);
  }

  // unimplemented
  _$adjustHeight() {
    d3.select(self.frameElement).style("height", this.cfg.height);
  }

  // builds out the tree
  buildTree() {
    svg.cleanup()
    this.stateNodes = new StateNode(
      Object.assign({
        cfg: this.cfg, svg: this.svg, graph: this,
        metadata: this.metadata
      })
    )

    this.stateNodes.render();
    this.stateNodes.tryCollapse();
    this.setBusy(false);
  }

  setBusy(isBusy) {
    this.svg.node().style.display = isBusy ? 'none' : 'block'
    this.setBusyCallback(isBusy)
  }
  setBusyCallback () { } // noop

  // delete all nodes and links, and calls buildtree with <root> metadataStore
  reinitiateRoot() {
    this.setBusy(true);
    setTimeout(() => {
      this.metadata = Graph.metadataStore.root
      this.buildTree()
    }, 200)
  }

  // delete all nodes and links, and calls buildtree with <current node> metadataStore
  branchoffRoot(node) {
    this.metadata = node.metadata
    this.setBusy(true);
    this.buildTree()
  }

  toggleEvents() {
    this.cfg.showEvents = !this.cfg.showEvents;
    this.svg.selectAll('.node text.eventName')[0].forEach(n => {
      n.style.display = this.cfg.showEvents ? 'block' : 'none';
    });
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
