## Statechart Tilford Graph

This module creates a tilford tree graph for [Statechart.js](https://github.com/burrows/statechart.js/tree/master)
Downloadable as a Chrome DevTool Extension [Statechart DevTool](https://chrome.google.com/webstore/detail/statechartjs-devtool/oibjblkmkmnfljnlolcgfbbknepcgafk)

####Code:
```javascript
var State = require('statechartjs').State;

var word = State.define({concurrent: true}, function() {
  this.state('bold', function() {
    this.state('off', function() {
      this.event('toggleBold', function() { this.goto('../on'); });
    });

    this.state('on', function() {
      this.event('toggleBold', function() { this.goto('../off'); });
    });
  });

  this.state('underline', function() {
    this.state('off', function() {
      this.event('toggleUnderline', function() { this.goto('../on'); });
    });

    this.state('on', function() {
      this.event('toggleUnderline', function() { this.goto('../off'); });
    });
  });

  this.state('align', function() {
    this.state('left');
    this.state('right');
    this.state('center');
    this.state('justify');

    this.event('leftClicked', function() { this.goto('./left');});
    this.event('rightClicked', function() { this.goto('./right');});
    this.event('centerClicked', function() { this.goto('./center');});
    this.event('justifyClicked', function() { this.goto('./justify');});
  });

  this.state('bullets', function() {
    this.state('none', function() {
      this.event('regularClicked', function() { this.goto('../regular'); })
      this.event('numberClicked', function() { this.goto('../number'); })
    });

    this.state('regular', function() {
      this.event('regularClicked', function() { this.goto('../none'); })
      this.event('numberClicked', function() { this.goto('../number'); })
    });

    this.state('number', function() {
      this.event('regularClicked', function() { this.goto('../regular'); })
      this.event('numberClicked', function() { this.goto('../none'); })
    });
  });

  this.event('resetClicked', function() { this.goto(); });
});
```

#### Generated graph
![graph](https://github.com/congwenm/statechart_graph/blob/master/samplestate.png)
