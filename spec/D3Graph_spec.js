import D3Graph from '../src/D3Graph';
import sampleState from '../samples/word.js';
import d3 from 'd3';
import serialize from '../src/serialize.js';


describe('D3Graph', function() {
  const graph = new D3Graph({
    metadata: serialize(sampleState)
  });

  xdescribe('make sure graph and d3 functions are being called', function() {
    beforeEach(function() {
      spyOn(graph, 'render')
      spyOn(d3, 'selectAll')
    });

    it('check that NONE of the above has been called', function() {
      expect(graph.render).not.toHaveBeenCalled();
      expect(d3.selectAll).not.toHaveBeenCalled();
    })

    it('check that the above has been called', function() {
      expect(graph.render).toHaveBeenCalled();
      expect(d3.selectAll).toHaveBeenCalled();
    })

  });

});
