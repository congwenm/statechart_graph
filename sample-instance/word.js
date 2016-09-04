var State = statechart.State;

window.word = State.define({concurrent: true}, function() {
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

word.goto();
word.current(); // => ['/bold/off', '/underline/off', '/align/left', '/bullets/none']

word.send('toggleBold');
word.current(); // => ['/bold/on', '/underline/off', '/align/left', '/bullets/none']

word.send('toggleUnderline');
word.current(); // => ['/bold/on', '/underline/on', '/align/left', '/bullets/none']

word.send('rightClicked');
word.current(); // => ['/bold/on', '/underline/on', '/align/right', '/bullets/none']

word.send('justifyClicked');
word.current(); // => ['/bold/on', '/underline/on', '/align/justify', '/bullets/none']

word.send('regularClicked');
word.current(); // => ['/bold/on', '/underline/on', '/align/justify', '/bullets/regular']

word.send('regularClicked');
word.current(); // => ['/bold/on', '/underline/on', '/align/justify', '/bullets/none']

word.send('numberClicked');
word.current(); // => ['/bold/on', '/underline/on', '/align/justify', '/bullets/number']

word.send('resetClicked');
word.current(); // => ['/bold/off', '/underline/off', '/align/left', '/bullets/none']
