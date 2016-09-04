import CONFIG from './config'

const svg = d3.select("body").append("svg")
  .attr("width", CONFIG.width)
  .attr("height", CONFIG.height)
  .on('contextmenu', e => d3.event.preventDefault())
  .append("g")
  .attr("transform",
    `translate(${CONFIG.margin.left}, ${CONFIG.margin.top})`
  )

svg.cleanup = function() {
  this.selectAll("g.node").remove();
  this.selectAll("path.link").remove();
}

export default svg