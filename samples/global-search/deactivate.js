export default function() {
  this.state('off', function() {
    this.event('showDeactivateModal', function(model) {
      this.goto('../on', { context: { model: model } });
    });
  });

  this.state('on', function() {
    // Allows a user to navigate to a vendor while
    // deactivating a property.
    let navigationHistory, deactivationModel;

    this.enter(function(ctx) {
      navigationHistory = [];

      if (ctx && ctx.model && !ctx.model.deactivation) {
        if (ctx.model instanceof CMM.Property) {
          ctx.model.deactivation = new CMM.PropertyDeactivation;
        }
        else if (ctx.model instanceof CMM.Vendor) {
          ctx.model.deactivation = new CMM.VendorDeactivation;
          ctx.model.loadExclusiveProperties();

        }
        else if (ctx.model instanceof CMM.PropertyVendor) {
          ctx.model.deactivation = new CMM.PropertyVendorDeactivation;
        }
      }

      CMM.appState.deactivationModel = deactivationModel = ctx.model;
    });

    this.exit(function() {
      CMM.appState.deactivationModel = deactivationModel = undefined;
    });

    this.event('deactivationSuccess', function(model) {
      const isProperty = model instanceof CMM.Property;
      const isVendor = model instanceof CMM.Vendor;
      const isPropertyVendor = model instanceof CMM.PropertyVendor;

      CMM.flash.confirm(`${isProperty ? 'Property' : 'Vendor'} deactivated.`);
      if (isProperty) {
        CMM.flash.confirm('Property deactivated.');
      }
      else if (isVendor) {
        CMM.flash.confirm('Vendor deactivated.');
      }
      else if (isPropertyVendor) {
        CMM.flash.confirm('Property removed from vendor');
      }

      this.goto('../off');

      if (isProperty) {
        CMM.statechart.send('showProperty', model.id);
      }
      else if (isVendor) {
        CMM.statechart.send('showVendor', model.id);
      }
      else if (isPropertyVendor) {
        CMM.statechart.send('showVendor', model.vendor.id, 'properties');
      }
    });

    this.event('cancelDeactivation', function(model) {
      const isProperty = model instanceof CMM.Property;
      const isVendor = model instanceof CMM.Vendor;
      const isPropertyVendor = model instanceof CMM.PropertyVendor;

      this.goto('../off');

      if (isProperty) {
        CMM.statechart.send('showProperty', model.id);
      }
      else if (isVendor) {
        CMM.statechart.send('showVendor', model.id);
      }
      else if (isPropertyVendor) {
        CMM.statechart.send('showVendor', model.vendor.id, 'properties');
      }
    });

    this.event('showVendorContact', function(contactId) {
      CMM.appState.deactivationModel = undefined;
      navigationHistory.unshift({
        event:'showVendorContact',
        args:[contactId, /* viewOnly */true]
      });
    });

    this.event('showProperty', function(propertyId, tab) {
      CMM.appState.deactivationModel = undefined;
      navigationHistory.unshift({
        event:'showProperty',
        args:[propertyId, tab, /* viewOnly */true]
      });
    });

    this.event('showVendor', function(vendorId, tab) {
      CMM.appState.deactivationModel = undefined;
      navigationHistory.unshift({
        event:'showVendor',
        args:[vendorId, tab, /* editMode */false, /* viewOnly */true]
      });
    });

    this.event('selectTab', function(tab) {
      const currentItem = navigationHistory[0];
      // Update the latest history so the user backs into the same tab they
      // left
      if (currentItem
          && (currentItem.event === 'showVendor'
              || currentItem.event === 'showProperty')) {
        currentItem.args[/* tab index */1] = tab;
      }
    });

    this.event('goBack', function() {
      navigationHistory.shift();
      if (navigationHistory && navigationHistory.length) {
        const { event, args } = navigationHistory.shift();
        CMM.statechart.send(event, ...args);
      }
      else {
        CMM.statechart.send('closeGlobalSearchModal');
        this.goto('.', { context: { model: deactivationModel }, force: true });
      }
    });
  });
}
