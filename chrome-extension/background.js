var connections = {};
// console.log('INITING background.js')

// Connection from devtools
chrome.runtime.onConnect.addListener(function(port) {

  var extensionListener = function (message, sender, sendResponse) {
    // the original connection event doesn't include the tab Id of the
    // devltools page, so we need to send it explicitly
    console.log('RECEIVED message in background.js', 'message', message);
    if (!message.tabId) {
      return console.error('TABID_MISSING unabled to establish a connection with devtool');
    }
    if (message.name == 'init') {
      connections[message.tabId] = port;
      return;
    }

    // other message handling
    var { scriptToInject, code } = message;
    if (scriptToInject) {
      chrome.tabs.executeScript(message.tabId, {file: scriptToInject})
    }
    else if (code) {
      chrome.tabs.executeScript(message.tabId, {code: code})
    }

  };

  // listen to message sent from the devtoolspage
  port.onMessage.addListener(extensionListener);

  // really, same name?
  port.onDisconnect.addListener(function (connections) {
    port.onMessage.removeListener(extensionListener);

    var tabs = Object.keys(connections);

    // go through connections which is in the format:
    //  {[tabId]: port, [tabId]: port2 ...}
    // and delete the current port if tabId matches; break;
    for(var i = 0, len = tabs.length; i < len; i ++) {
      if (connections[tabs[i]] == port) {
        delete connections[tabs[i]]
        break;
      }
    }
  })
})


// Receive message from content script and relay to the devTools page
// for the currentTab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // coming from the devtool.js
  if (request.code) {
    var { tabId, code } = request;
    chrome.tabs.executeScript(tabId, {code: code});
  }
  // Messages from content scripts should have sender.tab set
  else if(sender.tab) {
    console.log('RELAYING message on background.js', request, sender.tab.id)
    var tabId = sender.tab.id;
    if (tabId in connections) {
      // if tabId is registered, send event to devTools
      console.log('RELAYING confirmed', request)
      connections[tabId].postMessage(request)
    } else {
      console.log('RELAYING denied', request)
      console.log('tab not found in connection list')
    }
  }
  else {
    console.log('sender.tab not defined.');
  }
  return true;
})
