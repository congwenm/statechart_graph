window.cmm_state = {
  "level": 0,
  "isActive": true,
  "name": "__root__",
  "concurrent": false,
  "events": [
    {
      "name": "logout",
      "func": "function () {\n\t  CMM.analytics.track('loggedOut');\n\t  window.location.href = '/auth/logout';\n\t}"
    },
    {
      "name": "toggleAppDrawer",
      "func": "function () {\n\t  CMM.appState.appDrawerEnabled = !CMM.appState.appDrawerEnabled;\n\t}"
    }
  ],
  "children": [
    {
      "level": 1,
      "isActive": false,
      "name": "unknown-route",
      "concurrent": false,
      "events": [

      ],
      "children": null
    },
    {
      "level": 1,
      "isActive": true,
      "name": "app",
      "concurrent": true,
      "events": [
        {
          "name": "saveNewTermsAndConditions",
          "func": "function () {\n\t    CMM.analytics.track('t&CAdded');\n\t  }"
        }
      ],
      "children": [
        {
          "level": 2,
          "isActive": true,
          "name": "globalSearch",
          "concurrent": false,
          "events": [

          ],
          "children": [
            {
              "level": 3,
              "isActive": true,
              "name": "off",
              "concurrent": false,
              "events": [
                {
                  "name": "toggleGlobalSearch",
                  "func": "function () {\n\t      this.goto('../on');\n\t    }"
                },
                {
                  "name": "showProperty",
                  "func": "function (propertyId) {\n\t      this.goto('../on/resultModal/property/show', {\n\t        context: {\n\t          property: propertyId\n\t        }\n\t      });\n\t    }"
                },
                {
                  "name": "showVendor",
                  "func": "function (vendorId) {\n\t      this.goto('../on/resultModal/vendor/show', {\n\t        context: {\n\t          vendor: vendorId\n\t        }\n\t      });\n\t    }"
                }
              ],
              "children": null
            },
            {
              "level": 3,
              "isActive": false,
              "name": "on",
              "concurrent": true,
              "events": [

              ],
              "children": [
                {
                  "level": 4,
                  "isActive": false,
                  "name": "search",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "toggleGlobalSearch",
                      "func": "function () {\n\t        if (!CMM.utils.userCan('manageGlobalDirectory', 'frontend')) {\n\t          this.goto('../../off');\n\t        }\n\t      }"
                    },
                    {
                      "name": "redoGlobalSearch",
                      "func": "function () {\n\t        var _this = this;\n\t        window.setTimeout(function () {\n\t          _this.goto('.', {\n\t            force: true\n\t          });\n\t        });\n\t      }"
                    },
                    {
                      "name": "searchQueryChanged",
                      "func": "function () {\n\t        var searchQuery = CMM.appState.searchQuery;\n\t        var _this = this;\n\n\t        window.setTimeout(function () {\n\t          _this.params({\n\t            search: searchQuery.query,\n\t            searchType: searchQuery.type\n\t          });\n\t        });\n\n\t        searchQuery.page = 1;\n\t        CMM.appState.searchResults.query({ searchQuery: searchQuery });\n\n\t        CMM.analytics.track('directorySearched', {\n\t          'query': searchQuery.query\n\t        });\n\t      }"
                    },
                    {
                      "name": "loadMoreSearchResults",
                      "func": "function () {\n\t        var searchQuery = CMM.appState.searchQuery;\n\t        searchQuery.page = (searchQuery.page || 1) + 1;\n\n\t        var nextPage = CMM.SearchResult.query({ searchQuery: searchQuery });\n\t        nextPage.then(function () {\n\t          var searchResults = CMM.appState.searchResults;\n\t          searchResults.push.apply(searchResults, nextPage);\n\t          CMM.appState.searchResults.meta = nextPage.meta;\n\t        });\n\t      }"
                    },
                    {
                      "name": "addVendorToPlan",
                      "func": "function (vendorid) {\n\t        CMM.appState.selectedMediaPlan.add(vendorid);\n\t      }"
                    }
                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "addPropertyToPlan",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": [
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "off",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "addToPlan",
                          "func": "function (propertyId) {\n\t          var _this2 = this;\n\n\t          var propertyModel = CMM.Property.get(propertyId, {\n\t            refresh: true\n\t          });\n\t          propertyModel.then(function () {\n\t            var campaign = CMM.appState.campaign;\n\n\t            if (CMM.utils.isVendorUser()) {\n\t              var vendor = campaign.buys.first.vendor;\n\t              CMM.appState.selectedMediaPlan.add(vendor.id, vendor.propertyVendors.find(function (pv) {\n\t                return pv.property === propertyModel;\n\t              }).id, []);\n\t            } else {\n\t              if (propertyModel.activePropertyVendors.length > 1) {\n\t                _this2.goto('../on', {\n\t                  context: {\n\t                    property: propertyId\n\t                  }\n\t                });\n\t              } else if (propertyModel.activePropertyVendors.length === 1) {\n\t                _this2.goto('../on/chooseContactModal', {\n\t                  context: {\n\t                    property: propertyId,\n\t                    propertyVendor: propertyModel.activePropertyVendors[0].id,\n\t                    vendor: propertyModel.activePropertyVendors[0].vendor.id\n\t                  }\n\t                });\n\t              } else {\n\t                CMM.flash.alert(\"This property has been deactivated\");\n\t              }\n\t            }\n\t          });\n\t        }"
                        }
                      ],
                      "children": null
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "on",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "closeAddPropertyModal",
                          "func": "function () {\n\t          this.goto('../off');\n\t        }"
                        },
                        {
                          "name": "showProperty",
                          "func": "function (propertyId, tab) {\n\t          navigationHistory.unshift({\n\t            event: 'showProperty',\n\t            args: [propertyId, tab, /* viewOnly */true]\n\t          });\n\t        }"
                        },
                        {
                          "name": "showVendor",
                          "func": "function (vendorId, tab) {\n\t          navigationHistory.unshift({\n\t            event: 'showVendor',\n\t            args: [vendorId, tab, /* editMode */false, /* viewOnly */true]\n\t          });\n\t        }"
                        },
                        {
                          "name": "showVendorContact",
                          "func": "function (contactId, viewOnly, vendorId) {\n\t          navigationHistory.unshift({\n\t            event: 'showVendorContact',\n\t            args: [contactId, /* viewOnly */true, /* venderId */vendorId]\n\t          });\n\t        }"
                        },
                        {
                          "name": "selectTab",
                          "func": "function (tab) {\n\t          var currentItem = navigationHistory[0];\n\t          // Update the latest history so the user backs into the same tab they\n\t          // left\n\t          if (currentItem && (currentItem.event === 'showVendor' || currentItem.event === 'showProperty')) {\n\t            currentItem.args[1] = tab;\n\t          }\n\t        }"
                        },
                        {
                          "name": "openChooseVendorModal",
                          "func": "function (property, selectedPropertyVendor) {\n\t          this.goto('chooseVendorModal', {\n\t            context: {\n\t              property: property,\n\t              selectedPropertyVendor: selectedPropertyVendor\n\t            }\n\t          });\n\t        }"
                        },
                        {
                          "name": "goBack",
                          "func": "function () {\n\t          navigationHistory.shift();\n\t          if (navigationHistory && navigationHistory.length) {\n\t            var _CMM$statechart;\n\n\t            var _navigationHistory$sh = navigationHistory.shift();\n\n\t            var event = _navigationHistory$sh.event;\n\t            var args = _navigationHistory$sh.args;\n\n\t            (_CMM$statechart = CMM.statechart).send.apply(_CMM$statechart, [event].concat(_toConsumableArray(args)));\n\t          } else {\n\t            // Reenter child state to refresh all data\n\t            var _substateMap = this.substateMap;\n\t            var chooseContactModal = _substateMap.chooseContactModal;\n\t            var chooseVendorModal = _substateMap.chooseVendorModal;\n\n\t            var targetChildState = void 0;\n\t            if (chooseContactModal.isCurrent('.')) {\n\t              targetChildState = chooseContactModal;\n\t            } else {\n\t              if (chooseVendorModal.isCurrent('.')) {\n\t                targetChildState = chooseVendorModal;\n\t              } else {\n\t                targetChildState = null;\n\t              }\n\t            }\n\n\t            if (targetChildState) {\n\t              targetChildState.goto('.', {\n\t                force: true,\n\t                context: {\n\t                  property: CMM.appState.addPropertyModel.id,\n\t                  propertyVendor: CMM.appState.contactsForPropertyVendorId,\n\t                  vendor: CMM.appState.contactsFor && CMM.appState.contactsFor.id\n\t                }\n\t              });\n\t              CMM.statechart.send('closeGlobalSearchModal');\n\t            }\n\t          }\n\t        }"
                        }
                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "chooseVendorModal",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "openChooseContactModal",
                              "func": "function (propertyVendor) {\n\t            navigationHistory.unshift({\n\t              event: 'openChooseVendorModal',\n\t              args: [propertyVendor.property.id, propertyVendor]\n\t            });\n\t            navigationHistory.unshift({\n\t              event: 'openChooseContactModal',\n\t              args: [propertyVendor]\n\t            });\n\n\t            this.goto('../chooseContactModal', {\n\t              context: {\n\t                propertyVendor: propertyVendor.id,\n\t                vendor: propertyVendor.vendor.id\n\t              }\n\t            });\n\t          }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "chooseContactModal",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "chooseContactModalGoBack",
                              "func": "function () {\n\t            CMM.statechart.send('goBack');\n\t          }"
                            },
                            {
                              "name": "closeChooseContactModal",
                              "func": "function () {\n\t            this.goto('../../off');\n\t          }"
                            },
                            {
                              "name": "addPropertyVendorToPlan",
                              "func": "function (selectedContacts) {\n\t            CMM.appState.selectedMediaPlan.add(CMM.appState.contactsFor.id, CMM.appState.contactsForPropertyVendorId, selectedContacts).catch(function () {\n\t              CMM.flash.alert('Could not add property or vendor to plan');\n\t            });\n\t            this.goto('../../off');\n\t          }"
                            }
                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "contactList",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "addNewContact",
                                  "func": "function (contactType) {\n\t              CMM.statechart.send('searchVendorContact', {\n\t                vendor: CMM.appState.contactsFor.id,\n\t                editMode: false,\n\t                viewOnly: false\n\t              });\n\t            }"
                                },
                                {
                                  "name": "successfullyAssociatedContact",
                                  "func": "function () {\n\t              CMM.appState.contacts = CMM.Contact.query({\n\t                propertyVendorId: CMM.appState.contactsForPropertyVendorId\n\t              });\n\t            }"
                                },
                                {
                                  "name": "successfullyCreatedContact",
                                  "func": "function () {\n\t              CMM.appState.contacts = CMM.Contact.query({\n\t                propertyVendorId: CMM.appState.contactsForPropertyVendorId\n\t              });\n\t            }"
                                }
                              ],
                              "children": null
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "deactivate",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": [
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "off",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "showDeactivateModal",
                          "func": "function (model) {\n\t      this.goto('../on', { context: { model: model } });\n\t    }"
                        }
                      ],
                      "children": null
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "on",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "deactivationSuccess",
                          "func": "function (model) {\n\t      var isProperty = model instanceof CMM.Property;\n\t      var isVendor = model instanceof CMM.Vendor;\n\t      var isPropertyVendor = model instanceof CMM.PropertyVendor;\n\n\t      CMM.flash.confirm((isProperty ? 'Property' : 'Vendor') + ' deactivated.');\n\t      if (isProperty) {\n\t        CMM.flash.confirm('Property deactivated.');\n\t        CMM.analytics.track('propertyDeactivated', { propertyId: model.id });\n\t      } else if (isVendor) {\n\t        CMM.flash.confirm('Vendor deactivated.');\n\t        CMM.analytics.track('vendorDeactivated', { vendorId: model.id });\n\t      } else if (isPropertyVendor) {\n\t        CMM.flash.confirm('Property removed from vendor');\n\t        CMM.analytics.track('disassociateVendorProperty', {\n\t          propertyId: model.property.id,\n\t          vendorId: model.vendor.id\n\t        });\n\t      }\n\n\t      this.goto('../off');\n\n\t      if (isProperty) {\n\t        CMM.statechart.send('showProperty', model.id);\n\t      } else if (isVendor) {\n\t        CMM.statechart.send('showVendor', model.id);\n\t      } else if (isPropertyVendor) {\n\t        CMM.statechart.send('showVendor', model.vendor.id, 'properties');\n\t      }\n\t    }"
                        },
                        {
                          "name": "cancelDeactivation",
                          "func": "function (model) {\n\t      var isProperty = model instanceof CMM.Property;\n\t      var isVendor = model instanceof CMM.Vendor;\n\t      var isPropertyVendor = model instanceof CMM.PropertyVendor;\n\n\t      this.goto('../off');\n\n\t      if (isProperty) {\n\t        CMM.statechart.send('showProperty', model.id);\n\t      } else if (isVendor) {\n\t        CMM.statechart.send('showVendor', model.id);\n\t      } else if (isPropertyVendor) {\n\t        CMM.statechart.send('showVendor', model.vendor.id, 'properties');\n\t      }\n\t    }"
                        },
                        {
                          "name": "showVendorContact",
                          "func": "function (contactId) {\n\t      CMM.appState.deactivationModel = undefined;\n\t      navigationHistory.unshift({\n\t        event: 'showVendorContact',\n\t        args: [contactId, /* viewOnly */true]\n\t      });\n\t    }"
                        },
                        {
                          "name": "showProperty",
                          "func": "function (propertyId, tab) {\n\t      CMM.appState.deactivationModel = undefined;\n\t      navigationHistory.unshift({\n\t        event: 'showProperty',\n\t        args: [propertyId, tab, /* viewOnly */true]\n\t      });\n\t    }"
                        },
                        {
                          "name": "showVendor",
                          "func": "function (vendorId, tab) {\n\t      CMM.appState.deactivationModel = undefined;\n\t      navigationHistory.unshift({\n\t        event: 'showVendor',\n\t        args: [vendorId, tab, /* editMode */false, /* viewOnly */true]\n\t      });\n\t    }"
                        },
                        {
                          "name": "selectTab",
                          "func": "function (tab) {\n\t      var currentItem = navigationHistory[0];\n\t      // Update the latest history so the user backs into the same tab they\n\t      // left\n\t      if (currentItem && (currentItem.event === 'showVendor' || currentItem.event === 'showProperty')) {\n\t        currentItem.args[/* tab index */1] = tab;\n\t      }\n\t    }"
                        },
                        {
                          "name": "goBack",
                          "func": "function () {\n\t      navigationHistory.shift();\n\t      if (navigationHistory && navigationHistory.length) {\n\t        var _CMM$statechart;\n\n\t        var _navigationHistory$sh = navigationHistory.shift();\n\n\t        var event = _navigationHistory$sh.event;\n\t        var args = _navigationHistory$sh.args;\n\n\t        (_CMM$statechart = CMM.statechart).send.apply(_CMM$statechart, [event].concat(_toConsumableArray(args)));\n\t      } else {\n\t        CMM.statechart.send('closeGlobalSearchModal');\n\t        this.goto('.', { context: { model: deactivationModel }, force: true });\n\t      }\n\t    }"
                        }
                      ],
                      "children": null
                    }
                  ]
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "resultModal",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "showProperty",
                      "func": "function (propertyId, tab, viewOnly) {\n\t        this.goto('./property/show', {\n\t          context: {\n\t            property: propertyId,\n\t            tab: tab,\n\t            viewOnly: viewOnly\n\t          },\n\t          force: true\n\t        });\n\t      }"
                    },
                    {
                      "name": "createProperty",
                      "func": "function (presetVendor) {\n\t        this.goto('./property/create', {\n\t          context: {\n\t            presetVendor: presetVendor\n\t          }\n\t        });\n\t      }"
                    },
                    {
                      "name": "showVendor",
                      "func": "function (vendorId, tab, editMode, viewOnly) {\n\t        this.goto('./vendor/show', {\n\t          context: {\n\t            vendor: vendorId,\n\t            tab: tab,\n\t            editMode: editMode,\n\t            viewOnly: viewOnly\n\t          },\n\t          force: true\n\t        });\n\t      }"
                    },
                    {
                      "name": "createTermsAndConditions",
                      "func": "function (ctx) {\n\t        this.goto('./vendor/termsAndConditions/create', {\n\t          context: ctx\n\t        });\n\t      }"
                    },
                    {
                      "name": "setVendorActiveTermsAndConditions",
                      "func": "function (terms, vendor) {\n\t        terms.makeActive(vendor).then(function () {\n\t          CMM.appState.allVendorTermsAndConditions = CMM.TermsAndConditions.query({\n\t            vendorId: vendor.id\n\t          });\n\t          CMM.flash.dismiss();\n\t          CMM.statechart.send('returnToVendorTsAndCs', true);\n\t        });\n\t      }"
                    },
                    {
                      "name": "returnToVendorTsAndCs",
                      "func": "function (force) {\n\t        this.goto('./vendor/show', {\n\t          context: {\n\t            viewOnly: false,\n\t            vendor: CMM.appState.searchDetailsCardModel.id,\n\t            tab: 'vendorTerms'\n\t          },\n\t          force: force\n\t        });\n\t      }"
                    },
                    {
                      "name": "createVendorContact",
                      "func": "function (context) {\n\t        this.goto('./vendor/contact/create', {\n\t          context: context\n\t        });\n\t      }"
                    },
                    {
                      "name": "searchVendorContact",
                      "func": "function (context) {\n\t        this.goto.apply(this, ['./vendor/contact/search'].concat(_toConsumableArray(context ? [{\n\t          context: context\n\t        }] : [])));\n\t      }"
                    },
                    {
                      "name": "contactCreated",
                      "func": "function (contact) {\n\t        CMM.analytics.track('contactCreated', {\n\t          agencyId: contact.agencyId,\n\t          contactId: contact.id\n\t        });\n\t      }"
                    },
                    {
                      "name": "showVendorContact",
                      "func": "function (contact, viewOnly, vendor) {\n\t        this.goto('./vendor/contact/show', {\n\t          context: {\n\t            viewOnly: viewOnly,\n\t            vendor: vendor,\n\t            contact: contact\n\t          }\n\t        });\n\t      }"
                    },
                    {
                      "name": "editVendorContact",
                      "func": "function (contactId) {\n\t        this.goto('./vendor/contact/edit', {\n\t          context: {\n\t            contact: contactId\n\t          }\n\t        });\n\t      }"
                    },
                    {
                      "name": "createVendor",
                      "func": "function (propertyVendorId) {\n\t        this.goto('./vendor/create');\n\t      }"
                    },
                    {
                      "name": "closeGlobalSearchModal",
                      "func": "function () {\n\t        this.goto('./off');\n\t      }"
                    }
                  ],
                  "children": [
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "off",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": null
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "property",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "create",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "toggleEditProperty",
                              "func": "function () {\n\t            this.goto('../../off');\n\t          }"
                            },
                            {
                              "name": "propertySaved",
                              "func": "function (property) {\n\t            CMM.flash.confirm('Property created successfully!');\n\t            CMM.analytics.track('propertyCreated', {\n\t              propertyId: property.id,\n\t              propertyName: property.name\n\t            });\n\t            this.goto('../show', {\n\t              context: {\n\t                property: CMM.appState.searchDetailsCardModel.id\n\t              }\n\t            });\n\t          }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "show",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "selectTab",
                              "func": "function selectTab(tab) {\n\t        CMM.appState.cardTab = tab;\n\t        _this.params({\n\t          tab: tab\n\t        });\n\t      }"
                            }
                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "edit",
                              "concurrent": false,
                              "events": [

                              ],
                              "children": [
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "off",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "toggleEditProperty",
                                      "func": "function () {\n\t                this.goto('../on');\n\t              }"
                                    }
                                  ],
                                  "children": null
                                },
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "on",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "toggleEditProperty",
                                      "func": "function () {\n\t                var _this = this;\n\t                CMM.appState.searchDetailsCardModel.get().then(function () {\n\t                  _this.goto('../off');\n\t                });\n\t              }"
                                    },
                                    {
                                      "name": "propertySaved",
                                      "func": "function () {\n\t                CMM.flash.confirm('Changes saved successfully!');\n\t                this.goto('../off');\n\t              }"
                                    }
                                  ],
                                  "children": null
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "vendor",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "refreshVendors",
                          "func": "function () {\n\t          window.setTimeout(function () {\n\t            CMM.appState.searchResults = CMM.SearchResult.query({ searchQuery: CMM.appState.searchQuery });\n\t          }, 500);\n\t        }"
                        }
                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "create",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "vendorSaved",
                              "func": "function (vendor) {\n\t            CMM.flash.confirm('Vendor created successfully!');\n\t            CMM.analytics.track('vendorCreated', {\n\t              vendorId: vendor.id,\n\t              vendorName: vendor.name,\n\t              vendorType: vendor.typeName\n\t            });\n\t            CMM.statechart.send('refreshVendors');\n\t            this.goto('../show', {\n\t              context: {\n\t                vendor: CMM.appState.searchDetailsCardModel.id\n\t              }\n\t            });\n\t          }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "contact",
                          "concurrent": false,
                          "events": [

                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "search",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "successfullyAssociatedContact",
                                  "func": "function () {\n\t              if (CMM.appState.addPropertyDialog) {\n\t                CMM.statechart.send('closeGlobalSearchModal');\n\t              } else {\n\t                CMM.statechart.send('showVendor', this.params().vendor, 'contacts');\n\t              }\n\t            }"
                                },
                                {
                                  "name": "cancelAssociateContact",
                                  "func": "function () {\n\t              this.send('successfullyAssociatedContact');\n\t            }"
                                }
                              ],
                              "children": null
                            },
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "show",
                              "concurrent": false,
                              "events": [

                              ],
                              "children": null
                            },
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "create",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "successfullyCreatedContact",
                                  "func": "function () {\n\t              if (CMM.appState.addPropertyDialog) {\n\t                CMM.statechart.send('closeGlobalSearchModal');\n\t              } else {\n\t                CMM.statechart.send('showVendor', this.params().vendor, 'contacts');\n\t              }\n\t            }"
                                }
                              ],
                              "children": null
                            },
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "edit",
                              "concurrent": false,
                              "events": [

                              ],
                              "children": null
                            }
                          ]
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "termsAndConditions",
                          "concurrent": false,
                          "events": [

                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "create",
                              "concurrent": false,
                              "events": [

                              ],
                              "children": null
                            }
                          ]
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "show",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "selectTab",
                              "func": "function (tab) {\n\t            updateNoActiveTermsAlert(tab);\n\t            selectTab(tab);\n\t          }"
                            },
                            {
                              "name": "vendorSaved",
                              "func": "function () {\n\t            CMM.flash.confirm('Changes saved successfully!');\n\t            CMM.statechart.send('refreshVendors');\n\t            this.goto('./edit/off');\n\t          }"
                            }
                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "edit",
                              "concurrent": false,
                              "events": [

                              ],
                              "children": [
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "off",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "toggleEditVendor",
                                      "func": "function () {\n\t                this.goto('../on');\n\t              }"
                                    }
                                  ],
                                  "children": null
                                },
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "on",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "toggleEditVendor",
                                      "func": "function () {\n\t                var _this = this;\n\t                CMM.appState.searchDetailsCardModel.get().then(function () {\n\t                  _this.goto('../off');\n\t                });\n\t              }"
                                    }
                                  ],
                                  "children": null
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "level": 2,
          "isActive": true,
          "name": "printPreview",
          "concurrent": false,
          "events": [

          ],
          "children": [
            {
              "level": 3,
              "isActive": true,
              "name": "off",
              "concurrent": false,
              "events": [
                {
                  "name": "showIOPrintPreview",
                  "func": "function (order) {\n\t      var _this = this;\n\n\t      order.ensureFullyLoaded().then(function () {\n\t        _this.goto('../on', {\n\t          context: {\n\t            printPreviewComponent: {\n\t              header: React.createElement(_IOPrintPreview.IOPrintPreviewHeader, { order: order }),\n\t              body: React.createElement(_IOPrintPreview.IOPrintPreviewBody, { order: order })\n\t            }\n\t          }\n\t        });\n\t      });\n\t    }"
                },
                {
                  "name": "showPrintPreview",
                  "func": "function (printPreviewComponent) {\n\t      this.goto('../on', {\n\t        context: {\n\t          printPreviewComponent: printPreviewComponent\n\t        }\n\t      });\n\t    }"
                }
              ],
              "children": null
            },
            {
              "level": 3,
              "isActive": false,
              "name": "on",
              "concurrent": false,
              "events": [
                {
                  "name": "hidePrintPreview",
                  "func": "function () {\n\t      this.goto('../off');\n\t    }"
                }
              ],
              "children": null
            }
          ]
        },
        {
          "level": 2,
          "isActive": true,
          "name": "documentation",
          "concurrent": false,
          "events": [

          ],
          "children": [
            {
              "level": 3,
              "isActive": true,
              "name": "closed",
              "concurrent": false,
              "events": [
                {
                  "name": "toggleDocumentation",
                  "func": "function () {\n\t      this.goto('../open');\n\t    }"
                }
              ],
              "children": null
            },
            {
              "level": 3,
              "isActive": false,
              "name": "open",
              "concurrent": false,
              "events": [
                {
                  "name": "toggleDocumentation",
                  "func": "function () {\n\t      this.goto('../closed');\n\t    }"
                }
              ],
              "children": null
            }
          ]
        },
        {
          "level": 2,
          "isActive": true,
          "name": "supportMessage",
          "concurrent": false,
          "events": [

          ],
          "children": [
            {
              "level": 3,
              "isActive": true,
              "name": "closed",
              "concurrent": false,
              "events": [
                {
                  "name": "toggleSupportMessage",
                  "func": "function () {\n\t      this.goto('../open');\n\t    }"
                }
              ],
              "children": null
            },
            {
              "level": 3,
              "isActive": false,
              "name": "open",
              "concurrent": false,
              "events": [
                {
                  "name": "toggleSupportMessage",
                  "func": "function () {\n\t      this.goto('../closed');\n\t    }"
                },
                {
                  "name": "submitSupportMessage",
                  "func": "function (supportMessageModel) {\n\t      var _this = this;\n\t      supportMessageModel.save().then(function () {\n\t        _this.goto('../closed');\n\t        CMM.appState.supportMessage = new CMM.SupportMessage();\n\t        CMM.flash.confirm(\"Message Sent! Please check your email for a response.\");\n\t        CMM.analytics.track('issueSubmitted');\n\t      });\n\t    }"
                }
              ],
              "children": null
            }
          ]
        },
        {
          "level": 2,
          "isActive": true,
          "name": "about",
          "concurrent": false,
          "events": [

          ],
          "children": [
            {
              "level": 3,
              "isActive": true,
              "name": "closed",
              "concurrent": false,
              "events": [
                {
                  "name": "toggleAbout",
                  "func": "function () {\n\t      this.goto('../open');\n\t    }"
                }
              ],
              "children": null
            },
            {
              "level": 3,
              "isActive": false,
              "name": "open",
              "concurrent": false,
              "events": [
                {
                  "name": "toggleAbout",
                  "func": "function () {\n\t      this.goto('../closed');\n\t    }"
                }
              ],
              "children": null
            }
          ]
        },
        {
          "level": 2,
          "isActive": true,
          "name": "notifications",
          "concurrent": false,
          "events": [

          ],
          "children": [
            {
              "level": 3,
              "isActive": true,
              "name": "closed",
              "concurrent": false,
              "events": [
                {
                  "name": "toggleNotifications",
                  "func": "function () {\n\t      this.goto('../open');\n\t    }"
                }
              ],
              "children": null
            },
            {
              "level": 3,
              "isActive": false,
              "name": "open",
              "concurrent": false,
              "events": [
                {
                  "name": "loadMoreNotifications",
                  "func": "function () {\n\t      CMM.appState.notificationItemList.getNextPage();\n\t    }"
                },
                {
                  "name": "toggleNotifications",
                  "func": "function () {\n\t      this.goto('../closed');\n\t    }"
                }
              ],
              "children": null
            }
          ]
        },
        {
          "level": 2,
          "isActive": true,
          "name": "accountSelection",
          "concurrent": false,
          "events": [

          ],
          "children": [
            {
              "level": 3,
              "isActive": true,
              "name": "off",
              "concurrent": false,
              "events": [
                {
                  "name": "accountSelection",
                  "func": "function (ctx) {\n\t      this.goto('../on', { context: ctx });\n\t    }"
                }
              ],
              "children": null
            },
            {
              "level": 3,
              "isActive": false,
              "name": "on",
              "concurrent": false,
              "events": [
                {
                  "name": "goBack",
                  "func": "function () {\n\t      var history = navigationHistory.shift();\n\t      if (history && history.state) {\n\t        this.goto('./' + history.state, { context: history.context });\n\t      } else {\n\t        this.goto('../off');\n\t      }\n\t    }"
                },
                {
                  "name": "createSizmekAccount",
                  "func": "function () {\n\t      this.goto('./sizmekConnect');\n\t    }"
                },
                {
                  "name": "reconnectSizmekAccount",
                  "func": "function (account) {\n\t      this.goto('./sizmekConnect', { context: { account: account } });\n\t    }"
                },
                {
                  "name": "createOauthAccount",
                  "func": "function (adServerName) {\n\t      CMM.statechart.send('oauth', { connection: 'create', adServerName: adServerName });\n\t    }"
                },
                {
                  "name": "reconnectOauthAccount",
                  "func": "function (account) {\n\t      CMM.statechart.send('oauth', {\n\t        connection: 'reconnect',\n\t        account: account,\n\t        oldAccount: CMM.appState.account,\n\t        closeAccountDialog: closeAccountDialog\n\t      });\n\n\t      if (CMM.appState.account === account && closeAccountDialog) this.goto('../off');\n\t    }"
                }
              ],
              "children": [
                {
                  "level": 4,
                  "isActive": false,
                  "name": "selectAccountDialog",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "closeAccountSelection",
                      "func": "function () {\n\t        this.goto('../../off');\n\t        CMM.statechart.send('accountDialogOff');\n\t      }"
                    },
                    {
                      "name": "selectAccount",
                      "func": "function (account) {\n\t        if (onAccountSelected) {\n\t          if (closeAccountDialog) this.goto('../../off');\n\t          onAccountSelected(account);\n\t        } else {\n\t          this.goto('../../off');\n\t        }\n\t      }"
                    },
                    {
                      "name": "newAccountSelected",
                      "func": "function (oldAccount, newAccount, profile) {\n\t        var _this = this;\n\n\t        CMM.Account.remapProfiles(oldAccount, newAccount, profile).then(function (response) {\n\t          var message = response.data.msg || newAccount.reconnectedMessage;\n\t          CMM.flash.confirm(message);\n\t          _this.goto('../../off');\n\t        }).catch(function (response) {\n\t          if (response.data.custom_error) {\n\t            CMM.flash.alert(response.data.msg);\n\t          } else {\n\t            var adServerName = CMM.AdServer.find(oldAccount.adserver).name;\n\t            CMM.flash.alertWithSubmitIssue(adServerName + ' account ' + oldAccount.identity + ' could not be updated.');\n\t            _this.goto('../off');\n\t          }\n\t        });\n\t      }"
                    }
                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "selectProfileDialog",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "closeProfileSelection",
                      "func": "function () {\n\t        this.goto('../../off');\n\t        CMM.statechart.send('profileDialogOff');\n\t      }"
                    },
                    {
                      "name": "selectProfile",
                      "func": "function (profile) {\n\t        this.goto('../../off');\n\t        if (this.onProfileSelected) {\n\t          this.onProfileSelected(profile);\n\t        }\n\t      }"
                    }
                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "sizmekConnect",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "closeSizmek",
                      "func": "function (adServerName) {\n\t        CMM.statechart.send('goBack');\n\t      }"
                    },
                    {
                      "name": "saveSizmekAccount",
                      "func": "function (account, onError) {\n\t        var _this2 = this;\n\n\t        account.save().then(function (result) {\n\t          // TODO: refactor to remove this additional query\n\t          CMM.appState.accounts = CMM.Account.query();\n\t          var oldAccount = CMM.appState.account;\n\n\t          if (account.isNew) {\n\t            CMM.flash.confirm('Sizmek account added successfully!');\n\t            CMM.analytics.track('thirdPartyAccountConnected', { serviceName: 'sizmek_ad_server' });\n\t            CMM.statechart.send('goBack');\n\t          } else {\n\t            CMM.flash.confirm(account.identity + ' is connected and delivery data will resume.');\n\t            CMM.analytics.track('thirdPartyAccountReconnected', { serviceName: 'sizmek_ad_server' });\n\t            if (oldAccount === account && closeAccountDialog) {\n\t              _this2.goto('../../off');\n\t            } else {\n\t              CMM.statechart.send('goBack');\n\t            }\n\t          }\n\t        }).catch(function (response) {\n\t          if ('invalid_credentials' in response) {\n\t            if (onError) onError();\n\t          } else {\n\t            CMM.flash.alert('An error occurred.');\n\t            CMM.statechart.send('goBack');\n\t          }\n\t        });\n\t      }"
                    }
                  ],
                  "children": null
                }
              ]
            }
          ]
        },
        {
          "level": 2,
          "isActive": true,
          "name": "oauth",
          "concurrent": false,
          "events": [

          ],
          "children": [
            {
              "level": 3,
              "isActive": true,
              "name": "off",
              "concurrent": false,
              "events": [
                {
                  "name": "oauth",
                  "func": "function (ctx) {\n\t      this.goto('../on', { context: ctx });\n\t    }"
                }
              ],
              "children": null
            },
            {
              "level": 3,
              "isActive": false,
              "name": "on",
              "concurrent": false,
              "events": [

              ],
              "children": [
                {
                  "level": 4,
                  "isActive": false,
                  "name": "oauthCreate",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "oauthReconnect",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                }
              ]
            }
          ]
        },
        {
          "level": 2,
          "isActive": true,
          "name": "mainView",
          "concurrent": false,
          "events": [

          ],
          "children": [
            {
              "level": 3,
              "isActive": false,
              "name": "dashboard",
              "concurrent": false,
              "events": [

              ],
              "children": [
                {
                  "level": 4,
                  "isActive": false,
                  "name": "none",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "vendor",
                  "concurrent": true,
                  "events": [
                    {
                      "name": "buySelected",
                      "func": "function (campaignId, buyId) {\n\t      this.goto('../../campaign', {\n\t        context: {\n\t          campaignId: campaignId,\n\t          buyId: buyId\n\t        }\n\t      });\n\t    }"
                    }
                  ],
                  "children": [
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "activity",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "closed",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "toggleActivityDashboard",
                              "func": "function () {\n\t          this.goto('../open');\n\t        }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "open",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "showOlderFeedItems",
                              "func": "function () {\n\t          CMM.appState.feedItems.fetchNextPage();\n\t        }"
                            },
                            {
                              "name": "toggleActivityDashboard",
                              "func": "function () {\n\t          this.goto('../closed');\n\t        }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "buyNotes",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "showDashboardBuyNotes",
                          "func": "function (dashboardBuy) {\n\t        this.goto('./open', {\n\t          context: {\n\t            dashboardBuy: dashboardBuy\n\t          }\n\t        });\n\t      }"
                        },
                        {
                          "name": "hideDashboardNotes",
                          "func": "function () {\n\t        this.goto('./closed');\n\t      }"
                        }
                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "closed",
                          "concurrent": false,
                          "events": [

                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "open",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "saveDashboardNotes",
                              "func": "function (dashboardBuy) {\n\t          var _this = this;\n\t          dashboardBuy.save().then(function () {\n\t            CMM.flash.confirm('Note saved!');\n\t            _this.goto('../closed');\n\t          })[\"catch\"](function () {\n\t            CMM.flash.alert('Error saving note!');\n\t          });\n\t        }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    }
                  ]
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "agency",
                  "concurrent": true,
                  "events": [
                    {
                      "name": "initiativeSelected",
                      "func": "function (initiative) {\n\t      this.goto('../../initiative', {\n\t        context: { initiativeId: initiative.id }\n\t      });\n\t    }"
                    },
                    {
                      "name": "campaignSelected",
                      "func": "function (campaign) {\n\t      this.goto('../../campaign', {\n\t        context: {\n\t          campaignId: campaign.id\n\t        }\n\t      });\n\t    }"
                    }
                  ],
                  "children": [
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "view",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "myCampaigns",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "toggleView",
                              "func": "function () {\n\t          this.goto('../allCampaigns');\n\t        }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "allCampaigns",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "toggleView",
                              "func": "function () {\n\t          this.goto('../myCampaigns');\n\t        }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "campaignNotes",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "showCampaignNotes",
                          "func": "function (campaign) {\n\t        this.goto('./open', {\n\t          context: {\n\t            campaign: campaign\n\t          }\n\t        });\n\t      }"
                        },
                        {
                          "name": "hideDashboardNotes",
                          "func": "function () {\n\t        this.goto('./closed');\n\t      }"
                        }
                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "closed",
                          "concurrent": false,
                          "events": [

                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "open",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "saveDashboardNotes",
                              "func": "function (campaign) {\n\t          var _this2 = this;\n\n\t          campaign.save({ type: 'set_dashboard_note' }).then(function () {\n\t            CMM.flash.confirm('Note saved!');\n\t            _this2.goto('../closed');\n\t          }).catch(function () {\n\t            CMM.flash.alert('Error saving note!');\n\t          });\n\t        }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "activity",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "closed",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "toggleActivityDashboard",
                              "func": "function () {\n\t          this.goto('../open');\n\t        }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "open",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "showOlderFeedItems",
                              "func": "function () {\n\t          CMM.appState.feedItems.fetchNextPage();\n\t        }"
                            },
                            {
                              "name": "toggleActivityDashboard",
                              "func": "function () {\n\t          this.goto('../closed');\n\t        }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "dialog",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "none",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "createInitiative",
                              "func": "function () {\n\t          this.goto('../createInitiative');\n\t        }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "createInitiative",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "initiativeSaved",
                              "func": "function () {\n\t          var initiative = CMM.appState.initiative;\n\t          CMM.analytics.track('initiativeCreated', {\n\t            initiativeName: initiative.name,\n\t            initiativeId: initiative.id,\n\t            budget: initiative.budget,\n\t            startDate: initiative.startDate,\n\t            endDate: initiative.endDate\n\t          });\n\n\t          this.goto('../../../../initiative', {\n\t            context: {\n\t              initiativeId: initiative.id\n\t            }\n\t          });\n\t        }"
                            },
                            {
                              "name": "cancelEditInitiative",
                              "func": "function () {\n\t          this.goto('../none');\n\t        }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "filterPlanning",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "on",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "filterPlanningToggle",
                              "func": "function () {\n\t          this.goto('../off');\n\t        }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "off",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "filterPlanningToggle",
                              "func": "function () {\n\t          this.goto('../on');\n\t        }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "filterApproved",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "on",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "filterApprovedToggle",
                              "func": "function () {\n\t          this.goto('../off');\n\t        }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "off",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "filterApprovedToggle",
                              "func": "function () {\n\t          this.goto('../on');\n\t        }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "filterLive",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "on",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "filterLiveToggle",
                              "func": "function () {\n\t          this.goto('../off');\n\t        }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "off",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "filterLiveToggle",
                              "func": "function () {\n\t          this.goto('../on');\n\t        }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "filterCompleted",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "off",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "filterCompletedToggle",
                              "func": "function () {\n\t          this.goto('../on');\n\t        }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "on",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "filterCompletedToggle",
                              "func": "function () {\n\t          this.goto('../off');\n\t        }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "filterArchived",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "off",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "filterArchivedToggle",
                              "func": "function () {\n\t          this.goto('../on');\n\t        }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "on",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "filterArchivedToggle",
                              "func": "function () {\n\t          this.goto('../off');\n\t        }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    }
                  ]
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "admin",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "directoryCurator",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                }
              ]
            },
            {
              "level": 3,
              "isActive": true,
              "name": "campaign",
              "concurrent": false,
              "events": [
                {
                  "name": "messageSent",
                  "func": "function (message) {\n\t    var campaign = CMM.appState.campaign;\n\t    var initiative = campaign.initiative;\n\t    var buy = message.buy;\n\t    CMM.analytics.track('messageSent', {\n\t      campaignName: campaign.name,\n\t      campaignId: campaign.id,\n\t      initiativeId: initiative.id,\n\t      vendorName: buy.getPath('vendor.name')\n\t    });\n\t  }"
                },
                {
                  "name": "downloadMediaPlan",
                  "func": "function (mediaPlanLabel, reportName) {\n\t    CMM.flash.general(reportName + ' is downloading…');\n\t    var _CMM$appState = CMM.appState;\n\t    var campaign = _CMM$appState.campaign;\n\t    var initiative = _CMM$appState.campaign.initiative;\n\n\t    var eventName = '';\n\t    switch (mediaPlanLabel) {\n\t      case 'client':\n\t        eventName = 'clientMediaPlanDownloadRequested';\n\t        break;\n\t      case 'vendor':\n\t        eventName = 'vendorMediaPlanDownloadRequested';\n\t        break;\n\t      default:\n\t        eventName = '';\n\t    }\n\t    CMM.analytics.track(eventName, {\n\t      initiativeId: initiative.id,\n\t      campaignId: campaign.id,\n\t      campaignName: campaign.name,\n\t      dateFilterStart: campaign.performanceStartDate,\n\t      dateFilterEnd: campaign.performanceEndDate\n\t    });\n\t  }"
                },
                {
                  "name": "mediaPlanSelected",
                  "func": "function (mediaPlan, context) {\n\t    var campaignId = CMM.appState.campaign.id;\n\t    var ctx = _extends({ campaignId: campaignId, mediaPlanId: mediaPlan.id }, context);\n\n\t    // for vendor users, we need to pass the buy id\n\t    if (CMM.utils.isVendorUser()) ctx.buyId = CMM.appState.buyId;\n\n\t    _this2.goto('mediaPlan', { force: true, context: ctx });\n\t  }"
                }
              ],
              "children": [
                {
                  "level": 4,
                  "isActive": false,
                  "name": "overview",
                  "concurrent": true,
                  "events": [
                    {
                      "name": "viewProposalFromMessage",
                      "func": "function (proposal) {\n\t    this.goto('../mediaPlan', {\n\t      force: true,\n\t      context: {\n\t        campaignId: CMM.appState.campaign.id,\n\t        mediaPlanId: CMM.appState.campaign.lastEditedMediaPlan.id,\n\t        viewProposalFromMessage: proposal\n\t      }\n\t    });\n\t  }"
                    }
                  ],
                  "children": [
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "main",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "switchCampaignOverviewMode",
                          "func": "function (mode) {\n\t      _this.goto(mode);\n\t    }"
                        }
                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "media-plans",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "reviseMediaPlan",
                              "func": "function (mediaPlanId) {\n\t        var inactiveMessages = CMM.appState.campaign.inactiveMessages();\n\t        if (inactiveMessages) {\n\t          CMM.flash.warn(inactiveMessages);\n\t        }\n\n\t        CMM.MediaPlan.local(mediaPlanId).duplicate({ revision: true });\n\t      }"
                            }
                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "panel",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "switchPanel",
                                  "func": "function (panel) {\n\t          if (_this3.resolve(panel)) _this3.goto(panel);\n\t        }"
                                }
                              ],
                              "children": [
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "details",
                                  "concurrent": false,
                                  "events": [

                                  ],
                                  "children": null
                                },
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "activity",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "showOlderFeedItems",
                                      "func": "function () {\n\t            CMM.appState.feedItems.fetchNextPage();\n\t          }"
                                    }
                                  ],
                                  "children": null
                                }
                              ]
                            }
                          ]
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "analytics",
                          "concurrent": true,
                          "events": [
                            {
                              "name": "changePerformanceDateRange",
                              "func": "function (startDate, endDate) {\n\t    this.params({\n\t      performanceStartDate: startDate ? CMM.utils.iso8601(startDate) : undefined,\n\t      performanceEndDate: endDate ? CMM.utils.iso8601(endDate) : undefined\n\t    });\n\t    CMM.appState.campaign.getAnalyticsData(startDate, endDate);\n\t  }"
                            },
                            {
                              "name": "dailyDeliveryReportDownloadRequested",
                              "func": "function () {\n\t    trackDownloadReportEvent('dailyDeliveryReportDownloadRequested');\n\t  }"
                            },
                            {
                              "name": "vendorDeliveryReportDownloadRequested",
                              "func": "function () {\n\t    trackDownloadReportEvent('vendorDeliveryReportDownloadRequested');\n\t  }"
                            },
                            {
                              "name": "clientDeliveryReportDownloadRequested",
                              "func": "function () {\n\t    trackDownloadReportEvent('clientDeliveryReportDownloadRequested');\n\t  }"
                            }
                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "view",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "switchAnalyticsView",
                                  "func": "function (newView) {\n\t      this.goto(newView);\n\t    }"
                                }
                              ],
                              "children": [
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "gross",
                                  "concurrent": false,
                                  "events": [

                                  ],
                                  "children": null
                                },
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "net",
                                  "concurrent": false,
                                  "events": [

                                  ],
                                  "children": null
                                }
                              ]
                            },
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "dialog",
                              "concurrent": false,
                              "events": [

                              ],
                              "children": [
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "none",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "uploadDeliveryDialog",
                                      "func": "function () {\n\t      this.goto('../uploadDeliveryDialog');\n\t      CMM.analytics.track('openUploadDelivery');\n\t    }"
                                    },
                                    {
                                      "name": "adjustDelivery",
                                      "func": "function (deliverySourceId, metric, tab) {\n\t      var ctx = {\n\t        deliverySourceId: deliverySourceId,\n\t        adjustMetric: metric,\n\t        adjustTab: tab\n\t      };\n\t      this.goto('../adjustDelivery', { context: ctx, force: true });\n\t    }"
                                    },
                                    {
                                      "name": "linkSources",
                                      "func": "function () {\n\t      this.goto('../deliverySource');\n\t      CMM.analytics.track('openLinkDeliverySources');\n\t    }"
                                    },
                                    {
                                      "name": "editGroup",
                                      "func": "function (groupId) {\n\t      _this.goto('../editGroup', { context: { groupId: groupId } });\n\t    }"
                                    },
                                    {
                                      "name": "editTactic",
                                      "func": "function (tacticId) {\n\t      _this.goto('../editTactic', { context: { tacticId: tacticId } });\n\t    }"
                                    }
                                  ],
                                  "children": null
                                },
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "uploadDeliveryDialog",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "closeUploadDeliveryDialog",
                                      "func": "function () {\n\t      this.goto('../none');\n\t    }"
                                    },
                                    {
                                      "name": "resetUploadDelivery",
                                      "func": "function () {\n\t      CMM.appState.uploadDelivery = CMM.UploadDelivery.createForCampaign(CMM.appState.campaign);\n\t    }"
                                    }
                                  ],
                                  "children": null
                                },
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "adjustDelivery",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "adjustmentSaved",
                                      "func": "function (adjustedMetric) {\n\t      CMM.analytics.track('adjustmentMade', { adjustedMetric: adjustedMetric });\n\t      CMM.flash.confirm(\"Adjustment Saved\");\n\t      CMM.appState.deliveryAdjustment.then(function () {\n\t        CMM.appState.campaign.getAnalyticsData(CMM.appState.campaign.performanceStartDate, CMM.appState.campaign.performanceEndDate);\n\t      });\n\t      this.goto('../none');\n\t    }"
                                    },
                                    {
                                      "name": "changeAdjustmentDateRange",
                                      "func": "function (_ref2) {\n\t      var startDate = _ref2.startDate;\n\t      var endDate = _ref2.endDate;\n\t      var deliveryAdjustment = CMM.appState.deliveryAdjustment;\n\n\t      this.goto('.', {\n\t        force: true,\n\t        context: {\n\t          deliverySourceId: deliveryAdjustment.flightedDeliverySource.id,\n\t          adjustMetric: deliveryAdjustment.metric,\n\t          startDate: startDate,\n\t          endDate: endDate\n\t        }\n\t      });\n\t    }"
                                    },
                                    {
                                      "name": "cancelAdjustment",
                                      "func": "function () {\n\t      this.goto('../none');\n\t    }"
                                    }
                                  ],
                                  "children": null
                                },
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "deliverySource",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "onClose",
                                      "func": "function () {\n\t    return _this.goto('../none');\n\t  }"
                                    }
                                  ],
                                  "children": [
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "selectDeliverySourceAdServer",
                                      "concurrent": false,
                                      "events": [
                                        {
                                          "name": "onSelected",
                                          "func": "function (adServer) {\n\t    this.goto('../' + adServer.afterAdServerSelection, { context: { adServer: adServer } });\n\t  }"
                                        }
                                      ],
                                      "children": null
                                    },
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "selectDeliverySourceAccount",
                                      "concurrent": false,
                                      "events": [
                                        {
                                          "name": "goBack",
                                          "func": "function () {\n\t    this.goto('../selectDeliverySourceAdServer');\n\t  }"
                                        },
                                        {
                                          "name": "onSelected",
                                          "func": "function (account) {\n\t    this.goto('../selectDeliverySourceProfile', { context: { account: account } });\n\t  }"
                                        },
                                        {
                                          "name": "createOauthAccount",
                                          "func": "function (adServerName) {\n\t    CMM.statechart.send('oauth', {\n\t      connection: 'create',\n\t      adServerName: adServerName,\n\t      skipProfilesFetch: true,\n\t      accountClass: _ad_server_account2.default\n\t    });\n\t  }"
                                        },
                                        {
                                          "name": "reconnectOauthAccount",
                                          "func": "function (account) {\n\t    CMM.statechart.send('oauth', { connection: 'reconnect', account: account, skipProfilesFetch: true });\n\t  }"
                                        }
                                      ],
                                      "children": null
                                    },
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "selectDeliverySourceProfile",
                                      "concurrent": false,
                                      "events": [
                                        {
                                          "name": "goBack",
                                          "func": "function () {\n\t    _this.goto('../selectDeliverySourceAccount', { context: { adServer: CMM.appState.deliverySourceAdServer } });\n\t  }"
                                        },
                                        {
                                          "name": "onSelected",
                                          "func": "function (profile, account) {\n\t    _this.goto('../selectDeliverySourceCampaigns', {\n\t      context: { profile: profile, account: account }\n\t    });\n\t  }"
                                        }
                                      ],
                                      "children": null
                                    },
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "selectDeliverySourceCampaigns",
                                      "concurrent": false,
                                      "events": [
                                        {
                                          "name": "goBack",
                                          "func": "function () {\n\t    var plugin = CMM.AdServer.find(CMM.appState.deliverySourceAdServer.key);\n\t    _this.goto('../' + plugin.afterAdServerSelection, { context: { account: CMM.appState.deliverySourceAccount, loadData: false, adServer: plugin } });\n\t  }"
                                        },
                                        {
                                          "name": "importCampaigns",
                                          "func": "function (campaignIds) {\n\t    var campaignId = CMM.appState.campaign.id;\n\t    _ad_server_campaign2.default.saveCampaignMapping({\n\t      adServerCampaignIds: campaignIds,\n\t      adServerName: CMM.appState.deliverySourceAdServer.key,\n\t      campaignId: campaignId\n\t    }).then(function () {\n\t      CMM.analytics.track('createdLinkedDeliverySource', {\n\t        adServer: CMM.appState.deliverySourceAdServer.key,\n\t        campaignId: campaignId\n\t      });\n\t      CMM.appState.deliverySources.query({ campaign_id: campaignId });\n\t      CMM.appState.deliverySources.then(function () {\n\t        return _this.goto('../../none');\n\t      });\n\t      CMM.appState.deliverySources.proxy(CMM.appState.deliverySources, '@');\n\t    });\n\t  }"
                                        }
                                      ],
                                      "children": null
                                    },
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "selectDeliverySourceAdvertiser",
                                      "concurrent": false,
                                      "events": [
                                        {
                                          "name": "goBack",
                                          "func": "function () {\n\t    _this.goto('../selectDeliverySourceAdServer');\n\t  }"
                                        },
                                        {
                                          "name": "onSelected",
                                          "func": "function (profile, account) {\n\t    _this.goto('../selectDeliverySourceCampaigns', {\n\t      context: { profile: profile, account: account }\n\t    });\n\t  }"
                                        }
                                      ],
                                      "children": null
                                    }
                                  ]
                                },
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "editTactic",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "cancelGroup",
                                      "func": "function () {\n\t      _this3.goto('../none', { force: true });\n\t    }"
                                    },
                                    {
                                      "name": "saveTactic",
                                      "func": "function (tactic, done) {\n\t      tactic.save().then(function () {\n\t        _this3.goto('../none', { force: true });\n\n\t        var lineItem = tactic.lineItem;\n\t        lineItem.groups = lineItem.groups.sort(function (g1, g2) {\n\t          return g1.id < g2.id;\n\t        });\n\t        CMM.flash.confirm('Tactic updated');\n\n\t        // Expand the line item after we edit the tactic\n\t        if (lineItem.isBusy || lineItem.isLoadingGroups || lineItem.isShowingGroups) return;\n\t        lineItem.loadStats(true);\n\t        done();\n\t      }).catch(function (errors) {\n\t        errors && errors.preventDefaultNotification && errors.preventDefaultNotification();\n\t        if (errors.message) {\n\t          CMM.flash.alert(errors.message.replace('Campaign', 'Tactic'));\n\t        } else {\n\t          CMM.flash.alert('Error saving tactic.  Please try again');\n\t        }\n\t        done();\n\t      });\n\t    }"
                                    }
                                  ],
                                  "children": null
                                },
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "editGroup",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "cancelGroup",
                                      "func": "function () {\n\t      _this4.goto('../none', { force: true });\n\t    }"
                                    },
                                    {
                                      "name": "saveGroup",
                                      "func": "function (group, done) {\n\t      group.save().then(function () {\n\t        _this4.goto('../none', { force: true });\n\t        var lineItem = group.lineItem;\n\t        lineItem.groups = lineItem.groups.sort(function (g1, g2) {\n\t          return g1.id < g2.id;\n\t        });\n\t        CMM.flash.confirm('Group updated');\n\n\t        // Expand the line item after we edit the group\n\t        if (lineItem.isBusy || lineItem.isLoadingGroups || lineItem.isShowingGroups) return;\n\t        lineItem.loadStats(true);\n\t        done();\n\t      }).catch(function (errors) {\n\t        errors && errors.preventDefaultNotification && errors.preventDefaultNotification();\n\t        CMM.flash.alert('Error saving group.  Please try again');\n\t        done();\n\t      });\n\t    }"
                                    }
                                  ],
                                  "children": null
                                }
                              ]
                            },
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "mapDelivery",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "openMapDeliveryPanel",
                                  "func": "function () {\n\t    _this.goto('open');\n\t    CMM.analytics.track('openMapDeliveryPanel');\n\t  }"
                                }
                              ],
                              "children": [
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "closed",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "analyticsFlightSelected",
                                      "func": "function (flight) {\n\t      var sel = CMM.appState.analyticsSelectedFlights;\n\t      CMM.appState.analyticsSelectedFlights = Object.assign({}, sel, _defineProperty({}, flight.id, !sel[flight.id]));\n\t    }"
                                    }
                                  ],
                                  "children": null
                                },
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "open",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "closeMapDeliveryPanel",
                                      "func": "function () {\n\t      _this2.goto('../closed');\n\t      CMM.analytics.track('closeMapDeliveryPanel');\n\t    }"
                                    },
                                    {
                                      "name": "analyticsFlightSelected",
                                      "func": "function (flight) {\n\t      CMM.appState.analyticsSelectedFlights = _defineProperty({}, flight.id, true);\n\t    }"
                                    },
                                    {
                                      "name": "refreshAnalyticsAndDeliverySources",
                                      "func": "function (campaign) {\n\t      CMM.appState.campaign.get({ type: 'analytics' });\n\t      CMM.appState.deliverySources.query({ campaign_id: campaign.id });\n\t    }"
                                    },
                                    {
                                      "name": "mapDeliverySource",
                                      "func": "function (deliverySource) {\n\t      var flightId = Object.keys(CMM.appState.analyticsSelectedFlights)[0];\n\t      var date = new Date();\n\t      var startDate = CMM.appState.campaign.performanceStartDate || date;\n\t      var endDate = CMM.appState.campaign.performanceEndDate || date;\n\n\t      if (!flightId) {\n\t        return;\n\t      }\n\n\t      var flight = CMM.Flight.local(flightId);\n\t      var eventData = {\n\t        deliverySourceId: deliverySource.id,\n\t        adServer: deliverySource.adServerName,\n\t        tacticId: flight.tactic.id\n\t      };\n\n\t      if (deliverySource.isMappedToFlight(flight)) {\n\t        if (!deliverySource.canMapDelivery) {\n\t          return;\n\t        }\n\n\t        flight.tactic.unmapFrom(deliverySource, startDate, endDate);\n\t        CMM.analytics.track('unmapDeliverySource', eventData);\n\t      } else {\n\t        flight.tactic.mapTo(deliverySource, startDate, endDate);\n\t        CMM.analytics.track('mapDeliverySource', eventData);\n\t      }\n\t      CMM.appState.mappedDeliverySourcesModified = true;\n\t    }"
                                    }
                                  ],
                                  "children": null
                                }
                              ]
                            },
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "inventorySource",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "inventorySourceSelected",
                                  "func": "function (source) {\n\t      if (_this.resolve(source)) {\n\t        _this.goto(source);\n\t      }\n\t    }"
                                },
                                {
                                  "name": "additionalMetrics",
                                  "func": "function (additionalMetrics) {\n\t      CMM.appState.additionalMetrics = Transis.Array.from(additionalMetrics);\n\t    }"
                                }
                              ],
                              "children": [
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "direct",
                                  "concurrent": true,
                                  "events": [
                                    {
                                      "name": "filterGrid",
                                      "func": "function (query) {\n\t    _this.params({ filterQuery: query });\n\t  }"
                                    }
                                  ],
                                  "children": [
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "sort",
                                      "concurrent": true,
                                      "events": [

                                      ],
                                      "children": [
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "sortBy",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": [
                                            {
                                              "level": 11,
                                              "isActive": false,
                                              "name": "off",
                                              "concurrent": false,
                                              "events": [
                                                {
                                                  "name": "toggleGridSort",
                                                  "func": "function () {\n\t          return _this2.goto('../on');\n\t        }"
                                                }
                                              ],
                                              "children": null
                                            },
                                            {
                                              "level": 11,
                                              "isActive": false,
                                              "name": "on",
                                              "concurrent": false,
                                              "events": [
                                                {
                                                  "name": "toggleGridSort",
                                                  "func": "function () {\n\t          return _this3.goto('../off');\n\t        }"
                                                },
                                                {
                                                  "name": "sortByChanged",
                                                  "func": "function (prop) {\n\t          return _this3.resolve(prop) && _this3.goto(prop);\n\t        }"
                                                },
                                                {
                                                  "name": "openMapDeliveryPanel",
                                                  "func": "function () {\n\t            return _this3.goto('../off');\n\t          }"
                                                },
                                                {
                                                  "name": "switchAnalyticsView",
                                                  "func": "function () {\n\t            return events[eventName].apply(events, arguments);\n\t          }"
                                                }
                                              ],
                                              "children": [
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "startDate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "endDate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "dataThrough",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "orderedUnits",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "rate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredImpressions",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredClicks",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredViewableImpressions",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredVideoStarts",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredVideoCompletions",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredTotalConversions",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredTotalClickConversions",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredTotalViewConversions",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredCpaTotalConversions",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredCpaTotalClickConversions",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredCpaTotalViewConversions",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredInteractions",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "pacing",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "ctr",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "inViewRate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "videoStartRate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "videoCompletionRate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "totalConversionRate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "clickThroughConversionRate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "viewThroughConversionRate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "cpaTotalConversionRate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "cpaClickThroughConversionRate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "cpaViewThroughConversionRate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "interactionRate",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "ecpm",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "ecpc",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "ecpvi",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "ecpv",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "ecpcv",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "ecpa",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "deliveredUnits",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "cost",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "totalSpend",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "unspent",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                },
                                                {
                                                  "level": 12,
                                                  "isActive": false,
                                                  "name": "projectedBalance",
                                                  "concurrent": false,
                                                  "events": [

                                                  ],
                                                  "children": null
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "sortDirection",
                                          "concurrent": false,
                                          "events": [
                                            {
                                              "name": "sortDirectionChanged",
                                              "func": "function (dir) {\n\t        return _this5.resolve(dir) && _this5.goto(dir);\n\t      }"
                                            }
                                          ],
                                          "children": [
                                            {
                                              "level": 11,
                                              "isActive": false,
                                              "name": "asc",
                                              "concurrent": false,
                                              "events": [

                                              ],
                                              "children": null
                                            },
                                            {
                                              "level": 11,
                                              "isActive": false,
                                              "name": "dsc",
                                              "concurrent": false,
                                              "events": [

                                              ],
                                              "children": null
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "drawer",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "receiveMessage",
                          "func": "function (ctx) {\n\t      this.goto('./messages', ctx);\n\t    }"
                        }
                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "closed",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "toggleMessagesDashboard",
                              "func": "function () {\n\t        this.goto('../messages');\n\t      }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "messages",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "insertionOrderSent",
                              "func": "function refreshBuyContacts() {\n\t    if (CMM.appState.messagesForBuyId) {\n\t      var buy = CMM.appState.messagesForBuy;\n\t      buy.loadContacts();\n\t      buy.loadTeam();\n\t    }\n\t  }"
                            },
                            {
                              "name": "rfpSent",
                              "func": "function refreshBuyContacts() {\n\t    if (CMM.appState.messagesForBuyId) {\n\t      var buy = CMM.appState.messagesForBuy;\n\t      buy.loadContacts();\n\t      buy.loadTeam();\n\t    }\n\t  }"
                            },
                            {
                              "name": "proposalUpdateSent",
                              "func": "function refreshBuyContacts() {\n\t    if (CMM.appState.messagesForBuyId) {\n\t      var buy = CMM.appState.messagesForBuy;\n\t      buy.loadContacts();\n\t      buy.loadTeam();\n\t    }\n\t  }"
                            },
                            {
                              "name": "toggleActivityDashboard",
                              "func": "function () {\n\t    this.goto('../activity');\n\t  }"
                            },
                            {
                              "name": "toggleMessagesDashboard",
                              "func": "function () {\n\t    this.goto('../closed');\n\t  }"
                            },
                            {
                              "name": "selectMessagesForBuy",
                              "func": "function (messagesForBuyId) {\n\t    if (CMM.appState.messagesForBuyId !== messagesForBuyId) {\n\t      this.updateMessageCount();\n\t      this.goto('.', {\n\t        context: { messagesForBuyId: messagesForBuyId },\n\t        force: true\n\t      });\n\t    }\n\t  }"
                            }
                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "dialog",
                              "concurrent": false,
                              "events": [

                              ],
                              "children": [
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "none",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "manageBuysContact",
                                      "func": "function () {\n\t        this.goto('../addCollaborators');\n\t      }"
                                    }
                                  ],
                                  "children": null
                                },
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "addCollaborators",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "closeCollaboratorDialog",
                                      "func": "function () {\n\t    this.goto('../none');\n\t  }"
                                    },
                                    {
                                      "name": "showAddCollaborators",
                                      "func": "function () {\n\t    this.goto('./addCollaborators');\n\t  }"
                                    }
                                  ],
                                  "children": [
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "addCollaborators",
                                      "concurrent": false,
                                      "events": [
                                        {
                                          "name": "addNewContact",
                                          "func": "function () {\n\t      this.goto('../contactSearch');\n\t    }"
                                        },
                                        {
                                          "name": "updateCollaborators",
                                          "func": "function (selectedContacts) {\n\t      CMM.appState.messagesForBuy.updateContacts(selectedContacts).then(function () {\n\t        CMM.flash.confirm('Collaborator added.');\n\t        CMM.appState.messagesForBuy.loadTeam();\n\t        CMM.statechart.send('closeCollaboratorDialog');\n\t      });\n\t    }"
                                        }
                                      ],
                                      "children": null
                                    },
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "contactSearch",
                                      "concurrent": false,
                                      "events": [
                                        {
                                          "name": "createVendorContact",
                                          "func": "function (ctx) {\n\t      this.goto('../contactEditCreate', { context: ctx });\n\t    }"
                                        }
                                      ],
                                      "children": null
                                    },
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "contactEditCreate",
                                      "concurrent": false,
                                      "events": [

                                      ],
                                      "children": null
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "dialogs",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "editCreateMediaPlan",
                          "func": "function (mediaPlanId) {\n\t      if (CMM.utils.userCan('create', 'Direct::MediaPlan') && CMM.utils.userCan('update', 'Direct::MediaPlan')) {\n\t        _this7.goto('editCreateMediaPlan', { context: { mediaPlanId: mediaPlanId } });\n\t      }\n\t    }"
                        },
                        {
                          "name": "editCampaign",
                          "func": "function () {\n\t      this.goto('editCampaign');\n\t    }"
                        },
                        {
                          "name": "archiveCampaign",
                          "func": "function () {\n\t      this.goto('archiveCampaign');\n\t    }"
                        },
                        {
                          "name": "unarchiveCampaign",
                          "func": "function () {\n\t      CMM.appState.campaign.save({ type: \"unarchive\" }).then(function () {\n\t        CMM.flash.confirm(CMM.appState.campaign.name + \" has been unarchived\");\n\t      });\n\t    }"
                        }
                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "none",
                          "concurrent": false,
                          "events": [

                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "editCreateMediaPlan",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "saveMediaPlan",
                              "func": "function () {\n\t          var mediaPlan = CMM.appState.selectedMediaPlan;\n\t          var flashActionVerb = mediaPlan.isNew ? \"created\" : \"updated\";\n\t          if (!mediaPlan.campaign) {\n\t            mediaPlan.campaign = CMM.appState.campaign;\n\t          }\n\t          mediaPlan.save().then(function () {\n\t            CMM.flash.confirm('Media plan ' + flashActionVerb);\n\t          });\n\t        }"
                            },
                            {
                              "name": "hideEditMediaPlan",
                              "func": "function () {\n\t          return _this9.goto('../none');\n\t        }"
                            },
                            {
                              "name": "deleteMediaPlan",
                              "func": "function () {\n\t          CMM.appState.selectedMediaPlan.delete().then(function () {\n\t            CMM.flash.confirm(\"Media plan removed\");\n\t          });\n\t        }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "editCampaign",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "cancelEditCampaign",
                              "func": "function () {\n\t        CMM.appState.campaign.undoChanges();\n\t        _this10.goto('../none');\n\t      }"
                            },
                            {
                              "name": "saveCampaign",
                              "func": "function () {\n\t        CMM.appState.breadCrumbs = [{\n\t          name: CMM.appState.campaign.initiative.name,\n\t          url: '/initiatives/' + CMM.appState.campaign.initiative.id\n\t        }, {\n\t          name: CMM.appState.campaign.name\n\t        }];\n\t        CMM.analytics.track('campaignEdited', { campaignId: CMM.appState.campaign.id });\n\t        CMM.flash.confirm(\"Campaign saved\");\n\t        _this10.goto('../none');\n\t      }"
                            },
                            {
                              "name": "filterOptions",
                              "func": "function (filterQuery) {\n\t        if (!CMM.appState.campaign.client.restrictedAccess) {\n\t          CMM.appState.filteredUserList.query({\n\t            term: filterQuery,\n\t            status: CMM.User.ACTIVE\n\t          });\n\t        }\n\t      }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "archiveCampaign",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "closeArchiveCampaign",
                              "func": "function () {\n\t        CMM.appState.campaign.undoChanges();\n\t        _this11.goto('../none');\n\t      }"
                            },
                            {
                              "name": "saveArchiveCampaign",
                              "func": "function () {\n\t        CMM.appState.campaign.save({ type: \"archive\" }).then(function () {\n\t          CMM.appState.breadCrumbs = [{\n\t            name: CMM.appState.campaign.initiative.name,\n\t            url: '/initiatives/' + CMM.appState.campaign.initiative.id\n\t          }, {\n\t            name: CMM.appState.campaign.name\n\t          }];\n\t          CMM.analytics.track('campaignArchived', { campaignId: CMM.appState.campaign.id });\n\t          CMM.flash.confirm(\"Campaign archived\");\n\t          _this11.goto('../none');\n\t        });\n\t      }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    }
                  ]
                },
                {
                  "level": 4,
                  "isActive": true,
                  "name": "mediaPlan",
                  "concurrent": true,
                  "events": [
                    {
                      "name": "gridFocusToggle",
                      "func": "function (toggle) {\n\t      CMM.analytics.track('gridFocusToggle', toggle);\n\t    }"
                    },
                    {
                      "name": "goToCampaignOverview",
                      "func": "function () {\n\t      return _this3.goto('../overview');\n\t    }"
                    },
                    {
                      "name": "removePropertyFromPlan",
                      "func": "function (propertyBuy) {\n\t      propertyBuy.destroy();\n\t      var proposal = propertyBuy.proposal;\n\t      proposal.save().then(function () {\n\t        CMM.flash.confirm(propertyBuy.propertyName + ' has been removed from your plan.');\n\t        CMM.analytics.track('propertyRemovedFromPlan', {\n\t          propertyId: propertyBuy.property.id,\n\t          mediaPlanId: CMM.appState.selectedMediaPlan.id\n\t        });\n\t      });\n\t    }"
                    },
                    {
                      "name": "removeVendorFromPlan",
                      "func": "function (proposal) {\n\t      CMM.flash.confirm(proposal.vendorName + ' removed from plan');\n\t      CMM.analytics.track('vendorRemovedFromPlan', {\n\t        vendorId: proposal.vendor.id,\n\t        mediaPlanId: CMM.appState.selectedMediaPlan.id\n\t      });\n\t    }"
                    }
                  ],
                  "children": [
                    {
                      "level": 5,
                      "isActive": true,
                      "name": "mode",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "switchCampaignMode",
                          "func": "function (newMode) {\n\t    this.goto(\"\" + newMode);\n\t  }"
                        }
                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": true,
                          "name": "planning",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "toggleEditMode",
                              "func": "function (editMode) {\n\t      CMM.analytics.track('togglePlanningByType', { editMode: editMode });\n\t    }"
                            },
                            {
                              "name": "tacticsCreated",
                              "func": "function (newPropertyBuyTactics) {\n\t      var _CMM$appState = CMM.appState;\n\t      var campaign = _CMM$appState.campaign;\n\t      var initiative = _CMM$appState.campaign.initiative;\n\n\t      newPropertyBuyTactics.forEach(function (newPropertyBuyTactic) {\n\t        CMM.analytics.track('tacticCreated', {\n\t          initiativeId: initiative.id,\n\t          campaignId: campaign.id,\n\t          campaignName: campaign.name,\n\t          vendorName: newPropertyBuyTactic.propertyBuy.getPath('proposal.vendorName'),\n\t          propertyName: newPropertyBuyTactic.propertyBuy.getPath('property.name'),\n\t          propertyURL: newPropertyBuyTactic.propertyBuy.getPath('property.url'),\n\t          propertyType: newPropertyBuyTactic.propertyBuy.getPath('property.type.name'),\n\t          tacticName: newPropertyBuyTactic.tactic.name\n\t        });\n\t      });\n\t    }"
                            },
                            {
                              "name": "tacticsEdited",
                              "func": "function (propertyBuyAndEditedTactics) {\n\t      var _CMM$appState2 = CMM.appState;\n\t      var campaign = _CMM$appState2.campaign;\n\t      var initiative = _CMM$appState2.campaign.initiative;\n\n\t      propertyBuyAndEditedTactics.forEach(function (propertyBuyAndEditedTactic) {\n\t        CMM.analytics.track('tacticEdited', {\n\t          initiativeId: initiative.id,\n\t          campaignId: campaign.id,\n\t          campaignName: campaign.name,\n\t          vendorName: propertyBuyAndEditedTactic.propertyBuy.getPath('proposal.vendorName'),\n\t          propertyName: propertyBuyAndEditedTactic.propertyBuy.getPath('property.name'),\n\t          propertyURL: propertyBuyAndEditedTactic.propertyBuy.getPath('property.url'),\n\t          propertyType: propertyBuyAndEditedTactic.propertyBuy.getPath('property.type.name'),\n\t          tacticName: propertyBuyAndEditedTactic.tactic.name\n\t        });\n\t      });\n\t    }"
                            },
                            {
                              "name": "copyTactics",
                              "func": "function (tactics) {\n\t      if (!tactics && !tactics.length) return;\n\t      CMM.appState.tacticClipboard = tactics.slice();\n\t      CMM.flash.general('Copied ' + tactics.length + ' ' + Transis.pluralize('line item', tactics.length) + ' to clipboard.');\n\t    }"
                            },
                            {
                              "name": "addTacticToClipboard",
                              "func": "function (tactic) {\n\t      CMM.appState.tacticClipboard = CMM.appState.tacticClipboard || Transis.A();\n\t      if (CMM.appState.tacticClipboard.indexOf(tactic) < 0) {\n\t        CMM.appState.tacticClipboard.push(tactic);\n\t      }\n\t      CMM.flash.general('Added line item to clipboard.');\n\t    }"
                            },
                            {
                              "name": "pasteTactics",
                              "func": "function (propertyBuy) {\n\t      var tacticClipboard = CMM.appState.tacticClipboard;\n\n\t      if (!tacticClipboard && !tacticClipboard.length) return;\n\t      propertyBuy.pasteTactics(CMM.appState.tacticClipboard);\n\t      CMM.flash.general('Pasted ' + tacticClipboard.length + ' ' + Transis.pluralize('line item', tacticClipboard.length) + ' to ' + propertyBuy.propertyName + '.');\n\t    }"
                            },
                            {
                              "name": "viewProposalFromMessage",
                              "func": "function (proposal) {\n\t      if (!CMM.appState.selectedMediaPlan.isEditable) {\n\t        var editablePlan = CMM.appState.campaign.editablePlans.first;\n\t        CMM.statechart.send('mediaPlanSelected', editablePlan || CMM.appState.selectedMediaPlan, {\n\t          viewProposalFromMessage: proposal\n\t        });\n\t      } else {\n\t        CMM.appState.viewProposalFromMessage = { proposal: proposal };\n\t      }\n\t    }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": true,
                      "name": "dashboard",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "receiveMessage",
                          "func": "function (ctx) {\n\t    this.goto('./messages', ctx);\n\t  }"
                        }
                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": true,
                          "name": "closed",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "toggleActivityDashboard",
                              "func": "function () {\n\t      this.goto('../activity');\n\t    }"
                            },
                            {
                              "name": "toggleMessagesDashboard",
                              "func": "function () {\n\t      this.goto('../messages');\n\t    }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "activity",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "showOlderFeedItems",
                              "func": "function () {\n\t      if (CMM.appState.feedItems) {\n\t        CMM.appState.feedItems.fetchNextPage();\n\t      }\n\t    }"
                            },
                            {
                              "name": "toggleActivityDashboard",
                              "func": "function () {\n\t      this.goto('../closed');\n\t    }"
                            },
                            {
                              "name": "toggleMessagesDashboard",
                              "func": "function () {\n\t      this.goto('../messages');\n\t    }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "messages",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "insertionOrderSent",
                              "func": "function refreshBuyContacts() {\n\t    if (CMM.appState.messagesForBuyId) {\n\t      var buy = CMM.appState.messagesForBuy;\n\t      buy.loadContacts();\n\t      buy.loadTeam();\n\t    }\n\t  }"
                            },
                            {
                              "name": "rfpSent",
                              "func": "function refreshBuyContacts() {\n\t    if (CMM.appState.messagesForBuyId) {\n\t      var buy = CMM.appState.messagesForBuy;\n\t      buy.loadContacts();\n\t      buy.loadTeam();\n\t    }\n\t  }"
                            },
                            {
                              "name": "proposalUpdateSent",
                              "func": "function refreshBuyContacts() {\n\t    if (CMM.appState.messagesForBuyId) {\n\t      var buy = CMM.appState.messagesForBuy;\n\t      buy.loadContacts();\n\t      buy.loadTeam();\n\t    }\n\t  }"
                            },
                            {
                              "name": "toggleActivityDashboard",
                              "func": "function () {\n\t    this.goto('../activity');\n\t  }"
                            },
                            {
                              "name": "toggleMessagesDashboard",
                              "func": "function () {\n\t    this.goto('../closed');\n\t  }"
                            },
                            {
                              "name": "selectMessagesForBuy",
                              "func": "function (messagesForBuyId) {\n\t    if (CMM.appState.messagesForBuyId !== messagesForBuyId) {\n\t      this.updateMessageCount();\n\t      this.goto('.', {\n\t        context: { messagesForBuyId: messagesForBuyId },\n\t        force: true\n\t      });\n\t    }\n\t  }"
                            }
                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "dialog",
                              "concurrent": false,
                              "events": [

                              ],
                              "children": [
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "none",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "manageBuysContact",
                                      "func": "function () {\n\t        this.goto('../addCollaborators');\n\t      }"
                                    }
                                  ],
                                  "children": null
                                },
                                {
                                  "level": 8,
                                  "isActive": false,
                                  "name": "addCollaborators",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "closeCollaboratorDialog",
                                      "func": "function () {\n\t    this.goto('../none');\n\t  }"
                                    },
                                    {
                                      "name": "showAddCollaborators",
                                      "func": "function () {\n\t    this.goto('./addCollaborators');\n\t  }"
                                    }
                                  ],
                                  "children": [
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "addCollaborators",
                                      "concurrent": false,
                                      "events": [
                                        {
                                          "name": "addNewContact",
                                          "func": "function () {\n\t      this.goto('../contactSearch');\n\t    }"
                                        },
                                        {
                                          "name": "updateCollaborators",
                                          "func": "function (selectedContacts) {\n\t      CMM.appState.messagesForBuy.updateContacts(selectedContacts).then(function () {\n\t        CMM.flash.confirm('Collaborator added.');\n\t        CMM.appState.messagesForBuy.loadTeam();\n\t        CMM.statechart.send('closeCollaboratorDialog');\n\t      });\n\t    }"
                                        }
                                      ],
                                      "children": null
                                    },
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "contactSearch",
                                      "concurrent": false,
                                      "events": [
                                        {
                                          "name": "createVendorContact",
                                          "func": "function (ctx) {\n\t      this.goto('../contactEditCreate', { context: ctx });\n\t    }"
                                        }
                                      ],
                                      "children": null
                                    },
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "contactEditCreate",
                                      "concurrent": false,
                                      "events": [

                                      ],
                                      "children": null
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": true,
                      "name": "panel",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "closePanel",
                          "func": "function () {\n\t    this.goto('./closed');\n\t  }"
                        }
                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": true,
                          "name": "closed",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "manageApprovals",
                              "func": "function () {\n\t      this.goto('../approvals');\n\t    }"
                            },
                            {
                              "name": "manageVendorIOs",
                              "func": "function () {\n\t      this.goto('../vendorIOs');\n\t    }"
                            },
                            {
                              "name": "openAdServingPanel",
                              "func": "function () {\n\t      this.goto('../adServingPanel');\n\t    }"
                            },
                            {
                              "name": "openAdServingForLineItem",
                              "func": "function (lineItem) {\n\t      this.goto('../adServingPanel', { context: { lineItem: lineItem } });\n\t    }"
                            },
                            {
                              "name": "managePlans",
                              "func": "function () {\n\t      this.goto('../listPlans');\n\t    }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "approvals",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "showIOApprovalHistory",
                              "func": "function (buy) {\n\t      this.goto('../IOApprovalsHistory', {\n\t        context: buy\n\t      });\n\t    }"
                            },
                            {
                              "name": "showMediaPlanApprovalHistory",
                              "func": "function () {\n\t      this.goto('../mediaPlanApprovalsHistory');\n\t    }"
                            },
                            {
                              "name": "approvalSuccess",
                              "func": "function () {\n\t      var campaign, initiative, mediaPlan;\n\t      campaign = CMM.appState.campaign;\n\t      initiative = campaign.initiative;\n\t      mediaPlan = CMM.appState.selectedMediaPlan;\n\t      CMM.analytics.track('mediaPlanApprovalSucceeded', {\n\t        campaignName: campaign.name,\n\t        campaignId: campaign.id,\n\t        initiativeId: initiative.id,\n\t        clientCost: mediaPlan.clientCost,\n\t        mediaCost: mediaPlan.mediaCost\n\t      });\n\t      CMM.flash.confirm(\"Media Plan Approved\");\n\t      CMM.appState.campaignDialog = undefined;\n\t    }"
                            },
                            {
                              "name": "closeAndShowErrors",
                              "func": "function (inventorySource) {\n\t      if (inventorySource) {\n\t        inventorySource.invalidApprovalItems.forEach(function (item) {\n\t          item.mode = 'edit';\n\t        });\n\t        inventorySource.useApprovalValidation = true;\n\t        inventorySource.validate();\n\t        CMM.statechart.send(inventorySource.constructor.statechartName + 'Selected');\n\t      } else {\n\t        CMM.appState.selectedMediaPlan.proposals.map(function (p) {\n\t          if (p.hasErrors) {\n\t            p.mode = 'edit';\n\t            p.editingMode = CMM.Proposal.COST_EDITING_MODE;\n\t            p.propertyBuys.map(function (pb) {\n\t              if (pb.errors.tactics) pb.newTactic();\n\t            });\n\t          }\n\t        });\n\t        CMM.statechart.send('directSelected', true);\n\t      }\n\t      this.goto('../closed');\n\t    }"
                            },
                            {
                              "name": "closeAndShowAdServingErrors",
                              "func": "function (lineItem) {\n\t      this.goto('../adServingPanel', { context: { lineItem: lineItem, showErrors: true } });\n\t    }"
                            },
                            {
                              "name": "closeApprovalsPanel",
                              "func": "function () {\n\t      CMM.appState.selectedMediaPlan.proposals.forEach(function (p) {\n\t        p.useApprovalValidation = false;\n\t      });\n\n\t      CMM.appState.selectedMediaPlan.inventorySources.forEach(function (inventorySource) {\n\t        inventorySource.useApprovalValidation = false;\n\t      });\n\n\t      this.goto('../closed');\n\t    }"
                            }
                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "approvalDialogClosed",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "approveMediaPlan",
                                  "func": "function () {\n\t        this.goto('../approvalDialogOpen');\n\t      }"
                                }
                              ],
                              "children": null
                            },
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "approvalDialogOpen",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "dismissApproval",
                                  "func": "function () {\n\t        this.goto('../approvalDialogClosed');\n\t      }"
                                }
                              ],
                              "children": null
                            }
                          ]
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "IOApprovalsHistory",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "backToApprovals",
                              "func": "function () {\n\t      this.goto('../approvals');\n\t    }"
                            },
                            {
                              "name": "backTovendorIOs",
                              "func": "function () {\n\t      this.goto('../vendorIOs');\n\t    }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "mediaPlanApprovalsHistory",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "backToApprovals",
                              "func": "function () {\n\t      this.goto('../approvals');\n\t    }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "vendorIOs",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "showIOApprovalHistory",
                              "func": "function (buy) {\n\t      this.goto('../IOApprovalsHistory', {\n\t        context: buy\n\t      });\n\t    }"
                            },
                            {
                              "name": "closeVendorIOsPanel",
                              "func": "function () {\n\t      this.goto('../closed');\n\t    }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "adServingPanel",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "lineItemSaved",
                              "func": "function (hasAdServerVendor) {\n\t      var successMessage = hasAdServerVendor ? \"Ad serving applied.\" : \"Ad serving removed\";\n\t      CMM.flash.confirm(successMessage);\n\t      this.goto('../closed');\n\t    }"
                            },
                            {
                              "name": "closeAdServingPanel",
                              "func": "function () {\n\t      this.goto('../closed');\n\t    }"
                            },
                            {
                              "name": "selectLineItem",
                              "func": "function (lineItem) {\n\t      this.goto('.', { force: true, context: { lineItem: lineItem } });\n\t    }"
                            }
                          ],
                          "children": null
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": true,
                      "name": "dialog",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": true,
                          "name": "none",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "showEditMediaPlan",
                              "func": "function () {\n\t      return _this2.goto('../editMediaPlan');\n\t    }"
                            },
                            {
                              "name": "openRfpDialog",
                              "func": "function () {\n\t      this.goto('../sendRfp');\n\t    }"
                            },
                            {
                              "name": "initiateTraffic",
                              "func": "function (adServerName) {\n\t      var _this3 = this;\n\n\t      CMM.appState.campaign.getTrafficSummary().then(function () {\n\t        _this3.goto('../trafficMediaPlan', { context: { adServerName: adServerName } });\n\t      });\n\t    }"
                            },
                            {
                              "name": "openProposalDialog",
                              "func": "function () {\n\t      this.goto('../sendProposal');\n\t    }"
                            },
                            {
                              "name": "openProposalUpdateDialog",
                              "func": "function (buy) {\n\t      this.goto('../sendProposalUpdate', {\n\t        context: { buyId: buy.id }\n\t      });\n\t    }"
                            },
                            {
                              "name": "openInsertionOrderDialog",
                              "func": "function () {\n\t      this.goto('../sendInsertionOrder');\n\t    }"
                            },
                            {
                              "name": "openAcceptRejectInsertionOrderDialog",
                              "func": "function (order) {\n\t      this.goto('../acceptRejectInsertionOrder', {\n\t        context: { orderId: order.id }\n\t      });\n\t    }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "editMediaPlan",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "hideEditMediaPlan",
                              "func": "function () {\n\t      return _this4.goto('../none');\n\t    }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "trafficMediaPlan",
                          "concurrent": false,
                          "events": [

                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "accountDialog",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "accountDialogOff",
                                  "func": "function () {\n\t        this.goto('../../none');\n\t      }"
                                }
                              ],
                              "children": null
                            },
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "profileDialog",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "profileDialogOff",
                                  "func": "function () {\n\t        this.goto('../../none');\n\t      }"
                                }
                              ],
                              "children": null
                            },
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "trafficDialog",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "traffic",
                                  "func": "function () {\n\t        var lpName = CMM.appState.trafficData.landingPageName;\n\t        var lpUrl = CMM.appState.trafficData.landingPageUrl;\n\t        var profileId = CMM.appState.profile && CMM.appState.profile.id;\n\t        var adServer = CMM.appState.adServerName;\n\n\t        CMM.appState.campaign.save({\n\t          type: 'traffic',\n\t          landingPageName: lpName,\n\t          landingPageUrl: lpUrl,\n\t          profileId: profileId,\n\t          mediaPlanId: CMM.appState.selectedMediaPlan.id,\n\t          adServerPluginName: adServer\n\t        }).then(function () {\n\t          var campaign = CMM.appState.campaign;\n\t          var mediaPlan = CMM.appState.selectedMediaPlan;\n\t          var initiative = campaign.initiative;\n\t          var url = \"/campaigns/\" + campaign.id + \"?mode=planning&mediaPlanId=\" + mediaPlan.id + \"&campaignDialog=trafficMediaPlan&adServerName=\" + adServer;\n\n\t          CMM.analytics.track('trafficCampaignStarted', {\n\t            campaignName: campaign.name,\n\t            campaignId: campaign.id,\n\t            initiativeId: initiative.id,\n\t            daysAfterStartOfCampaign: moment().diff(campaign.startDate, 'days')\n\t          });\n\n\t          CMM.flash.confirm(\"Exporting placements to \" + CMM.AdServer.find(adServer).name);\n\n\t          CMM.appState.campaign.pollTrafficStatusFor(adServer).then(function () {\n\t            var trafficData = campaign.trafficSummaryFor(adServer);\n\n\t            // refresh the campaign\n\t            campaign.get();\n\n\t            if (trafficData.isSuccessful) {\n\t              CMM.flash.confirm(campaign.name + \" campaign successfully exported to \" + CMM.AdServer.find(adServer).name + \".\");\n\n\t              CMM.analytics.track('trafficExportSucceeded', {\n\t                campaignName: campaign.name,\n\t                campaignId: campaign.id,\n\t                initiativeId: campaign.initiative.id\n\t              });\n\t            } else if (trafficData.isPartialSuccess) {\n\t              CMM.flash.alert(campaign.name + \" campaign partially exported to \" + CMM.AdServer.find(adServer).name + \". Some placements failed to export. <a href=\\\"\" + url + \"\\\" class=\\\"Flash-link\\\">View details</a>.\", { html: true });\n\n\t              CMM.analytics.track('trafficExportPartialSuccess', {\n\t                campaignName: campaign.name,\n\t                campaignId: campaign.id,\n\t                initiativeId: campaign.initiative.id\n\t              });\n\t            } else if (trafficData.isTotalFailure) {\n\t              CMM.flash.alert(campaign.name + \" campaign failed to export to \" + CMM.AdServer.find(adServer).name + \". <a href=\\\"\" + url + \"\\\" class=\\\"Flash-link\\\">View details</a>.\", { html: true });\n\n\t              CMM.analytics.track('trafficExportFailed', {\n\t                campaignName: campaign.name,\n\t                campaignId: campaign.id,\n\t                initiativeId: campaign.initiative.id\n\t              });\n\t            }\n\t          });\n\t        }).catch(function () {\n\t          CMM.flash.alert(\"Something went wrong starting \" + CMM.AdServer.find(adServer).name + \" trafficking.\");\n\t        });\n\t      }"
                                },
                                {
                                  "name": "dismissTraffic",
                                  "func": "function () {\n\t        this.goto('../../none');\n\t      }"
                                }
                              ],
                              "children": null
                            }
                          ]
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "sendRfp",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "cancelRfpCreate",
                              "func": "function () {\n\t      var _this = this;\n\t      var ignoreConfirmation = CMM.appState.rfp.hasErrors || !CMM.appState.rfp.hasChanges;\n\t      if (ignoreConfirmation) {\n\t        _this.goto('../none');\n\t      } else {\n\t        CMM.confirm({\n\t          headerText: 'Are you sure?',\n\t          bodyHTML: \"<p>If you cancel this RFP, you'll lose your changes and will not be able to recover them.</p>\",\n\t          confirmText: \"Discard changes and cancel RFP\",\n\t          cancelText: 'Continue editing',\n\t          onConfirm: function onConfirm() {\n\t            _this.goto('../none');\n\t          }\n\t        });\n\t      }\n\t    }"
                            },
                            {
                              "name": "saveRfp",
                              "func": "function () {\n\t      CMM.appState.rfp.validate();\n\n\t      if (!CMM.appState.rfp.hasErrors) {\n\t        CMM.appState.rfp.save().then(function () {\n\t          CMM.flash.confirm(\"RFP sent.\");\n\t          CMM.statechart.send('rfpSent');\n\n\t          var campaign = CMM.appState.campaign;\n\t          var initiative = campaign.initiative;\n\t          var mediaPlan = CMM.appState.selectedMediaPlan;\n\n\t          CMM.analytics.track('rfpSent', {\n\t            campaignName: campaign.name,\n\t            campaignId: campaign.id,\n\t            initiativeId: initiative.id,\n\t            clientCost: mediaPlan.clientCost,\n\t            mediaCost: mediaPlan.mediaCost\n\t          });\n\t        });\n\t        this.goto('../none');\n\t      }\n\t    }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "sendProposal",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "cancelSendProposal",
                              "func": "function () {\n\t      var _this = this;\n\t      if (CMM.appState.sendProposal.hasChanges) {\n\t        CMM.confirm({\n\t          headerText: 'Are you sure?',\n\t          bodyHTML: \"<p>If you cancel this proposal, you'll lose your changes and will not be able to recover them.</p>\",\n\t          confirmText: \"Discard changes and cancel proposal\",\n\t          cancelText: 'Continue editing',\n\t          onConfirm: function onConfirm() {\n\t            _this.goto('../none');\n\t          }\n\t        });\n\t      } else {\n\t        this.goto('../none');\n\t      }\n\t    }"
                            },
                            {
                              "name": "saveSendProposal",
                              "func": "function () {\n\t      CMM.appState.sendProposal.validate();\n\n\t      if (!CMM.appState.sendProposal.hasErrors) {\n\t        CMM.appState.sendProposal.save();\n\t        CMM.flash.confirm(\"Proposal sent.\");\n\n\t        var mediaPlan = CMM.appState.selectedMediaPlan;\n\t        var campaign = mediaPlan.campaign;\n\n\t        CMM.analytics.track('proposalSent', {\n\t          campaignName: campaign.name,\n\t          campaignId: campaign.id,\n\t          clientCost: mediaPlan.clientCost\n\t        });\n\t        this.goto('../none');\n\t      }\n\t    }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "sendProposalUpdate",
                          "concurrent": false,
                          "events": [
                            {
                              "name": "cancelSendProposalUpdate",
                              "func": "function () {\n\t      if (CMM.appState.sendProposalUpdate.hasChanges) {\n\t        var _this = this;\n\t        CMM.confirm({\n\t          headerText: 'Are you sure?',\n\t          bodyHTML: \"<p>If you cancel this proposal, you'll lose your changes and will not be able to recover them.</p>\",\n\t          confirmText: \"Discard changes and cancel proposal\",\n\t          cancelText: 'Continue editing',\n\t          onConfirm: function onConfirm() {\n\t            _this.goto('../none');\n\t          }\n\t        });\n\t      } else {\n\t        this.goto('../none');\n\t      }\n\t    }"
                            },
                            {
                              "name": "saveSendProposalUpdate",
                              "func": "function (buyId) {\n\t      if (CMM.appState.sendProposalUpdate.validate()) {\n\t        CMM.appState.sendProposalUpdate.save().then(function () {\n\t          CMM.statechart.send('proposalUpdateSent');\n\t        });\n\t        CMM.flash.confirm(\"Proposal sent.\");\n\t        CMM.analytics.track('proposalUpdateSent', { buyId: buyId });\n\t        this.goto('../none');\n\t      }\n\t    }"
                            }
                          ],
                          "children": null
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "sendInsertionOrder",
                          "concurrent": false,
                          "events": [

                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "create",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "previewInsertionOrder",
                                  "func": "function () {\n\t        this.goto('../preview');\n\t      }"
                                },
                                {
                                  "name": "cancelSendInsertionOrder",
                                  "func": "function () {\n\t        var _this = this;\n\t        CMM.confirm({\n\t          headerText: \"Are you sure?\",\n\t          bodyHTML: \"<p>If you cancel this IO, you'll lose your changes and will not be able to recover them.</p>\",\n\t          confirmText: \"Discard changes and cancel IO\",\n\t          cancelText: 'Continue editing',\n\t          onConfirm: function onConfirm() {\n\t            _this.goto('../../none');\n\t          }\n\t        });\n\t      }"
                                }
                              ],
                              "children": null
                            },
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "preview",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "goBackToCreateInsertionOrder",
                                  "func": "function () {\n\t        this.goto('../create');\n\t      }"
                                },
                                {
                                  "name": "withdrawInsertionOrder",
                                  "func": "function () {\n\t        var campaignId = CMM.appState.campaign.id;\n\t        CMM.analytics.track('IOWithdrawnByAgency', { campaignId: campaignId });\n\t      }"
                                },
                                {
                                  "name": "saveInsertionOrder",
                                  "func": "function (isRevision) {\n\t        if (CMM.appState.orderForm.validate()) {\n\t          (function () {\n\t            var campaignId = CMM.appState.campaign.id;\n\t            var campaignName = CMM.appState.campaign.name;\n\t            var mediaPlanId = CMM.appState.selectedMediaPlan.id;\n\t            var buyIds = CMM.appState.orderForm.selectedBuysWithRecipients.map(function (buy) {\n\t              return buy.id;\n\t            });\n\t            var revision = isRevision || false;\n\n\t            CMM.appState.orderForm.createOrders().then(function () {\n\t              CMM.flash.confirm(\"Insertion Order sent.\");\n\t              CMM.statechart.send('insertionOrderSent');\n\t              CMM.analytics.track('IOIssued', { campaignId: campaignId, campaignName: campaignName, mediaPlanId: mediaPlanId, revision: revision });\n\t              buyIds.forEach(function (buyId) {\n\t                return CMM.NegotiationMessage.query({ buyId: buyId });\n\t              });\n\t              _this10.goto('../../none');\n\t            });\n\t          })();\n\t        } else {\n\t          // NOTE: The message refers to just dueDate but we'll drop in here\n\t          // for any orderForm validation issue - only dueDate can become invalid\n\t          // While in the preview view, others are handled on initial create screen.\n\t          CMM.flash.alert(\"Due date must be in the future\");\n\t          _this10.goto('../create');\n\t        }\n\t      }"
                                }
                              ],
                              "children": null
                            }
                          ]
                        },
                        {
                          "level": 6,
                          "isActive": false,
                          "name": "acceptRejectInsertionOrder",
                          "concurrent": false,
                          "events": [

                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "acceptReject",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "hidePrintPreview",
                                  "func": "function () {\n\t        this.goto('../../none');\n\t      }"
                                },
                                {
                                  "name": "rejectInsertionOrder",
                                  "func": "function () {\n\t        var campaign = CMM.appState.campaign;\n\t        var initiative = campaign.initiative;\n\t        CMM.analytics.track('IORejected', {\n\t          campaignName: campaign.name,\n\t          campaignId: campaign.id,\n\t          initiativeId: initiative.id,\n\t          revised: CMM.appState.order.revised\n\t        });\n\t        this.goto('../rejectInsertionOrder');\n\t      }"
                                },
                                {
                                  "name": "acceptInsertionOrder",
                                  "func": "function () {\n\t        var _this11 = this;\n\n\t        var _CMM$appState = CMM.appState;\n\t        var campaign = _CMM$appState.campaign;\n\t        var order = _CMM$appState.order;\n\n\t        if (order.validate()) {\n\t          order.save({ accept: true }).then(function () {\n\t            campaign.get({ vendor: true, buy_id: order.buy.id }).then(function () {\n\t              CMM.flash.confirm('Insertion Order accepted.');\n\t              CMM.analytics.track('IOAccepted', {\n\t                campaignName: campaign.name,\n\t                campaignId: campaign.id,\n\t                initiativeId: campaign.initiativeId,\n\t                revised: order.revised\n\t              });\n\t              CMM.statechart.send('mediaPlanSelected', campaign.currentVendorApprovedPlan);\n\t              _this11.goto('../../none');\n\t            });\n\t          });\n\t        }\n\t      }"
                                }
                              ],
                              "children": null
                            },
                            {
                              "level": 7,
                              "isActive": false,
                              "name": "rejectInsertionOrder",
                              "concurrent": false,
                              "events": [
                                {
                                  "name": "goBackToAcceptRejectInsertionOrder",
                                  "func": "function () {\n\t        CMM.appState.order.undoReject();\n\t        this.goto('../acceptReject', { context: { orderId: CMM.appState.order.id } });\n\t      }"
                                },
                                {
                                  "name": "sendInsertionOrderRejection",
                                  "func": "function () {\n\t        var _this12 = this;\n\n\t        var buyId = CMM.appState.getPath('order.buy.id');\n\n\t        if (CMM.appState.order.validate()) {\n\t          CMM.appState.order.save({ reject: true }).then(function () {\n\t            CMM.MediaPlan.query({ buy_id: buyId });\n\t            CMM.NegotiationMessage.query({ buyId: buyId });\n\t            CMM.flash.confirm(\"Insertion Order rejected.\");\n\t            _this12.goto('../../none');\n\t          });\n\t        }\n\t      }"
                                }
                              ],
                              "children": null
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "level": 5,
                      "isActive": true,
                      "name": "inventorySource",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "inventorySourceSelected",
                          "func": "function (source) {\n\t    if (_this.resolve(source)) {\n\t      _this.goto(source);\n\t    }\n\t  }"
                        },
                        {
                          "name": "directSelected",
                          "func": "function () {\n\t    return _this.goto('direct');\n\t  }"
                        }
                      ],
                      "children": [
                        {
                          "level": 6,
                          "isActive": true,
                          "name": "direct",
                          "concurrent": true,
                          "events": [
                            {
                              "name": "filterGrid",
                              "func": "function (query) {\n\t      _this2.params({ filterQuery: query });\n\t    }"
                            }
                          ],
                          "children": [
                            {
                              "level": 7,
                              "isActive": true,
                              "name": "sort",
                              "concurrent": true,
                              "events": [

                              ],
                              "children": [
                                {
                                  "level": 8,
                                  "isActive": true,
                                  "name": "sortBy",
                                  "concurrent": false,
                                  "events": [

                                  ],
                                  "children": [
                                    {
                                      "level": 9,
                                      "isActive": true,
                                      "name": "off",
                                      "concurrent": false,
                                      "events": [
                                        {
                                          "name": "toggleGridSort",
                                          "func": "function () {\n\t          return _this2.goto('../on');\n\t        }"
                                        }
                                      ],
                                      "children": null
                                    },
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "on",
                                      "concurrent": false,
                                      "events": [
                                        {
                                          "name": "toggleGridSort",
                                          "func": "function () {\n\t          return _this3.goto('../off');\n\t        }"
                                        },
                                        {
                                          "name": "sortByChanged",
                                          "func": "function (prop) {\n\t          return _this3.resolve(prop) && _this3.goto(prop);\n\t        }"
                                        },
                                        {
                                          "name": "viewProposalFromMessage",
                                          "func": "function () {\n\t            return _this3.goto('../off');\n\t          }"
                                        },
                                        {
                                          "name": "addVendorToPlan",
                                          "func": "function () {\n\t            return _this3.goto('../off');\n\t          }"
                                        },
                                        {
                                          "name": "addPropertyVendorToPlan",
                                          "func": "function () {\n\t            return _this3.goto('../off');\n\t          }"
                                        }
                                      ],
                                      "children": [
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "startDate",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "endDate",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "orderedUnits",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "availableUnits",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "totalUnits",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "sov",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "viewMediaRate",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "adServingRate",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "effectiveMargin",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "viewClientRate",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "mediaCost",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "adServingCost",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "gainLoss",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        },
                                        {
                                          "level": 10,
                                          "isActive": false,
                                          "name": "clientCost",
                                          "concurrent": false,
                                          "events": [

                                          ],
                                          "children": null
                                        }
                                      ]
                                    }
                                  ]
                                },
                                {
                                  "level": 8,
                                  "isActive": true,
                                  "name": "sortDirection",
                                  "concurrent": false,
                                  "events": [
                                    {
                                      "name": "sortDirectionChanged",
                                      "func": "function (dir) {\n\t        return _this5.resolve(dir) && _this5.goto(dir);\n\t      }"
                                    }
                                  ],
                                  "children": [
                                    {
                                      "level": 9,
                                      "isActive": true,
                                      "name": "asc",
                                      "concurrent": false,
                                      "events": [

                                      ],
                                      "children": null
                                    },
                                    {
                                      "level": 9,
                                      "isActive": false,
                                      "name": "dsc",
                                      "concurrent": false,
                                      "events": [

                                      ],
                                      "children": null
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "level": 3,
              "isActive": false,
              "name": "user-settings",
              "concurrent": false,
              "events": [

              ],
              "children": [
                {
                  "level": 4,
                  "isActive": false,
                  "name": "profile",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "accounts",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "createSizmekAccount",
                      "func": "function () {\n\t          CMM.statechart.send('accountSelection', {\n\t            sizmekConnect: 'sizmekConnect'\n\t          });\n\t        }"
                    },
                    {
                      "name": "reconnectSizmekAccount",
                      "func": "function (account) {\n\t          CMM.statechart.send('accountSelection', {\n\t            sizmekConnect: 'sizmekConnect',\n\t            account: account\n\t          });\n\t        }"
                    },
                    {
                      "name": "createOauthAccount",
                      "func": "function (adServerName) {\n\t          CMM.statechart.send('oauth', { connection: 'create', adServerName: adServerName });\n\t        }"
                    },
                    {
                      "name": "reconnectOauthAccount",
                      "func": "function (account) {\n\t          CMM.statechart.send('oauth', { connection: 'reconnect', account: account });\n\t        }"
                    }
                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "thirdPartyAccounts",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "createOauthAccount",
                      "func": "function (adServerName) {\n\t          CMM.statechart.send('oauth', { connection: 'create', adServerName: adServerName });\n\t        }"
                    },
                    {
                      "name": "reconnectOauthAccount",
                      "func": "function (account) {\n\t          CMM.statechart.send('oauth', { connection: 'reconnect', account: account });\n\t        }"
                    }
                  ],
                  "children": null
                }
              ]
            },
            {
              "level": 3,
              "isActive": false,
              "name": "unauthorized",
              "concurrent": false,
              "events": [

              ],
              "children": null
            },
            {
              "level": 3,
              "isActive": false,
              "name": "initiative",
              "concurrent": true,
              "events": [
                {
                  "name": "campaignSelected",
                  "func": "function (campaign) {\n\t    this.goto('../campaign', {\n\t      context: {\n\t        campaignId: campaign.id\n\t      }\n\t    });\n\t  }"
                }
              ],
              "children": [
                {
                  "level": 4,
                  "isActive": false,
                  "name": "dialog",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": [
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "none",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "editInitiative",
                          "func": "function () {\n\t        this.goto('../editInitiative');\n\t      }"
                        },
                        {
                          "name": "createCampaign",
                          "func": "function () {\n\t        this.goto('../createCampaign');\n\t      }"
                        }
                      ],
                      "children": null
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "editInitiative",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "cancelEditInitiative",
                          "func": "function () {\n\t        CMM.appState.initiative.undoChanges();\n\t        this.goto('../none');\n\t      }"
                        },
                        {
                          "name": "initiativeSaved",
                          "func": "function () {\n\t        var initiative = CMM.appState.initiative;\n\t        CMM.appState.breadCrumbs = [{\n\t          name: initiative.name\n\t        }];\n\t        CMM.analytics.track('initiativeEdited', { initiativeId: initiative.id });\n\t        this.goto('../none');\n\t      }"
                        }
                      ],
                      "children": null
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "createCampaign",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "filterOptions",
                          "func": "function (filterQuery) {\n\t        if (!CMM.appState.campaign.client.restrictedAccess) {\n\t          CMM.appState.filteredUserList.query({\n\t            term: filterQuery,\n\t            status: CMM.User.ACTIVE_OR_PENDING\n\t          });\n\t        }\n\t      }"
                        },
                        {
                          "name": "cancelEditCampaign",
                          "func": "function () {\n\t        CMM.appState.campaign.initiative = undefined;\n\t        this.goto('../none');\n\t      }"
                        },
                        {
                          "name": "saveCampaign",
                          "func": "function () {\n\t        var campaign = CMM.appState.campaign;\n\t        var initiative = campaign.initiative;\n\n\t        CMM.analytics.track('campaignCreated', {\n\t          campaignName: campaign.name,\n\t          campaignId: campaign.id,\n\t          initiativeId: initiative.id,\n\t          budget: initiative.budget,\n\t          startDate: initiative.startDate,\n\t          endDate: initiative.endDate,\n\t          objectives: campaign.objectives.map(function (o) {\n\t            return o.getPath('objectiveType.name');\n\t          })\n\t        });\n\n\t        this.goto('../../../campaign', {\n\t          context: {\n\t            initiativeId: initiative.id,\n\t            campaignId: campaign.id\n\t          }\n\t        });\n\t      }"
                        }
                      ],
                      "children": null
                    }
                  ]
                }
              ]
            },
            {
              "level": 3,
              "isActive": false,
              "name": "agency-settings",
              "concurrent": false,
              "events": [
                {
                  "name": "marginSetSuccess",
                  "func": "function (showMargin) {\n\t    CMM.flash.confirm('Changes saved successfully!');\n\t    CMM.analytics.track('marginSet', { margin: showMargin });\n\t  }"
                },
                {
                  "name": "billingDownloadRequested",
                  "func": "function (eventName) {\n\t    CMM.analytics.track(eventName);\n\t  }"
                },
                {
                  "name": "billingReportsGenerated",
                  "func": "function (billingPeriodLabel) {\n\t    CMM.flash.confirm('Billing reports are completed for ' + billingPeriodLabel + '.');\n\t    CMM.analytics.track('billingReportsGenerated');\n\t  }"
                },
                {
                  "name": "closeBillingPeriod",
                  "func": "function (currentPeriod) {\n\t    CMM.flash.confirm('Billing period is closed for ' + currentPeriod + '.');\n\t    CMM.analytics.track('billingPeriodClosed');\n\t  }"
                },
                {
                  "name": "openBillingPeriod",
                  "func": "function (previousPeriod) {\n\t    CMM.flash.confirm('Billing period is open for ' + previousPeriod + '.');\n\t    CMM.analytics.track('billingPeriodReopened');\n\t  }"
                },
                {
                  "name": "closeBillingModal",
                  "func": "function () {\n\t    this.params({ showBillingModal: false });\n\t    CMM.appState.showBillingModal = undefined;\n\t  }"
                },
                {
                  "name": "selectAgencySettingsTab",
                  "func": "function (tab) {\n\t    if (this.resolve(tab)) {\n\t      this.goto(tab);\n\t    }\n\t  }"
                },
                {
                  "name": "agencySaved",
                  "func": "function () {\n\t    CMM.flash.confirm('Changes saved succesfully');\n\t  }"
                },
                {
                  "name": "editUser",
                  "func": "function (agencyId, userId) {\n\t    this.goto('../agency-users/edit', {\n\t      context: {\n\t        id: agencyId,\n\t        userId: userId\n\t      }\n\t    });\n\t  }"
                },
                {
                  "name": "goToClient",
                  "func": "function (clientId) {\n\t    this.goto('../agency-clients/edit', {\n\t      force: true,\n\t      context: { id: clientId }\n\t    });\n\t  }"
                }
              ],
              "children": [
                {
                  "level": 4,
                  "isActive": false,
                  "name": "profile",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "users",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "createUser",
                      "func": "function (agencyId) {\n\t      this.goto('../../agency-users/create', {\n\t        context: {\n\t          id: agencyId\n\t        }\n\t      });\n\t    }"
                    }
                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "clients",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "clientSearch",
                      "func": "function (_ref) {\n\t      var term = _ref.term;\n\t      var page = _ref.page;\n\n\t      CMM.appState.clientSearchQuery = term;\n\t      this.params({ term: term, page: page });\n\t      CMM.appState.clientSearchResults.query({ term: term, page: page, searchWithBrands: true });\n\t    }"
                    }
                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "campaigns",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "terms",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "returnToAgencyTsAndCs",
                      "func": "function (page) {\n\t        page = page || this.params().page;\n\t        this.params({ page: page });\n\t        CMM.appState.allTermsAndConditions.query({ page: page });\n\t        this.goto('none');\n\t      }"
                    },
                    {
                      "name": "setAgencyActiveTermsAndConditions",
                      "func": "function (terms) {\n\t        terms.makeActive().then(function () {\n\t          CMM.statechart.send('returnToAgencyTsAndCs', 1);\n\t        });\n\t      }"
                    },
                    {
                      "name": "changeTabPage",
                      "func": "function (_ref2) {\n\t        var page = _ref2.page;\n\n\t        this.params({ page: page });\n\t        CMM.appState.allTermsAndConditions.query({ page: page });\n\t      }"
                    }
                  ],
                  "children": [
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "none",
                      "concurrent": false,
                      "events": [
                        {
                          "name": "createNewTermsAndConditionsThroughModal",
                          "func": "function () {\n\t          this.goto(\"../agency-terms-create\");\n\t        }"
                        }
                      ],
                      "children": null
                    },
                    {
                      "level": 5,
                      "isActive": false,
                      "name": "agency-terms-create",
                      "concurrent": false,
                      "events": [

                      ],
                      "children": null
                    }
                  ]
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "billing",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "thirdPartyServiceProviders",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "handleSearchChange",
                      "func": "function (_ref4) {\n\t        var searchTerm = _ref4.searchTerm;\n\t        var searchType = _ref4.searchType;\n\t        var page = _ref4.page;\n\n\t        if (page) {\n\t          this.params({ page: page });\n\t        }\n\n\t        CMM.appState.thirdPartyServiceProviders.query({\n\t          searchTerm: searchTerm,\n\t          searchType: searchType,\n\t          page: page || this.params().page || 1\n\t        });\n\t      }"
                    }
                  ],
                  "children": null
                }
              ]
            },
            {
              "level": 3,
              "isActive": false,
              "name": "thirdPartyServiceProviders",
              "concurrent": false,
              "events": [
                {
                  "name": "returnToAgencySettings",
                  "func": "function () {\n\t    this.goto('../agency-settings/thirdPartyServiceProviders', {\n\t      context: { tab: 'thirdPartyServiceProviders' }\n\t    });\n\t  }"
                }
              ],
              "children": [
                {
                  "level": 4,
                  "isActive": false,
                  "name": "create",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "edit",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                }
              ]
            },
            {
              "level": 3,
              "isActive": false,
              "name": "agency-users",
              "concurrent": false,
              "events": [
                {
                  "name": "userSaved",
                  "func": "function (user, isNew) {\n\t    var currentUser = CMM.seeds.currentUser;\n\n\t    if (currentUser.agency && isNew) {\n\t      CMM.analytics.track('userInvited', {\n\t        inviterEmail: currentUser.email,\n\t        inviterId: currentUser.id,\n\t        inviterAgencyName: currentUser.agency.name,\n\t        inviterAgencyId: currentUser.agency.id,\n\t        inviteeEmail: user.email,\n\t        inviteeFirstName: user.firstName,\n\t        inviteeLastName: user.lastName\n\t      });\n\t    }\n\n\t    if (user.id === CMM.seeds.currentUser.id) {\n\t      // Force page reload incase of permission changes\n\t      setTimeout(function () {\n\t        window.location.reload();\n\t      }, 500);\n\t    }\n\n\t    if (CMM.utils.userCan('manage', 'all')) {\n\t      this.goto('../agency-management/edit/users', {\n\t        context: {\n\t          id: user.agency.id\n\t        }\n\t      });\n\t    } else {\n\t      this.goto('../agency-settings', {\n\t        context: {\n\t          id: user.agency.id,\n\t          tab: 'users'\n\t        }\n\t      });\n\t    }\n\t  }"
                },
                {
                  "name": "back",
                  "func": "function (agencyId) {\n\t    if (CMM.utils.userCan('manage', 'all')) {\n\t      this.goto('../agency-management/edit/users', {\n\t        context: {\n\t          id: agencyId\n\t        }\n\t      });\n\t    } else {\n\t      this.goto('../agency-settings', {\n\t        context: {\n\t          id: agencyId,\n\t          tab: 'users'\n\t        }\n\t      });\n\t    }\n\t  }"
                }
              ],
              "children": [
                {
                  "level": 4,
                  "isActive": false,
                  "name": "create",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "edit",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "resendInvite",
                      "func": "function () {\n\t      var pendingInvite = CMM.appState.getPath('editUser.pendingInvite');\n\t      if (pendingInvite) {\n\t        pendingInvite.cancelInvite().then(function () {\n\t          new CMM.Invite({\n\t            user: CMM.appState.editUser,\n\t            roles: pendingInvite.roles\n\t          }).save();\n\t        }).then(function () {\n\t          CMM.flash.confirm('Invite resent');\n\t        }).catch(function () {\n\t          CMM.flash.alert('Invite could not be resent');\n\t        });\n\t      }\n\t    }"
                    },
                    {
                      "name": "resendCanceledInvite",
                      "func": "function () {\n\t      var _this = this;\n\n\t      var canceledInviteRoles = CMM.appState.getPath('editUser.canceledInvite.roles') || [];\n\n\t      var newInvite = new CMM.Invite({\n\t        user: CMM.appState.editUser,\n\t        roles: canceledInviteRoles\n\t      });\n\n\t      newInvite.save().then(function () {\n\t        CMM.flash.confirm('Invite resent');\n\t        if (_this.isCurrent(_this.path())) {\n\t          CMM.appState.editUser = CMM.User.get(CMM.appState.editUser.id, { edit: true, refresh: true });\n\t        }\n\t      }).catch(function () {\n\t        CMM.flash.alert('Invite could not be resent');\n\t      });\n\t    }"
                    },
                    {
                      "name": "cancelInvite",
                      "func": "function () {\n\t      var _this2 = this;\n\n\t      var pendingInvite = CMM.appState.getPath('editUser.pendingInvite');\n\t      var user = CMM.appState.getPath('editUser');\n\n\t      if (pendingInvite) {\n\t        pendingInvite.cancelInvite().then(function () {\n\t          CMM.flash.confirm('Invite canceled');\n\t          if (_this2.isCurrent(_this2.path())) {\n\t            CMM.appState.editUser = CMM.User.get(user.id, { edit: true, refresh: true });\n\t          }\n\t        }).catch(function () {\n\t          CMM.flash.alert('Invite cannot be canceled');\n\t        });\n\t      }\n\t    }"
                    },
                    {
                      "name": "deactivateUser",
                      "func": "function () {\n\t      var _this3 = this;\n\n\t      var user = CMM.appState.getPath('editUser');\n\t      user.delete().then(function () {\n\t        CMM.flash.confirm('User deactivated');\n\t        if (_this3.isCurrent(_this3.path())) {\n\t          CMM.appState.editUser = CMM.User.get(user.id, { edit: true, refresh: true });\n\t        }\n\t      }).catch(function (e) {\n\t        return CMM.flash.alert('An error occurred: ' + e);\n\t      });\n\t    }"
                    },
                    {
                      "name": "removeUser",
                      "func": "function () {\n\t      var _this4 = this;\n\n\t      var user = CMM.appState.getPath('editUser');\n\t      user.delete().then(function () {\n\t        CMM.flash.confirm('User removed');\n\t        _this4.goto('../../agency-settings', {\n\t          context: {\n\t            tab: 'users'\n\t          }\n\t        });\n\t      }).catch(function (e) {\n\t        return CMM.flash.alert('An error occurred: ' + e);\n\t      });\n\t    }"
                    }
                  ],
                  "children": null
                }
              ]
            },
            {
              "level": 3,
              "isActive": false,
              "name": "<nameless>",
              "concurrent": false,
              "events": [

              ],
              "children": null
            },
            {
              "level": 3,
              "isActive": false,
              "name": "agency-clients",
              "concurrent": false,
              "events": [
                {
                  "name": "returnToAgencySettings",
                  "func": "function () {\n\t    this.goto('../agency-settings', {\n\t      context: { tab: 'clients' }\n\t    });\n\t  }"
                }
              ],
              "children": [
                {
                  "level": 4,
                  "isActive": false,
                  "name": "create",
                  "concurrent": false,
                  "events": [

                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "edit",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "goToClient",
                      "func": "function (clientId) {\n\t      this.goto('.', {\n\t        force: true,\n\t        context: { id: clientId }\n\t      });\n\t    }"
                    }
                  ],
                  "children": null
                }
              ]
            },
            {
              "level": 3,
              "isActive": false,
              "name": "terms-and-conditions-local",
              "concurrent": false,
              "events": [
                {
                  "name": "returnFromTermsAndConditions",
                  "func": "function () {\n\t    this.goto('/app/mainView/agency-settings', {\n\t      context: {\n\t        tab: 'terms'\n\t      }\n\t    });\n\t  }"
                }
              ],
              "children": [
                {
                  "level": 4,
                  "isActive": false,
                  "name": "create",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "termsAndConditionsSaved",
                      "func": "function (tcId) {\n\t      this.goto('/app/mainView/agency-settings', {\n\t        context: {\n\t          tab: 'terms'\n\t        }\n\t      });\n\t    }"
                    }
                  ],
                  "children": null
                },
                {
                  "level": 4,
                  "isActive": false,
                  "name": "edit",
                  "concurrent": false,
                  "events": [
                    {
                      "name": "termsAndConditionsSaved",
                      "func": "function (tcId) {\n\t      this.goto('/app/mainView/agency-settings', {\n\t        context: {\n\t          tab: 'terms'\n\t        }\n\t      });\n\t    }"
                    }
                  ],
                  "children": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}