var State = statechart.State;

window.door = State.define('door', function() {
  this.state('closed', function() {
    this.state('locked', function() {
      this.event('unlockDoor', function() { this.goto('../unlocked'); });
    });

    this.state('unlocked', function() {
      this.event('lockDoor', function() { this.goto('../locked'); });
      this.event('openDoor', function() { this.goto('/opened'); });
    });

    this.event('knock', function() { console.log('*knock knock*'); });
  });

  this.state('opened', function() {
    this.event('closeDoor', function() { this.goto('/closed/unlocked'); });
  });
});
