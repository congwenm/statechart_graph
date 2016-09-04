// console.log('INITING injected_script.js')
window.sendState = (function() {

  var getStateDefinition = function(string) {
    var arr = string.split('.');
    var result = window;
    arr.forEach(v => {
      result = result[v];
    })
    return result;
  }

  var getSubState = function(state, string) {
    var arr = string.split(/[\/\.]/);
    arr.forEach(stateName => {
      state = state.substateMap[stateName]
    })
    return state;
  }

  var convertToJSON = (function() {
    function convertState(state, level = 0) {
      const { name, substates, concurrent, events, history } = state;

      const convertedSubstates = substates && substates.length ? substates.map(substate => {
        return convertState(substate, level+1)
      }) : null;

      return {
        level: level,
        isActive: state.current().length > 0,
        name: name || "<nameless>", concurrent: concurrent, events: convertEvent(events),
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

    return convertState;
  }());

  var sendState = function(varname, substatesPath) {
    var state, substate;
    // varname = varname || 'CMM.statechart';
    varname = varname || 'CMM.statechart';

    try {
      state = getStateDefinition(varname);
      if (substatesPath && substatesPath.length) {
        state = getSubState(state, substatesPath);
      }
    }
    catch(e) {
      console.error(`Can't parse statechart object and path: ${varname}, ${substatesPath}`);
    }
    // console.log('CHECKING', window[varname]);
    window.postMessage({
      greeting: 'injected script says hello there!',
      state: convertToJSON(state),
      source: 'statechart-chrome'
    }, '*');
  }
  return sendState;
}());
