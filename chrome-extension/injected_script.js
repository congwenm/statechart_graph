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
    var arr = string.split(/[\/\.]/).filter(path => path);
    arr.forEach(stateName => {
      state = state.substateMap[stateName]
    })
    return state;
  }

  var convertToJSON = (function() {
    function convertState(state, level = 0) {
      const { name, substates, concurrent, events, history, enters, exits } = state;

      const convertedSubstates = substates && substates.length ? substates.map(substate => {
        return convertState(substate, level+1)
      }) : null;

      return {
        name: name || "<nameless>", concurrent: concurrent, events: convertEvent(events),
        level: level,
        isActive: state.current().length > 0,
        children: convertedSubstates,
        hasEnterHandler: !!enters.length,
        hasExitHandler: !!exits.length,
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
      // ignoring substatesPath due to difficulty in changing current branchoff algorithm
      // if (substatesPath && substatesPath.length) {
        // state = getSubState(state, substatesPath);
      // }
    }
    catch(e) {
      console.error(`Can't parse statechart object and path: ${varname}, ${substatesPath}`);
    }
    // console.log('CHECKING', window[varname], convertToJSON(state));
    window.postMessage({
      greeting: 'injected script says hello there!',
      state: convertToJSON(state),
      source: 'statechart-chrome'
    }, '*');
  }
  return sendState;
}());
