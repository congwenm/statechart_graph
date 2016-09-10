export default convertState;

function convertState(state, level = 0) {
  const {
    name,
    substates,
    concurrent,
    events,
    history,
    enters,
    exits
  } = state;

  const convertedSubstates = substates && substates.length
    ? substates.map(substate => convertState(substate, level + 1))
    : null;

  return {
    name: name || "<nameless>",
    level: level,
    isActive: state.current().length > 0,
    hasEnterHandler: !!enters.length,
    hasExitHandler: !!exits.length,
    concurrent: concurrent,
    events: convertEvent(events),
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
