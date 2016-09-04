// console.log('INITING panel.js');
var globalVarInput = document.getElementById('globalVarInput');
var loadGraphBtn = document.getElementById('loadGraphBtn');
var substateInput = document.getElementById('substateInput');


loadGraphBtn.addEventListener('click', function() {
  console.log('CLICKED BUTTON', window.getStateRequest, globalVarInput.value);
  window.getStateRequest(globalVarInput.value, substateInput.value);
})
