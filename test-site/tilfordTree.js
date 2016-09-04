// setting up svg dimensions
var margin = { top: 20, right: 120, bottom: 20, left: 120 };
var width = 1600 - margin.right - margin.left;
var height = 800 - margin.top - margin.bottom;

var i = 0;
var duration = 750;
var root;

var treeLayout = d3.layout.tree().size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.select(self.frameElement).style("height", "800px");

function render(source) {
  // Compute the new tree layout.
  var nodes = treeLayout.nodes(root).reverse();
  var links = treeLayout.links(nodes);

  // Normalize for fixed-depth (width).
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { ;
      return "translate(" + source.y0 + "," + source.x0 + ")"; })

      // Toggle children on click.
      .on("click", function click(d) {
        if (cutOff) {
          initiate(d);
          toggleCutoff();
        }
        else {
          // toggle children
          if (d.children) {
            d._children = d.children;
            d.children = null;
          }
          else {
            d.children = d._children;
            d._children = null;
          }
          render(d);
        }
      });

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  // children name
  var text = nodeEnter.append("text")
      .attr("x", -10)
      .attr("dy", ".35em")
      .attr("text-anchor", 'end')
      .style('fill', (d) => d.isActive ? 'white' : 'black')
      .text(function(d) { return `${d.isActive ? '@': ''}${d.name}`; })
      .style("fill-opacity", 1e-6)
      .style("font-weight", (d) => d.isActive ? 'bolder' : 'normal')
      .style("font-family", 'monospace')


  // generate bbox
  const PADDING = 5;
  if (text.node()) {
    var bbox = text.node().getBBox();
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      node.insert('rect', 'text')
        .attr("x", (d) => { return -(d.name.length+1) * 6 - 3*PADDING })
        .attr("y", bbox.y - PADDING)
        .attr("width", (d) => (d.name.length+1) * 6 + (PADDING*2))
        .attr("height", bbox.height + (PADDING*2))
        .style("fill", (d) => d.isActive ? '#555' : 'white')
        .style("opacity", (d) => d.isActive ? '1' : '0');
  }



  // add event description text
  nodeEnter.selectAll("text")
    // for w/e reason this loop seem to ignore the first value.
    .data((d) => {return [{}].concat(d.events)}).enter()
    .append('text')
      .attr('class', 'eventName')
      .attr("text-anchor", 'start')
      .style("fill-opacity", 1)
      .attr("x", -30)
      .attr("y", (d, i) => i * 15)
      .attr("dy", "0.5em")
      .attr('display', eventsOn ? 'block' : 'none')
      .text(function(e) { return '*' + e.name; })
      .on('click', () => d3.event.stopPropagation())
      .append("svg:title")
      .text(function(d, i) { return d.func; });

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) {
        console.log('children location', d.x0, d.x, d.y0, d.y);

return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr('stroke-dasharray', (d) => d.source.concurrent ? '5,5' : '')
      .attr('class', (d) => d.target && d.target.isActive ? 'link link--active' : 'link')
      .attr("d", function(d) {
        var o = { x: source.x0, y: source.y0 };
        return diagonal({ source: o, target: o });
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = { x: source.x, y: source.y };
        return diagonal({ source: o, target: o });
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function initiate(stateObj) {
  root = stateObj; // quite important
  root.x0 = height / 2;
  root.y0 = 0;

  if (!root.children) return render(root);

  function collapse (node) {
    if (node.children && node.children.length) {
      node._children = node.children;
      node._children.forEach(collapse);
      node.children = null;
    }
  };

  root.children.forEach(function trycollpase(d) {
    if (d.children && d.children.length) {
      if(!d.isActive) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
      else {
        d.children.forEach(trycollpase);
      }
    }
  });

  // render
  render(root);
}

(function start({ file, stateObj } = {}) {
  if (stateObj) {
    initiate(stateObj);
  }
  else {
    d3.json(file || "./state.json", function(error, stateObj) {
      if (error) throw error;
      initiate(stateObj);
    });
  }
}());

// Settings
var eventsOn = true;
var cutOff = false;

function toggleEvents() {
  eventsOn = !eventsOn;
  svg.selectAll('text.eventName')[0].forEach(n => {
    n.style.display = eventsOn ? 'block' : 'none';
  });
}


function toggleCutoff() {
  cutOff = !cutOff;
   svg.selectAll('g.node rect')[0].forEach(n => {
    n.style.cursor = cutOff ? '-webkit-zoom-out' : '';
    n.nextSibling.style.cursor = cutOff ? '-webkit-zoom-out' : '';
    n.style.fill = cutOff ? "#88b" : '#555';
  });
}
