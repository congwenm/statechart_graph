// console.debug('INITING devtool.js')
var graphPanel = null;
var panelWindow = null;
var stateObj = null;

chrome.devtools.panels.create(
  "StatechartJS",
  "icon.png",
  "Panel/panel.html",
  function handlePostCreate(panel) {
    // console.debug('CREATED panel');
    graphPanel = panel;
    graphPanel.onShown.addListener(function(win) {
      panelWindow = win;
      if (win.stateObj.name === "enter a global state variable") {
        chrome.devtools.inspectedWindow.eval('sendState()')
      };
      panelWindow.getStateRequest = function(varname, substatesPath) {
        sendToInjectedScript(varname, substatesPath);
      };
      panelWindow.toggleAutoReload = function(swich) {
        chrome.devtools.inspectedWindow.eval(`toggleAutoReload(${!!swich})`)
      };

      if (stateObj && stateObj.name && panelWindow) {
        sendState(stateObj);
      }
    })
  }
)

function sendState(state, isRefresh) {
  // panelWindow.stateObj = message.state;
  panelWindow.initiate(state, isRefresh);
}

chrome.devtools.panels.elements.createSidebarPane(
  "My Sidebar",
  function (sidebar) {
    // isdebar initialization code here
    // console.debug('CREATED side bar');
    sidebar.setObject({ some_data: 'some dat to show'});
  }
);


// # building background page connections
var tabId = chrome.devtools.inspectedWindow.tabId;
var backgroundPageConnection = chrome.runtime.connect({
  name: 'devtools-page'
});

// relay tabid to the background page
backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});


backgroundPageConnection.onMessage.addListener(function (message) {
  // console.debug('RECEIVED message from background page', message);
  stateObj = message.state;
  if (message.state && message.state.name && panelWindow) {
    sendState(message.state, message.isRefresh);
  }
});

function sendToInjectedScript(varname, substatesPath) {
  // console.debug('RELAYING varname', varname, chrome.devtools.inspectedWindow.tabId);
  chrome.devtools.inspectedWindow.eval(`sendState('${varname}', '${substatesPath}')`)
}


chrome.devtools.network.onNavigated.addListener(function() {
  // console.debug('NETWORK NAVIGATED?')
});






// EXTRA CAPABILITIES

// useContentScriptContext, and evaluating content_script within devltool
// otherwise method within context_script aren't invoked.
// chrome.devtools.inspectedWindow.eval("setSelectedElement()", {
//   useContentScriptContext: true
// })


// chrome.runtime.sendMessage({
//   tabId: tabId,
//   scriptToInject: 'content_script.js'
// })


// chrome.runtime.sendMessage({
//   tabId: tabId,
//   scriptToInject: 'injected_script.js'
// })
