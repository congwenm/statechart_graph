// console.debug('INITING devtool.js')
var graphPanel = null;
var panelWindow = null;
var stateObj = null;
var statechartMiddleware = null;

chrome.devtools.panels.create(
  "StatechartJS",
  "icon.png",
  "Panel/panel.html",
  function handlePostCreate(panel) {
    // console.debug('CREATED panel');
    graphPanel = panel;
    graphPanel.onShown.addListener(function(win) {
      panelWindow = win;
      // provide this so devtool can use `eval, inspectedWindow directly`
      statechartMiddleware = panelWindow.StatechartMiddlewareSingleton.getInstance({
        panelWindow,
        devtools: chrome.devtools
      })

      if (!panelWindow.stateObj || panelWindow.stateObj.name === "enter a global state variable") {
        statechartMiddleware.requestState();
      }
    })
  }
)
