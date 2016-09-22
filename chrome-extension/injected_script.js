// console.log('INITING injected_script.js')
window.sendState = (function() {
  console.log('SENDSTATE:')
  var _stateGlobalName = ''; // used for caching

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

  var sendState = function(varname, substatesPath, isRefresh) {
    var state, substate;
    _stateGlobalName = varname || _stateGlobalName || 'CMM.statechart';

    try {
      state = getStateDefinition(_stateGlobalName);
      // ignoring substatesPath due to difficulty in changing current branchoff algorithm
      // if (substatesPath && substatesPath.length) {
        // state = getSubState(state, substatesPath);
      // }
    }
    catch(e) {
      console.error(`Can't parse statechart object and path: ${_stateGlobalName}, ${substatesPath}`);
    }
    // console.log('CHECKING', window[_stateGlobalName], convertToJSON(state));
    window.postMessage({
      greeting: 'injected script says hello there!',
      state: convertToJSON(state),
      source: 'statechart-chrome',
      isRefresh: isRefresh
    }, '*');
  }
  return sendState;
}());

window.toggleAutoReload = (function injectStatechart() {

  function debounce(func, debounceTime) {
    var runner;
    return function() {
      if (!runner){
        runner = setTimeout(func, debounceTime);
      }
      else {
        clearTimeout(runner) // stop runner
        runner = setTimeout(func, debounceTime);
      }
    }
  }

  const debouncedSendState = debounce(window.sendState.bind(undefined, '', '', false), 2000)
  const _goto = statechart.State.prototype.goto;

  return function(swich) {
    if (swich) {
      window.statechart.State.prototype.goto = function() {
        _goto.apply(this, arguments)
        debouncedSendState()
      };
    }
    else {
      window.statechart.State.prototype.goto = _goto
    }
  }
}());
