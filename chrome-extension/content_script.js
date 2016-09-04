// console.debug('INITING content script');

// inject file
// requires `injected_script.js` to be included in `"web_accessible_resources" `
var injectedScript = document.createElement('script');
injectedScript.src = chrome.extension.getURL('injected_script.js')

injectedScript.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(injectedScript);

// window.postMessage({
//   greeting: 'hello there!',
//   source: 'statechart-chrdome',
//   window: window.door
// }, '*');


// for sending message to devtools
// message goes in this order
//  1. injected_script (which was instantiated by devtool page -> background page # executeScript)
//  2. content_scirpt (this file)
//  3. background page (where this file sends the message to)
//  4. devtool_page (relayed from basically all the other pages)
window.addEventListener('message', function(event) {
  // only accept messages from the same frame
  // console.debug('RECEIVED message in content_script', event);
  if (event.source !== window) {
    return;
  }
  var message = event.data;

  // only accept messages that we know are ours
  if(typeof message !== 'object' || message === null || message.source !== 'statechart-chrome') {
    return;
  }

  chrome.runtime.sendMessage(message);
})
