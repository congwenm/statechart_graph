var path = require('path');
import setupFiles from './setupFiles';

// mockups and scenarios
import Statechart, {State, RoutableState} from 'statechartjs';
import stateChartToJson from '../lib/stateChartToJson';

global.CMM = {};
global.State = State;
global.RoutableState = RoutableState;
global.statechart = Statechart;

var currentPath = process.cwd();
var outputPath = process.argv[3] || path.join(__dirname, "../dist");

var stateFile = path.join(currentPath, process.argv[2]);
let state = require(stateFile);
console.log('state.name', state);

// more mockups and scenarios
if (state.default) {
  state = state.default;
}
if (typeof state === 'function') {
  state = RoutableState.define(state);
}
if(state == null) {
  state = RoutableState.define();
  mapCMMStates(function(substate) {
    state.state(substate);
  });
}

// core(state, outputPath)
var output = stateChartToJson(state);
// console.log('state: ', state.toString());
setupFiles(output, outputPath);

function mapCMMStates(callback){
  var allStates = [];
  for (var i in CMM) {
    if (CMM[i] instanceof global.State) {
      allStates.push(CMM[i])
    }
  }
  return allStates.map(callback);
}

var spawn = require('child_process').spawn;
spawn('open', ['http://localhost:8000']);
spawn('google-chrome', ['http://localhost:8000']);
spawn('./node_modules/.bin/simplehttpserver', ['./dist']);
