var State = statechart.State;
var subject = document.getElementById('subject')
var word = State.define({concurrent: true}, function() {
  this.state('bold', function() {
    this.state('off', function() {
      this.enter(function() {
        subject.style.fontWeight = 400
      })
      this.event('toggleBold', function() { this.goto('../on'); });
    });

    this.state('on', function() {
      this.state('onOne', function() {
        this.enter(function() {
          subject.style.fontWeight = 600
        })
      })
      this.state('onTwo', function() {
        this.enter(function() {
          subject.style.fontWeight = 800
        })
      })
      this.exit(function() {
        console.log('leaving bold state')
      })

      this.event('toggleBold', function() { this.goto('../off'); });
    });
  });

  this.state('underline', function() {
    this.state('off', function() {
      this.enter(function() {
        subject.style.textDecoration = "none"
      })

      this.event('toggleUnderline', function() { this.goto('../on'); });
    });

    this.state('on', function() {
      this.enter(function() {
        subject.style.textDecoration = "underline"
      })
      this.event('toggleUnderline', function() { this.goto('../off'); });
    });
  });

  this.state('align', function() {
    this.enter(function() {

    })
    this.state('left', function() {
      this.enter(function() {
        subject.style.textAlign = 'left'
      })
    });
    this.state('right', function() {
      this.enter(function() {
        subject.style.textAlign = 'right'
      })
    });
    this.state('center', function() {
      this.enter(function() {
        subject.style.textAlign = 'center'
      })
    });
    this.state('justify', function() {
      this.enter(function() {
        subject.style.textAlign = 'justify'
      })
    });

    this.event('changeAlign', function() {
      switch (/.*\/(.*)$/.exec(this.current())[1]) {
        case 'left':
          this.send('rightClicked');break;
        case 'right':
          this.send('centerClicked');break;
        case 'center':
          this.send('justifyClicked');break;
        case 'justify':
          this.send('leftClicked');break;
      }
    })

    this.event('leftClicked', function() { this.goto('./left');});
    this.event('rightClicked', function() { this.goto('./right');});
    this.event('centerClicked', function() { this.goto('./center');});
    this.event('justifyClicked', function() { this.goto('./justify');});
  });

  this.state('bullets', function() {
    this.state('none', function() {
      this.enter(function() {
        subject.style.listStyleType = 'none'
      })
      this.event('regularClicked', function() { this.goto('../regular'); })
      this.event('numberClicked', function() { this.goto('../number'); })
    });

    this.state('regular', function() {
      this.enter(function() {
        subject.style.listStyleType = 'disc'
      })
      this.event('regularClicked', function() { this.goto('../none'); })
      this.event('numberClicked', function() { this.goto('../number'); })
    });

    this.state('number', function() {
      this.enter(function() {
        subject.style.listStyleType = 'decimal'
      })
      this.event('regularClicked', function() { this.goto('../regular'); })
      this.event('numberClicked', function() { this.goto('../none'); })
    });
  });

  this.event('resetClicked', function() { this.goto(); });
});

word.goto();
word.current(); // => ['/bold/off', '/underline/off', '/align/left', '/bullets/none']

// word.send('toggleBold');
// word.current(); // => ['/bold/on', '/underline/off', '/align/left', '/bullets/none']

// word.send('toggleUnderline');
// word.current(); // => ['/bold/on', '/underline/on', '/align/left', '/bullets/none']

// word.send('rightClicked');
// word.current(); // => ['/bold/on', '/underline/on', '/align/right', '/bullets/none']

// word.send('justifyClicked');
// word.current(); // => ['/bold/on', '/underline/on', '/align/justify', '/bullets/none']

// word.send('regularClicked');
// word.current(); // => ['/bold/on', '/underline/on', '/align/justify', '/bullets/regular']

// word.send('regularClicked');
// word.current(); // => ['/bold/on', '/underline/on', '/align/justify', '/bullets/none']

// word.send('numberClicked');
// word.current(); // => ['/bold/on', '/underline/on', '/align/justify', '/bullets/number']

// word.send('resetClicked');
// word.current(); // => ['/bold/off', '/underline/off', '/align/left', '/bullets/none']


// word.send('changeAlign')