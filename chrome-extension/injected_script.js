(function IIFE() {

if (!window.statechart || !window.statechart.State) {
  return;
}

function convertEvent(events) {
  var results = [];
  for (var k in events) {
    results.push({name: k, func: events[k].toString()})
  }
  return results;
}

function getStateDefinition(string) {
  var arr = string.split('.');
  var result = window;
  arr.forEach(v => {
    result = result[v];
  })
  return result;
}

function getSubState(state, string) {
  var arr = string.split(/[\/\.]/).filter(path => path);
  arr.forEach(stateName => {
    state = state.substateMap[stateName]
  })
  return state;
}


function locateState(_cachedRootstateVar, _cachedSubstatesPath, rootState) {
  var state;
  try {
    state = rootState || getStateDefinition(_cachedRootstateVar);
    // ignoring substatesPath due to difficulty in changing current branchoff algorithm
    if (_cachedSubstatesPath && _cachedSubstatesPath.length) {
      state = getSubState(state, _cachedSubstatesPath);
    }
  }
  catch(e) {
    console.error(`Can't parse statechart object and path: ${_cachedRootstateVar}, ${_cachedSubstatesPath}`);
  }
  // console.log('CHECKING', window[_stateGlobalName], convertToJSON(state));
  return state
}


// Class
const StatechartAnalyzer = function({ isChromeExtension = false } = {}) {
  this.isChromeExtension = isChromeExtension
  this._goto = statechart.State.prototype.goto;
}

Object.assign(StatechartAnalyzer.prototype, {
  _convertToJSON (state, level) {
    const convertState = function(state, level = 0) {
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
    return convertState(state, level);
  },
  _convertActivenessToJSON (state, level) {
    const convertStateActiveness = function(state, level = 0) {
      const { name, substates } = state;

      const convertedSubstates = substates && substates.length ? substates.map(substate => {
        return convertStateActiveness(substate, level+1)
      }) : null;

      return {
        name: name || "<nameless>",
        level: level,
        isActive: state.current().length > 0,
        children: convertedSubstates,
      };
    }
    return convertStateActiveness(state, level);
  },
  sendState(rootstateVar, substatesPath, isRefresh) {
    console.log('SENDSTATE:')
    // used for caching
    this._cachedRootstateVar = this._cachedRootstateVar || rootstateVar || 'CMM.statechart';
    this._cachedSubstatesPath = substatesPath || ''

    var sendStateToExtension = () => {
      var state = this._convertToJSON(
        locateState(this._cachedRootstateVar, this._cachedSubstatesPath)
      );
      window.postMessage({
        greeting: 'injected script says hello there!',
        state: state,
        substatesPath,
        source: 'statechart-chrome',
        isRefresh: isRefresh
      }, '*');
    }

    var sendStateToWindow = () => {
      var state = this._convertToJSON(
        locateState(this._cachedRootstateVar, this._cachedSubstatesPath)
      );
      window.statechartMiddleware.receiveRootstate({ state, substatesPath: this._cachedSubstatesPath, isRefresh})
    }
    return (this.isChromeExtension ? sendStateToExtension : sendStateToWindow)();
  },

  sendStateActiveness(rootstate, substatesPath, isRefresh) {
    console.log('SENDSTATE ACTIVENESS:')
    this._cachedSubstatesPath = substatesPath || ''

    var sendStateActivenessToExtension = () => {
      var state = this._convertActivenessToJSON(
        locateState(this._cachedRootstateVar, this._cachedSubstatesPath, rootstate)
      );
      window.postMessage({
        greeting: 'injected script says hello there!',
        state: state,
        type: 'activeness',
        source: 'statechart-chrome',
        isRefresh: isRefresh
      }, '*');
    }

    var sendStateActivenessToWindow = () => {
      var state = this._convertActivenessToJSON(
        locateState(this._cachedRootstateVar, this._cachedSubstatesPath)
      );
      window.statechartMiddleware.receiveRootstateActiveness({ state, substatesPath: this._cachedSubstatesPath })
    }

    return (this.isChromeExtension ? sendStateActivenessToExtension : sendStateActivenessToWindow)();
  },

  toggleAutoReload(swich) {

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

    const debouncedSendState = debounce((rootState)=> {
      this.sendStateActiveness(rootState, this._cachedSubstatesPath);
    }, 50)


    if (swich) {
      var _goto = this._goto
      window.statechart.State.prototype.goto = function() {
        _goto.apply(this, arguments)
        debouncedSendState(this.root())
      };
    }
    else {
      window.statechart.State.prototype.goto = this._goto
    }
  },
})


window.statechartAnalyzer = window.statechartAnalyzer || new StatechartAnalyzer({ isChromeExtension: true });


}());