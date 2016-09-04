const diagonal = d3.svg.diagonal().projection(function(d) {
  return [d.y, d.x];
});

export const defineLinkTransitions = (link, duration, stateNode) => {
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
