import deactivateState from './global-search/deactivate';

const RoutableState = statechart.RoutableState;

CMM.globalSearchState = new RoutableState('globalSearch', function() {

  this.C(function(params) {
    params = params || {};
    const isSuperUser = CMM.utils.userCan('manage', 'all');
    if ((CMM.utils.userCan('manageGlobalDirectory', 'frontend') && !isSuperUser) || (params.search != null)) {
      return 'on';
    }
    else {
      return null;
    }
  });

  this.state('off', function() {
    this.event('toggleGlobalSearch', function() {
      this.goto('../on');
    });

    this.event('showProperty', function(propertyId) {
      this.goto('../on/resultModal/property/show', {
        context: {
          property: propertyId
        }
      });
    });

    this.event('showVendor', function(vendorId) {
      this.goto('../on/resultModal/vendor/show', {
        context: {
          vendor: vendorId
        }
      });
    });
  });

  this.state('on', {
    concurrent: true
  }, function() {

    this.state('search', function() {

      this.event('toggleGlobalSearch', function() {
        if (!CMM.utils.userCan('manageGlobalDirectory', 'frontend')) {
          this.goto('../../off');
        }
      });

      this.enter(function(ctx) {
        ctx = ctx || {};
        const search = ctx.search || '';
        const searchType = ctx.searchType || 'Property';

        this.params({
          search: search,
          searchType: searchType
        });

        const searchQuery = {
          query: search,
          type: searchType,
          sortBy: searchType === "Property" ? "unique_visitors" : "name",
          forVendor: CMM.seeds.currentUser.isVendorUser
        };
        CMM.appState.globalSearchEnabled = true;
        CMM.appState.searchQuery = new CMM.SearchQuery(searchQuery);
        CMM.appState.searchResults = CMM.SearchResult.query({ searchQuery: CMM.appState.searchQuery });
      });

      this.exit(function() {
        this.params({
          search: undefined,
          searchType: undefined
        });
        CMM.appState.globalSearchEnabled = undefined;
        CMM.appState.searchResults = undefined;
      });

      this.event('redoGlobalSearch', function() {
        const _this = this;
        window.setTimeout(function() {
          _this.goto('.', {
            force: true
          });
        });
      });

      this.event('searchQueryChanged', function() {
        const searchQuery = CMM.appState.searchQuery;
        const _this = this;

        window.setTimeout(function() {
          _this.params({
            search: searchQuery.query,
            searchType: searchQuery.type
          });
        });

        searchQuery.page = 1;
        CMM.appState.searchResults.query({ searchQuery });

        CMM.analytics.track('directorySearched', {
          'query': searchQuery.query
        });
      });

      this.event('loadMoreSearchResults', function() {
        const searchQuery = CMM.appState.searchQuery;
        searchQuery.page = (searchQuery.page || 1) + 1;

        const nextPage = CMM.SearchResult.query({ searchQuery });
        nextPage.then(function() {
          const searchResults = CMM.appState.searchResults;
          (searchResults).push.apply(searchResults, nextPage);
          CMM.appState.searchResults.meta = nextPage.meta;
        });
      });

      this.event('addVendorToPlan', function(vendorid) {
        CMM.appState.selectedMediaPlan.add(vendorid);
      });
    });

    this.state('addPropertyToPlan', function() {
      this.state('off', function() {
        this.event('addToPlan', function(propertyId) {
          const propertyModel = CMM.Property.get(propertyId, {
            refresh: true
          });
          propertyModel.then(() => {
            const campaign = CMM.appState.campaign;

            if (CMM.seeds.currentUser.isVendorUser) {
              const vendor = campaign.buys.first.vendor;
              CMM.appState.selectedMediaPlan.add(
                vendor.id,
                vendor.propertyVendors.find(pv => pv.property === propertyModel).id, []
              );
            }
            else {
              if (propertyModel.activePropertyVendors.length > 1) {
                this.goto('../on', {
                  context: {
                    property: propertyId
                  }
                });
              }
              else if (propertyModel.activePropertyVendors.length === 1) {
                this.goto('../on/chooseContactModal', {
                  context: {
                    property: propertyId,
                    propertyVendor: propertyModel.activePropertyVendors[0].id,
                    vendor: propertyModel.activePropertyVendors[0].vendor.id
                  }
                });
              }
              else {
                CMM.flash.alert("This property has been deactivated");
              }
            }
          });
        });
      });
      this.state('on', function() {
        // Allows a user to navigate to a contact, property, or vendor while
        // adding a property to plan.
        let navigationHistory;

        this.enter(function({
          property
        }) {
          navigationHistory = [];
          CMM.appState.addPropertyModel = CMM.Property.get(property, {
            refresh: true
          });
        });

        this.exit(function(ctx) {
          CMM.appState.addPropertyModel = undefined;
          CMM.appState.addPropertyDialog = undefined;
        });

        this.event('closeAddPropertyModal', function() {
          this.goto('../off');
        });

        this.event('showProperty', function(propertyId, tab) {
          navigationHistory.unshift({
            event: 'showProperty',
            args: [propertyId, tab, /* viewOnly */ true]
          });
        });

        this.event('showVendor', function(vendorId, tab) {
          navigationHistory.unshift({
            event: 'showVendor',
            args: [vendorId, tab, /* editMode */ false, /* viewOnly */ true]
          });
        });

        this.event('showVendorContact', function(contactId, viewOnly, vendorId) {
          navigationHistory.unshift({
            event: 'showVendorContact',
            args: [contactId, /* viewOnly */ true, /* venderId */ vendorId]
          });
        });

        this.event('selectTab', function(tab) {
          const currentItem = navigationHistory[0];
          // Update the latest history so the user backs into the same tab they
          // left
          if (currentItem && (currentItem.event === 'showVendor' || currentItem.event === 'showProperty')) {
            currentItem.args[1] = tab;
          }
        });

        this.event('openChooseVendorModal', function(property, selectedPropertyVendor) {
          this.goto('chooseVendorModal', {
            context: {
              property: property,
              selectedPropertyVendor: selectedPropertyVendor
            }
          });
        });

        this.event('goBack', function() {
          navigationHistory.shift();
          if (navigationHistory && navigationHistory.length) {
            const {
              event,
              args
            } = navigationHistory.shift();
            CMM.statechart.send(event, ...args);
          }
          else {
            // Reenter child state to refresh all data
            const {
              chooseContactModal,
              chooseVendorModal
            } = this.substateMap;
            let targetChildState;
            if (chooseContactModal.isCurrent('.')) {
              targetChildState = chooseContactModal;
            }
            else {
              if (chooseVendorModal.isCurrent('.')) {
                targetChildState = chooseVendorModal;
              }
              else {
                targetChildState = null;
              }
            }

            if (targetChildState) {
              targetChildState.goto('.', {
                force: true,
                context: {
                  property: CMM.appState.addPropertyModel.id,
                  propertyVendor: CMM.appState.contactsForPropertyVendorId,
                  vendor: CMM.appState.contactsFor && CMM.appState.contactsFor.id
                }
              });
              CMM.statechart.send('closeGlobalSearchModal');
            }
          }
        });

        this.state('chooseVendorModal', function() {
          this.enter(function(ctx) {
            CMM.appState.addPropertyDialog = CMM.appState.globalSearchModal = 'chooseVendor';
            CMM.appState.selectedPropertyVendor = ctx.selectedPropertyVendor;
          });

          this.event('openChooseContactModal', function(propertyVendor) {
            navigationHistory.unshift({
              event: 'openChooseVendorModal',
              args: [propertyVendor.property.id, propertyVendor]
            });
            navigationHistory.unshift({
              event: 'openChooseContactModal',
              args: [propertyVendor]
            });

            this.goto('../chooseContactModal', {
              context: {
                propertyVendor: propertyVendor.id,
                vendor: propertyVendor.vendor.id
              }
            });
          });
        });

        this.state('chooseContactModal', function() {

          this.event('chooseContactModalGoBack', function() {
            CMM.statechart.send('goBack');
          });

          this.event('closeChooseContactModal', function() {
            this.goto('../../off');
          });

          this.state('contactList', function() {
            this.enter(function(ctx) {
              CMM.appState.contactsForPropertyVendorId = ctx.propertyVendor;
              CMM.appState.contacts = CMM.Contact.query({
                propertyVendorId: ctx.propertyVendor
              });
              CMM.appState.contactsFor = CMM.Vendor.get(ctx.vendor);
              CMM.appState.addPropertyDialog = CMM.appState.globalSearchModal = 'chooseContact';
            });

            this.event('addNewContact', function(contactType) {
              CMM.statechart.send('searchVendorContact', {
                vendor: CMM.appState.contactsFor.id,
                editMode: false,
                viewOnly: false
              });
            });

            this.event('successfullyAssociatedContact', function() {
              CMM.appState.contacts = CMM.Contact.query({
                propertyVendorId: CMM.appState.contactsForPropertyVendorId
              });
            });

            this.event('successfullyCreatedContact', function() {
              CMM.appState.contacts = CMM.Contact.query({
                propertyVendorId: CMM.appState.contactsForPropertyVendorId
              });
            });
          });

          this.event('addPropertyVendorToPlan', function(selectedContacts) {
            CMM.appState.selectedMediaPlan.add(
              CMM.appState.contactsFor.id,
              CMM.appState.contactsForPropertyVendorId,
              selectedContacts
            ).catch(() => {
              CMM.flash.alert('Could not add property or vendor to plan');
            });
            this.goto('../../off');
          });
        });
      });
    });

    this.state('deactivate', deactivateState);

    this.state('resultModal', function() {
      const _this = this;
      const selectTab = function(tab) {
        CMM.appState.cardTab = tab;
        _this.params({
          tab: tab
        });
      };

      this.exit(function() {
        CMM.appState.vendorDefaultTerms = undefined;
      });

      this.C(function(params) {
        params = params || {};
        if ((params.contact != null) && (params.vendor != null)) {
          return 'vendor/contact/show';
        }
        else if (params.property != null) {
          return 'property/show';
        }
        else if (params.vendor != null) {
          return 'vendor/show';
        }
        else if (params.createVendor != null) {
          return 'vendor/create';
        }
        else if (params.createProperty != null) {
          return 'property/create';
        }
      });

      this.state('off');

      this.state('property', function() {

        this.exit(function() {
          CMM.appState.globalSearchModal = undefined;
          CMM.appState.searchDetailsCardModel = undefined;

          const searchResults = CMM.appState.searchResults;
          if (searchResults) {
            searchResults.query({ searchQuery: CMM.appState.searchQuery });
          }

          CMM.appState.contactType = undefined;
          CMM.appState.cardTab = undefined;

          this.params({
            property: undefined,
            tab: undefined
          });
        });

        this.state('create', function() {

          this.enter(function(ctx) {
            let presetVendorId;

            this.params({
              createProperty: true
            });

            CMM.appState.presetVendor = null;
            presetVendorId = (ctx.presetVendor && ctx.presetVendor.id) || ctx.presetVendorId;
            if (presetVendorId) {
              this.params({
                presetVendorId: presetVendorId
              });
              CMM.appState.presetVendor = CMM.Vendor.get(presetVendorId);
            }

            CMM.appState.searchDetailsCardModel = new CMM.Property({
              managedBy: CMM.utils.userCan('manageGlobalDirectory', 'frontend') ? 'centro' : 'agency',
              vendors: CMM.appState.presetVendor ? [CMM.appState.presetVendor] : []
            });

            CMM.appState.globalSearchModal = 'property';
            CMM.appState.propertyEditEnabled = true;
          });

          this.exit(function() {
            this.params({
              createProperty: undefined,
              presetVendorId: undefined
            });
            CMM.appState.searchDetailsCardModel = undefined;
            CMM.appState.propertyEditEnabled = undefined;
          });

          this.event('toggleEditProperty', function() {
            this.goto('../../off');
          });

          this.event('propertySaved', function(property) {
            CMM.flash.confirm('Property created successfully!');
            CMM.analytics.track('propertyCreated', {
              propertyId: property.id,
              propertyName: property.name
            });
            this.goto('../show', {
              context: {
                property: CMM.appState.searchDetailsCardModel.id
              }
            });
          });
        });

        this.state('show', function() {
          this.C(function(arg) {
            if (arg.edit) {
              return 'edit';
            }
          });

          this.event('selectTab', selectTab);
          const TABS = ['details', 'contacts'];

          this.enter(function(ctx) {
            const _this = this;
            const tab = ctx && _.contains(TABS, ctx.tab) ? ctx.tab : TABS[0];

            this.params({
              property: ctx.property,
              view: ctx.viewOnly
            });

            selectTab(tab);
            CMM.appState.searchDetailsCardModel = CMM.Property.get(ctx.property, {
              refresh: true
            });
            CMM.appState.globalSearchModal = 'property';
            CMM.appState.globalSearchReadOnly = ctx && ctx.viewOnly;
            CMM.appState.searchDetailsCardModel["catch"](function(e) {
              CMM.flash.alert('Error loading property', {
                dismissible: false,
                timeout: 5000
              });
              _this.goto('../../off');
            });
          });

          this.exit(function() {
            CMM.appState.globalSearchReadOnly = undefined;
          });

          this.state('edit', function() {
            this.C(function(arg) {
              if (arg.edit) {
                return 'on';
              }
            });

            this.state('off', function() {
              this.event('toggleEditProperty', function() {
                this.goto('../on');
              });
            });

            this.state('on', function() {
              this.enter(function() {
                this.params({
                  edit: true
                });
                CMM.appState.searchDetailsCardModel.then(function() {
                  CMM.appState.searchDetailsCardModel.ensureOneOfflineProperty();
                  CMM.appState.propertyEditEnabled = true;
                });
              });

              this.exit(function() {
                this.params({
                  edit: undefined
                });
                CMM.appState.property = undefined;
                CMM.appState.propertyEditEnabled = undefined;
              });

              this.event('toggleEditProperty', function() {
                const _this = this;
                CMM.appState.searchDetailsCardModel.get().then(function() {
                  _this.goto('../off');
                });
              });

              this.event('propertySaved', function() {
                CMM.flash.confirm('Changes saved successfully!');
                this.goto('../off');
              });
            });
          });
        });
      });

      this.state('vendor', function() {
        this.exit(function() {
          this.params({
            vendor: undefined,
            tab: undefined
          });
          CMM.appState.globalSearchModal = undefined;
          CMM.appState.contactType = undefined;
          CMM.appState.searchDetailsCardModel = undefined;
          CMM.appState.cardTab = undefined;
          const searchResults = CMM.appState.searchResults;
          if (searchResults) {
            searchResults.query({ searchQuery: CMM.appState.searchQuery });
          }
          CMM.flash.dismiss();
        });

        this.event('refreshVendors', function() {
          window.setTimeout(function() {
            CMM.appState.searchResults = CMM.SearchResult.query({ searchQuery: CMM.appState.searchQuery });
          }, 500);
        });

        this.state('create', function() {
          this.enter(function() {
            let vendor;
            this.params({
              createVendor: true
            });

            vendor = new CMM.Vendor({
              managedBy: CMM.utils.userCan('manageGlobalDirectory', 'frontend') ? 'centro' : 'agency'
            });

            CMM.appState.searchDetailsCardModel = vendor;
            CMM.appState.globalSearchModal = 'vendor';
            CMM.appState.vendorEditEnabled = true;
          });

          this.exit(function() {
            this.params({
              createVendor: undefined
            });
            CMM.appState.vendorEditEnabled = undefined;
          });

          this.event('vendorSaved', function(vendor) {
            CMM.flash.confirm('Vendor created successfully!');
            CMM.analytics.track('vendorCreated', {
              vendorId: vendor.id,
              vendorName: vendor.name,
              vendorType: vendor.typeName
            });
            CMM.statechart.send('refreshVendors');
            this.goto('../show', {
              context: {
                vendor: CMM.appState.searchDetailsCardModel.id
              }
            });
          });
        });

        this.state('contact', function() {
          this.enter(function(ctx) {
            CMM.appState.contactType = Transis.capitalize(this.superstate.name);
            CMM.appState.searchDetailsCardModel = CMM.appState.searchDetailsCardModel || CMM.Vendor.get(ctx.vendor, {
              refresh: true
            });
          });

          this.exit(function() {
            this.params({
              vendor: undefined,
              tab: false,
              contactAction: undefined
            });
            CMM.appState.searchContactModal = undefined;
            CMM.appState.cardTab = undefined;
            CMM.appState.searchContactModal = undefined;
          });

          this.state('search', function() {
            this.enter(function(ctx) {
              this.params({
                contactAction: 'search'
              });
              CMM.appState.globalSearchModal = 'contactSearch';
            });

            this.event('successfullyAssociatedContact', function() {
              if (CMM.appState.addPropertyDialog) {
                CMM.statechart.send('closeGlobalSearchModal');
              }
              else {
                CMM.statechart.send('showVendor', this.params().vendor, 'contacts');
              }
            });

            this.event('cancelAssociateContact', function() {
              this.send('successfullyAssociatedContact');
            });
          });

          this.state('show', function() {
            this.enter(function(ctx) {
              const _this = this;
              this.params({
                contact: ctx.contact,
                contactAction: 'show',
                view: ctx.viewOnly
              });

              if (ctx.vendor) {
                CMM.appState.globalSearchReadOnly = ctx && ctx.viewOnly;
                CMM.appState.searchDetailsCardModel = CMM.Vendor.get(ctx.vendor);
                CMM.appState.searchDetailsCardModel["catch"](function(e) {
                  CMM.flash.alert('Error loading vendor', {
                    dismissible: false,
                    timeout: 5000
                  });
                  _this.goto('../../off');
                });
              }

              CMM.appState.searchContactModal = CMM.Contact.get(ctx.contact, {
                refresh: true
              });

              CMM.appState.searchContactModal.then(function() {
                CMM.appState.globalSearchModal = 'contactShow';
              })["catch"](function(e) {
                CMM.flash.alert('Error loading contact', {
                  dismissible: false,
                  timeout: 5000
                });
                _this.goto('../../off');
              });
            });

            this.exit(function() {
              this.params({
                contact: undefined
              });
              CMM.appState.globalSearchReadOnly = undefined;
              CMM.appState.globalSearchModal = undefined;
            });
          });

          this.state('create', function() {
            this.enter(function(ctx) {
              this.params({
                contactAction: 'create',
                createContact: true
              });

              CMM.appState.editContactEnabled = false;
              CMM.appState.globalSearchModal = 'contactEditCreate';
              CMM.appState.searchContactModal = new CMM.Contact({
                email: ctx.presetEmail
              });
              CMM.appState.searchContactModal.vendors.push(CMM.appState.searchDetailsCardModel);
            });

            this.exit(function() {
              this.params({
                createContact: undefined
              });
              CMM.appState.contactEditCreate = undefined;
              CMM.appState.globalSearchModal = undefined;
            });

            this.event('successfullyCreatedContact', function() {
              if (CMM.appState.addPropertyDialog) {
                CMM.statechart.send('closeGlobalSearchModal');
              }
              else {
                CMM.statechart.send('showVendor', this.params().vendor, 'contacts');
              }
            });
          });

          this.state('edit', function() {
            this.enter(function() {
              CMM.appState.globalSearchModal = 'contactEditCreate';
              CMM.appState.contactEditEnabled = true;
            });

            this.exit(function() {
              CMM.appState.searchContactModal = undefined;
              CMM.appState.contactEditEnabled = false;
            });
          });
        });

        this.state('termsAndConditions', function() {
          this.state('create', function() {
            this.enter(function(vendor) {
              CMM.appState.termsAndConditions = new CMM.TermsAndConditions({
                vendor: vendor
              });
              CMM.appState.globalSearchModal = 'termsAndConditions';
            });
          });

          this.exit(function() {
            CMM.appState.termsAndConditions = undefined;
          });
        });

        this.state('show', function() {

          let updateNoActiveTermsAlert = function(tab) {
            const hasNoDefault = !CMM.appState.allVendorTermsAndConditions.some(term => term.isDefaultVendor);
            if (hasNoDefault && CMM.utils.userCan('manageVendorTerms', 'frontend') && tab === 'vendorTerms') {
              CMM.flash.alert(CMM.Strings.NO_ACTIVE_TERMS_AND_CONDITIONS, {
                dismissible: false
              });
            }
            else {
              CMM.flash.dismiss();
            }
          };

          this.C(function(arg) {
            if (arg.edit) {
              return 'edit';
            }
          });

          this.event('selectTab', function(tab) {
            updateNoActiveTermsAlert(tab);
            selectTab(tab);
          });

          this.event('vendorSaved', function() {
            CMM.flash.confirm('Changes saved successfully!');
            CMM.statechart.send('refreshVendors');
            this.goto('./edit/off');
          });

          const TABS = ['details', 'properties', 'contacts', 'vendorTerms', 'payment'];

          this.enter(function(ctx) {
            this.params({
              vendor: ctx.vendor,
              edit: ctx != null ? ctx.editMode : undefined,
              view: ctx.viewOnly
            });

            CMM.appState.vendorEditEnabled = ctx && ctx.editMode;

            CMM.appState.globalSearchReadOnly = ctx && ctx.viewOnly;
            const tab = ctx && _.contains(TABS, ctx.tab) ? ctx.tab : TABS[0];
            selectTab(tab);
            CMM.appState.searchDetailsCardModel = CMM.Vendor.get(ctx.vendor, {
              refresh: true
            });
            CMM.appState.globalSearchModal = 'vendor';
            CMM.appState.searchDetailsCardModel["catch"](function(e) {
              CMM.flash.alert("Error loading vendor", {
                dismissible: false,
                timeout: 5000
              });
              _this.goto('../../off');
            });

            if (CMM.utils.userCan('seeVendorTerms', 'frontend')) {
              CMM.appState.allVendorTermsAndConditions = CMM.TermsAndConditions.query({
                vendorId: ctx.vendor
              });
              CMM.appState.allVendorTermsAndConditions.then(() => {
                updateNoActiveTermsAlert(tab);
              });
            }
            else {
              CMM.appState.allVendorTermsAndConditions = [];
            }
          });

          this.exit(function() {
            if (CMM.appState.cardTab === 'vendorTerms') {
              CMM.flash.dismiss();
            }
          });

          this.state('edit', function() {
            this.C(function(arg) {
              if (arg.edit) {
                return 'on';
              }
            });

            this.state('off', function() {
              this.event('toggleEditVendor', function() {
                this.goto('../on');
              });
            });

            this.state('on', function() {
              this.enter(function() {
                this.params({
                  edit: true
                });

                CMM.appState.searchDetailsCardModel.then(function() {
                  CMM.appState.vendor = CMM.appState.searchDetailsCardModel;
                  CMM.appState.vendorEditEnabled = true;
                });
              });

              this.exit(function() {
                this.params({
                  edit: undefined
                });
                CMM.appState.vendor = undefined;
                CMM.appState.vendorEditEnabled = undefined;
                CMM.appState.globalSearchReadOnly = undefined;
              });

              this.event('toggleEditVendor', function() {
                const _this = this;
                CMM.appState.searchDetailsCardModel.get().then(function() {
                  _this.goto('../off');
                });
              });
            });
          });
        });
      });

      // TODO: Refactor these evens to take an options object instead of positionals,
      //       see ContactShowCardModal#handleGoToPage for why.
      this.event('showProperty', function(propertyId, tab, viewOnly) {
        this.goto('./property/show', {
          context: {
            property: propertyId,
            tab: tab,
            viewOnly: viewOnly
          },
          force: true
        });
      });

      this.event('createProperty', function(presetVendor) {
        this.goto('./property/create', {
          context: {
            presetVendor: presetVendor
          }
        });
      });

      this.event('showVendor', function(vendorId, tab, editMode, viewOnly) {
        this.goto('./vendor/show', {
          context: {
            vendor: vendorId,
            tab: tab,
            editMode: editMode,
            viewOnly: viewOnly
          },
          force: true
        });
      });

      this.event('createTermsAndConditions', function(ctx) {
        this.goto('./vendor/termsAndConditions/create', {
          context: ctx
        });
      });

      this.event('setVendorActiveTermsAndConditions', function(terms, vendor) {
        terms.makeActive(vendor).then(() => {
          CMM.appState.allVendorTermsAndConditions = CMM.TermsAndConditions.query({
            vendorId: vendor.id
          });
          CMM.flash.dismiss();
          CMM.statechart.send('returnToVendorTsAndCs', true);
        });
      });

      this.event('returnToVendorTsAndCs', function(force) {
        this.goto('./vendor/show', {
          context: {
            viewOnly: false,
            vendor: CMM.appState.searchDetailsCardModel.id,
            tab: 'vendorTerms',
          },
          force: force
        });
      });

      this.event('createVendorContact', function(context) {
        this.goto('./vendor/contact/create', {
          context: context
        });
      });

      this.event('searchVendorContact', function(context) {
        this.goto('./vendor/contact/search',
          ...(context ? [{
            context
          }] : [])
        );
      });

      this.event('contactCreated', function(contact) {
        CMM.analytics.track('contactCreated', {
          agencyId: contact.agencyId,
          contactId: contact.id
        });
      });

      this.event('showVendorContact', function(contact, viewOnly, vendor) {
        this.goto('./vendor/contact/show', {
          context: {
            viewOnly,
            vendor,
            contact
          }
        });
      });

      this.event('editVendorContact', function(contactId) {
        this.goto('./vendor/contact/edit', {
          context: {
            contact: contactId
          }
        });
      });

      this.event('createVendor', function(propertyVendorId) {
        this.goto('./vendor/create');
      });

      this.event('closeGlobalSearchModal', function() {
        this.goto('./off');
      });
    });
  });
});


export default CMM.globalSearchState;