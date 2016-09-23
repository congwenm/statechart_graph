export const defineEntranceTransition = (nodeEnter, duration, stateNode) => {
  // Enter any new nodes at the parent's previous position.
  nodeEnter
    .attr("class", (d) => `node ${`root${d.path}`.replace(new RegExp('\/', 'g'), '-')}`)
    .attr("transform", () => ( "translate(" + stateNode.y0 + "," + stateNode.x0 + ")" ))
    // Toggle children on click.
    .on("click", (d)=> {
      stateNode.graph.exportPath(d.path);
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


export const defineUpdateTransition = (nodeUpdate, duration) => {
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

export const defineExitTransition = (nodeExit, duration, x, y) => {
  // Transition exiting nodes to the parent's new position.
  nodeExit
    .duration(duration)
    .attr("transform", ()=> { return "translate(" + y + "," + x + ")"; })
    .remove();
};
