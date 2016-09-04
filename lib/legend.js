import svg from './svg'
const legendWrapper = svg.append('g')
  .attr('class', 'legends')
  .attr('transform', `translate(-10, 40)`)

const background = legendWrapper.append('rect')
  .attr('fill', '#ccc')
  .attr('width', '150')
  .attr('height', '200')
  .attr('x', -50)
  .attr('y', -50)
  .attr('rx', 10)

legendWrapper.append('text')
  .text('Legend')
  .attr('font-size', '20px')
  .attr('y', '-10')
  .attr('x', '-10')

const legends = legendWrapper
  .selectAll('g.legend')
  .data([1,2,3,4,5,6])
  .enter()
  .append('g')
    .attr('class', 'legend')
    .attr('transform', d => (`translate(0, ${d * 20})`))

legends.append('circle')
      .style('fill', 'rgb(255, 255, 255)')
      .attr('r', 4.5)
      .style('stroke-width', '1')
      .style('stroke', 'black')
legends.append('text')
      .attr('x', 30)
      .attr('y', '5')
      .text(d => d)



function hideLegend() {
  background.transition().duration(500)
    .attr('height', '60')
    
  legends
    .transition().duration(300)
    .style('stroke-opacity', '0')
    .style('fill-opacity', '0')
}

setTimeout(hideLegend, 2000);

export const all = legendWrapper

export default legendWrapper
  