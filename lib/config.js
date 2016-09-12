export const calculateConfig = (params) => {
  const {
    margin: { top, right, bottom, left },
    margin, width, height
  } = params;

  return Object.assign(
    {
      animationDuration: 750,
      contentWidth: width - right - left,
      contentHeight: height - top - bottom,

      showEvents: false,
      showEnterExitHandlers: false,
      branchOff: false,
      castrationLevel: 0
    },
    params
  );
}

// TODO: setup devtool config, might not be necessary
const MONITOR_CONFIG = calculateConfig({
  margin: { top: 20, right: 120, bottom: 20, left: 120 },
  width: 1600,
  height: 800
});

export default MONITOR_CONFIG;
