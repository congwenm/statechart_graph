var path = require('path');
import setupFiles from './setupFiles';

import Statechart, {State, RoutableState} from 'statechartjs';
import stateChartToJson from '../lib/stateChartToJson';

global.State = State;
global.RoutableState = RoutableState;
global.statechart = Statechart;

var currentPath = process.cwd();
var outputPath = process.argv[3] || path.join(__dirname, "../dist");

var stateFile = path.join(currentPath, process.argv[2]);
var state = require(stateFile);

if (state.default) {
  state = state.default;
}

var output = stateChartToJson(state);
// console.log('state: ', state.toString());
setupFiles(output, outputPath);


var spawn = require('child_process').spawn;
spawn('open', ['http://localhost:8000']);
spawn('google-chrome', ['http://localhost:8000']);
spawn('./node_modules/.bin/simplehttpserver', ['./dist']);
