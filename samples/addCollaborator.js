export default function() {
  this.enter(function() {
    CMM.appState.contactsFor = CMM.appState.messagesForBuy.vendor;
  });

  this.exit(function() {
    CMM.appState.contactsFor = undefined;
    CMM.appState.messageCenterDialog = undefined;
  });

  this.event('closeCollaboratorDialog', function() {
    this.goto('../none');
  });

  this.event('showAddCollaborators', function() {
    this.goto('./addCollaborators');
  });

  this.state('addCollaborators', function() {
    this.enter(function() {
      CMM.appState.messageCenterDialog = 'addCollaborators';
      CMM.appState.contacts = CMM.Contact.query({
        assignableToBuyId: CMM.appState.messagesForBuy.id
      });
      CMM.appState.messagesForBuy.loadContacts();
    });

    this.exit(function() {
      CMM.appState.contacts = undefined;
    });

    this.event('addNewContact', function() {
      this.goto('../contactSearch');
    });

    this.event('updateCollaborators', function(selectedContacts) {
      CMM.appState.messagesForBuy.updateContacts(selectedContacts)
        .then(() => {
          CMM.flash.confirm('Collaborator added.');
          CMM.appState.messagesForBuy.loadTeam();
          CMM.statechart.send('closeCollaboratorDialog');
        });
    });
  });

  this.state('contactSearch', function() {
    this.enter(function() {
      CMM.appState.messageCenterDialog = 'contactSearch';
    });

    this.event('createVendorContact', function(ctx) {
      this.goto('../contactEditCreate', { context: ctx });
    });
  });

  this.state('contactEditCreate', function() {
    this.enter(function(ctx) {
      // Load/refresh vendor information
      CMM.appState.messagesForBuy.vendor.get().then(() => {
        CMM.appState.messageCenterDialog = 'contactEditCreate';
        CMM.appState.contact = new CMM.Contact({ email: ctx.presetEmail });
      });
    });

    this.exit(function() {
      CMM.appState.contact = undefined;
    });
  });
}
