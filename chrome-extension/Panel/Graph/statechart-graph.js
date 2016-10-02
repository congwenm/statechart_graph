(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.statechart_graph = factory());
}(this, (function () { 'use strict';

function convertState(state, level = 0) {
  const {
    name,
    substates,
    concurrent,
    events,
    history,
    enters,
    exits
  } = state;

  const convertedSubstates = substates && substates.length
    ? substates.map(substate => convertState(substate, level + 1))
    : null;

  return {
    name: name || "<nameless>",
    level: level,
    isActive: state.current().length > 0,
    hasEnterHandler: !!enters.length,
    hasExitHandler: !!exits.length,
    concurrent: concurrent,
    events: convertEvent(events),
    children: convertedSubstates
  };
}

function convertEvent(events) {
  var results = [];
  for (var k in events) {
    results.push({name: k, func: events[k].toString()})
  }
  return results;
}

const defineEntranceTransition = (nodeEnter, duration, stateNode) => {
  // Enter any new nodes at the parent's previous position.
  nodeEnter
    .attr("class", (d) => `node ${`root${d.path}`.replace(new RegExp('\/', 'g'), '-')}`)
    .attr("transform", () => ( "translate(" + stateNode.y0 + "," + stateNode.x0 + ")" ))
    // Toggle children on click.
    .on("click", (d)=> {
      d.toggleCollapse();
      d.render();
    })
    // Branchoff the current node and use it as the new root
    .on('contextmenu', (d)=> {
      stateNode.graph.exportPath(d.path);
      stateNode.graph.branchoffRoot(d);
      stateNode.graph.controlPanel.updateSubstatesPath(d.path)
      d3.event.preventDefault();
    })

    // TODO: after the export paht is working. is this even needed
    .on('dblclick', (d) => {
      stateNode.graph.exportPath(d.path);
    });

  // Render the node circle
  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) {
      return d.collapsedChildren ? "lightsteelblue" : "#fff";
    });

  // Render node name
  const text = nodeEnter.append("text")
    .attr("x", -10)
    .attr("dy", ".35em")
    .attr("text-anchor", 'end')
    .style('fill', d => (d.isActive ? 'white' : 'black'))
    .text((d) => ( d.name ))
    .style("fill-opacity", '1')
    .style("font-weight", 'bolder')
    .style("font-family", 'monospace');


  // generate bbox for the name
  text.each(function(stateNode) {
    stateNode.bbox = this.getBBox();
  });
  const PADDING = 5;
  const BORDER = 1;
  nodeEnter.insert('rect', 'text')
    .attr("x", (stateNode) => { return -(stateNode.name.length+1) * 6 -2*PADDING })
    .attr("y", (d) => d.bbox.y - PADDING)
    .attr("width", (stateNode) => (stateNode.name.length+1) * 6 + (PADDING*1.7) - 5*BORDER)
    .attr("height", (d) => d.bbox.height + (PADDING*2))
    .style("fill", ({isActive}) => (isActive ? '#555' : 'white' ))
    .style("stroke", "#555")
    .style("stroke-width", "1px")
    .style("stroke-opacity", "1")

  nodeEnter.append('line')
    .style('display', d => d.cfg.showEnterExitHandlers ? 'display': 'none')
    .attr('class', d => d.hasEnterHandler ? 'enterHandler' : '')
    .attr('x1', -5)
    .attr('y1', -13)
    .attr('x2', -10)
    .attr('y2', -8)

  nodeEnter.append('line')
    .style('display', d => d.cfg.showEnterExitHandlers ? 'display': 'none')
    .attr('class', d => d.hasExitHandler ? 'exitHandler' : '')
    .attr('x1', -10)
    .attr('y1', -13)
    .attr('x2', -15)
    .attr('y2', -8)

  // add event description text
  nodeEnter.selectAll("text")
    // for w/e reason this loop seem to ignore the first value.
    .data((d) => {return [{}].concat(d.events)}).enter()
    .append('text')
      .attr('class', 'eventName')
      .attr("text-anchor", 'start')
      .style("fill-opacity", '1')
      .attr("x", -30)
      .attr("y", (d, i) => i * 15)
      .attr("dy", "0.5em")
      .attr('display', stateNode.cfg.showEvents ? 'block' : 'none')
      .text(function(e) { return e.name; })
      .on('click', () => d3.event.stopPropagation())
      .append("svg:title")
      .text(function(d) { return d.func; });
};


const defineUpdateTransition = (nodeUpdate, duration) => {
  // Transition nodes to their new position.
  nodeUpdate
    .transition()
    .duration(duration)
    .attr("transform", (d) => {
      return "translate(" + d.y + "," + d.x + ")";
    });


  // Transition for the circle color
  nodeUpdate.select("circle")
    .attr("r", 4.5)
    .style("fill", (d) => { return d.collapsedChildren && d.collapsedChildren.length ? "lightsteelblue" : "#fff"; });

  // Transition for text (name & events)
  nodeUpdate.select("text")
    // .style("fill-opacity", 1);
};

const defineExitTransition = (nodeExit, duration, x, y) => {
  // Transition exiting nodes to the parent's new position.
  nodeExit
    .duration(duration)
    .attr("transform", ()=> { return "translate(" + y + "," + x + ")"; })
    .remove();
};

const diagonal = d3.svg.diagonal().projection(function(d) {
  return [d.y, d.x];
});

const defineLinkTransitions = (link, duration, stateNode) => {
  // Enter any new links at the parent's previous position.
  link
    .enter()
    .insert("path", "g")
    .attr('stroke-dasharray', (d) => {return d.source.concurrent ? '5,5' : ''})
    .attr('class', (d) => d.target && d.target.isActive ? 'link link--active' : 'link')
    .attr("d", (d)=> {
      var o = { x: stateNode.x0, y: stateNode.y0 };
      return diagonal({ source: o, target: o });
    });

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", (d) => {
      var o = { x: stateNode.x, y: stateNode.y };
      return diagonal({ source: o, target: o });
    })
    .remove();
};

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
      return [this.graph.rootPath || '']
    }
    return [...this.parent.hierarchy, this.name]
  }

  get path() {
    return this.hierarchy.join("/")
  }

  get isRoot() { return !this.parent }

  get allChildren() {
    if (!this.children || !this.children.length) return []
    return [...this.children, ...this.children.reduce((arr, c) => [...arr, ...c.allChildren], [])]
  }

  get getParent() {
    return this.parent || this.root
  }

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
  }

  tryExpand() {
    if(this.isActive) {
      if(this.collapsedChildren && this.collapsedChildren.length) {
        this.toggleCollapse();
        this.children && this.children.map(child => child.tryExpand());
      }
      else if(this.children){
        this.children.map(child => child.tryExpand());
      }
    }
  }

  changeActive(activeness) {
    var { isActive, children: childrenAreActive } = activeness;
    if (this.isActive !== isActive) {
      this.updateActive(isActive)
      if(isActive) {
        this.toggleCollapse()
        this.tryExpand()
      }
    }
    childrenAreActive && this.children && this.children.map(child => {
      var result = childrenAreActive.find(cra => cra.name === child.name);
      result && child.changeActive(result)
    })
  }

  updateActive(isActive) {
    this.isActive = isActive;
    var node = this.svg.select(`g.node.${`root${this.path}`.replace(new RegExp('\/', 'g'), '-')}`)
    if (node) {
      var text = node.select('text')[0][0]
      var rect = node.select('rect')[0][0]
      if(text) text.style.fill = this.isActive ? 'white' : 'black'
      if(rect) rect.style.fill = this.isActive ? '#555' : 'white'
    }
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
      .data(stateNodes, (d)=> {
        return d.id || (d.id = ++uniqueId)
      });

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

const calculateConfig = (params) => {
  const {
    margin: { top, right, bottom, left },
    margin, width, height
  } = params;

  return Object.assign(
    {
      animationDuration: 750,
      contentWidth: width - right - left,
      contentHeight: height - top - bottom,

      showEvents: false,
      showEnterExitHandlers: false,
      branchOff: false,
      castrationLevel: 0
    },
    params
  );
}

// TODO: setup devtool config, might not be necessary
const MONITOR_CONFIG = calculateConfig({
  margin: { top: 20, right: 120, bottom: 20, left: 120 },
  width: 1600,
  height: 800
});

const svg = d3.select("body").append("svg")
  .attr("width", MONITOR_CONFIG.width)
  .attr("height", MONITOR_CONFIG.height)
  .on('contextmenu', e => d3.event.preventDefault())
  .append("g")
  .attr("transform",
    `translate(${MONITOR_CONFIG.margin.left}, ${MONITOR_CONFIG.margin.top})`
  )

svg.cleanup = function() {
  this.selectAll("g.node").remove();
  this.selectAll("path.link").remove();
}

const legendWrapper = svg.append('g')
  .attr('class', 'legends')
  .attr('transform', `translate(-10, 500)`)
  .style('cursor', 'pointer')

const background = legendWrapper.append('rect')
  .attr('fill', '#eee')
  .attr('width', '180')
  .attr('height', '300')
  .attr('x', -100)
  .attr('y', -50)
  .attr('rx', 10)

legendWrapper.append('text')
  .text('Legend')
  .attr('font-size', '20px')
  .attr('y', '-10')
  .attr('x', '-50')

// move some of these into css
const LEGEND_DATA = [
  // nodes
  {
    node: 'circle',
    attrs: {
      'r': 4.5
    },
    styles: {
      fill: 'white',
      'stroke-width': 1,
      stroke: 'steelblue'
    },
    description: 'node w/o children'
  },
  {
    node: 'circle',
    attrs: {
      'r': 4.5
    },
    styles: {
      fill: 'lightsteelblue',
      'stroke-width': 1,
      stroke: 'steelblue'
    },
    description: 'node w/ children'
  },

  // links
  {
    node: 'path',
    attrs: {
      // class: 'link', // make this node dissappear
      d: 'M-10,0 L10,0',
    },
    styles: {
      stroke: '#ccc',
      'stroke-width': '1',
    },
    description: 'inactive path'
  },
  {
    node: 'path',
    attrs: {
      d: 'M-10,0 L10,0',
    },
    styles: {
      stroke: '#ccc',
      'stroke-width': '3',
    },
    description: 'active path'
  },
  {
    node: 'path',
    attrs: {
      d: 'M-10,0 L10,0',
    },
    styles: {
      stroke: '#ccc',
      'stroke-width': '3',
      'stroke-dasharray': '4,4'
    },
    description: 'concurrent path'
  },

  // text
  {
    node: 'rect',
    attrs: {
      x: "-10",
      y: "-7",
      height: 15,
      width: 20,
    },
    styles: {
      fill: '#555',
      stroke: '#555',
    },
    description: 'active state'
  },
  {
    node: 'rect',
    attrs: {
      x: "-10",
      y: "-7",
      height: 15,
      width: 20,
    },
    styles: {
      fill: 'white',
      stroke: '#555',
    },
    description: 'inactive state'
  },
  // events
  {
    node: 'text',
    attrs: {
      x: -9,
      y: 5,
      class: 'eventName'
    },
    text: 'clk',
    description: 'event name'
  },

  //flags
  {
    node: 'line',
    attrs: {
      x1: 0,
      y1: 5,
      x2: 5,
      y2: 0
    },
    styles: {
      stroke: 'red',
      'stroke-width': 3
    },
    description: 'has exit handler'
  },
  {
    node: 'line',
    attrs: {
      x1: 0,
      y1: 5,
      x2: 5,
      y2: 0
    },
    styles: {
      stroke: 'green',
      'stroke-width': 3
    },
    description: 'has enter handler'
  },
]

const mapObject = function(object, callback) {
  var arr = [];
  for (var k in object) {
    arr.push(callback(object[k], k))
  }
  return arr;
}

var legends = legendWrapper
  .selectAll('g.legend')
  .data(LEGEND_DATA)
  .enter()
    .append('g')
    .attr('transform', (k,i) => (`translate(-70, ${i * 20 + 20})`))
    .attr('width', '20')
    .attr('height', '20')

legends.append(d => document.createElementNS(d3.ns.prefix.svg, d.node))
  .each(function(d) {
    const {styles, attrs, text} = d;
    const node = d3.select(this).attr(attrs).node()
    node.setAttribute(
      'style', mapObject(styles, (v,k)=> `${k}: ${v};`).join(' ')
    )
    if(d.text) {
      node.innerHTML = text
    }
  })

legends.append('text').attr('x', 20)
        .attr('y', '5')
        .text(d => d.description)
        .style('cursor', 'pointer')

function toggleLegend() {
  this.showLegend = (this.showLegend === undefined) ? false : !this.showLegend;
  background.transition().duration(500)
    .attr('height', this.showLegend ? '300' : '60')

  legends.transition().duration(300)
    .style('stroke-opacity', this.showLegend ? '1' : '0')
    .style('fill-opacity', this.showLegend ? '1' : '0')
}

const legendGNode = legendWrapper.node()
legendGNode.addEventListener('click', toggleLegend);

// import './external/d3Modded';

// import hotkey from './hotkey';
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

    this.cfg = Object.assign({}, MONITOR_CONFIG, cfg);
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

window.statechartGraph = {
  serialize: convertState,
  Graph
}

var index = window.statechartGraph

return index;

})));
//# sourceMappingURL=statechart-graph.js.map
