import svg from './svg'
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

export const all = legendWrapper

export default legendWrapper
