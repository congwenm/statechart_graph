import serialize from '../src/serialize';
import sampleState from '../samples/word.js';

describe('serialize', () => {

  beforeEach(function() {
    jasmine.addMatchers({
      toMatchStart(util, customEqualityTester) {
        return {
          // prefers a string for {expected}
          compare (actual, expected) {
            var result = {};
            if (typeof expected !== "[object RegExp]") {
              expected = new RegExp('^'+expected);
            }

            if (expected.test(actual)) {
              result.pass = true;
              result.message = `${actual} does start with ${expected}`;
            }
            else {
              result.message = `Expected ${actual} to start with ${expected}, but did not.`;
            }

            return result;
          }
        }
      }
    });
  });

  describe('serialize', ()=> {
    var rootState;
    beforeEach(() => rootState = serialize(sampleState));

    it('root', () => {
      debugger;
      const {name, events} = rootState;
      expect(name).toBe('__root__');
      expect(events[0].name).toBe('resetClicked');
    });

    describe('substates', () => {
      var boldState;
      beforeEach(() => {
        boldState = rootState.children.find(sub => sub.name === 'bold')
      });

      it('bold', () => {
        const {name, events} = boldState;
        expect(name).toBe('bold');
        expect(events).toEqual([]);
      });

      describe('sub-substate', () => {
        var onState, offState;
        beforeEach(() => {
          onState = boldState.children.find(sub => sub.name === 'on')
          offState = boldState.children.find(sub => sub.name === 'off')
        });

        it('on', () => {
          const {name, events} = onState;
          expect(name).toBe('on')
          expect(events[0].name).toBe('toggleBold');
        });

        it('off', () => {
          const {name, events} = offState;
          expect(name).toBe('off')
          expect(events[0].name).toBe('toggleBold');
        });
      });
    });
  });
});
