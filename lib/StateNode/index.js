import {
  defineEntranceTransition,
  defineUpdateTransition,
  defineExitTransition
} from './node_definitions';

import {
  defineLinkTransitions
} from './link_definitions';

let records = [];
class StateNode {
  constructor({
    metadata,
    metadata: {
      name, level, isActive, concurrent,
      events, children,
      hasEnterHandler, hasExitHandler
    },
    cfg, parent, svg, graph,
  }) {
    records.push(this);
    this.metadata = metadata || {};
    this.cfg = cfg;
    this.parent = parent;

    this.svg = svg;
    this.graph = graph;

    this.name = name;
    this.level = level;
    this.isActive = isActive;
    this.hasEnterHandler = hasEnterHandler;
    this.hasExitHandler = hasExitHandler;
    this.concurrent = concurrent;
    this.events = events;


    this.root = parent ? parent.root : this;
    this.x0 = this.cfg.contentHeight / 2;
    this.y0 = 0;
    this.collapsedChildren = []
    this.limboedChildren = []
    this.children = children && children.map( child =>
      new StateNode(Object.assign({
        cfg,
        parent: this,
        svg: svg,
        graph: graph,
        metadata: child
      }))
    )
  }

  toggleCollapse() {
    if (this.children) {
      this.collapsedChildren = this.children;
      this.children = null;
    } else {
      this.children = this.collapsedChildren;
      this.collapsedChildren = null;
    }
  }

  get hierarchy() {
    if (this.isRoot) {
      return []
    }
    return [...this.parent.hierarchy, this.name]
  }

  get path() {
    return '/' + this.hierarchy.join("/")
  }

  get isRoot() { return !this.parent }

  // collapase if isActive
  tryCollapse() {
    if(this.children) {
      if(!this.isActive) {
        this.toggleCollapse();
      }
      else {
        this.children.map(child => child.tryCollapse());
      }
    }
    this.render();
  }

  onClick() {
    this.toggleCollapse();
  }

  render() {
    // render this node and all children
    const duration = this.cfg.animationDuration;
    const stateNodes = this.graph.treeLayout.nodes(this.root);
    // console.debug('rendering nodes length: ', nodes.length, nodes.map(n => n.name));

    stateNodes.forEach((d) => {
      // Normalize for fixed-depth (width).
      d.y = d.depth * 180
    });

    // Uniquely IDs each node
    let uniqueId = 0;
    const svgNode = this.svg.selectAll("g.node")
      .data(stateNodes, (d) => (
        d.id || (d.id = ++uniqueId)
      ));

    defineEntranceTransition(
      svgNode.enter().append("g"),
      duration,
      this
    );

    defineUpdateTransition(svgNode, duration);

    defineExitTransition(
      svgNode.exit().transition(),
      duration,
      this.x,
      this.y
    );

    const links = this.graph.treeLayout.links(stateNodes);
    defineLinkTransitions(
      this.svg.selectAll("path.link").data(links, (d)=> (d.target.id)),
      duration,
      this //stateNode
    );

    // Stash the old positions for transition.
    stateNodes.forEach((node)=> {
      node.x0 = node.x;
      node.y0 = node.y;
    });
  }
}

StateNode.find = function(name) {
  return records.filter(r => r.name.indexOf(name) !== -1)[0]
}

export default StateNode;
